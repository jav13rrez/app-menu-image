-- ============================================================
-- FOODSOCIAL AI — SaaS Migration: On-Demand Credit Model
-- Run this AFTER the existing supabase_setup.sql
-- ============================================================

-- 1. CREDIT PACKS (Catalog — read-only from app)
create table if not exists public.credit_packs (
  id text primary key,
  display_name text not null,
  credits int not null,
  price_eur numeric(6,2) not null,
  stripe_price_id text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Seed packs at €0.25/credit
-- ⚡ Pack de Lanzamiento (oferta temporal — modo test)
insert into public.credit_packs (id, display_name, credits, price_eur, stripe_price_id) values
  ('pack_launch', 'Pack Lanzamiento · 20 publicaciones', 40, 5.00, 'price_1T6vbhDcvABCRuSUJbSZzlbV'),
  ('pack_10',     '40 créditos (~20 publicaciones)',      40, 10.00, null),
  ('pack_20',     '80 créditos (~40 publicaciones)',      80, 20.00, null),
  ('pack_50',     '200 créditos (~100 publicaciones)',   200, 50.00, null)
on conflict (id) do update set
  stripe_price_id = excluded.stripe_price_id,
  display_name    = excluded.display_name;


-- 2. CREDIT BALANCES (One row per user)
create table if not exists public.credit_balances (
  user_id uuid references auth.users on delete cascade primary key,
  credits_remaining int not null default 0,
  total_purchased int not null default 0,
  total_consumed int not null default 0,
  updated_at timestamptz default now()
);

alter table public.credit_balances enable row level security;

create policy "Users can view own balance" on public.credit_balances
  for select using (auth.uid() = user_id);


-- 3. CREDIT TRANSACTIONS (Append-only audit ledger)
create table if not exists public.credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount int not null,
  balance_after int not null,
  type text not null
    check (type in ('purchase','generation','context_upload','refund','bonus','admin_adjustment')),
  reference_id text,
  description text,
  created_at timestamptz default now()
);

create index if not exists idx_credit_tx_user
  on public.credit_transactions(user_id, created_at desc);

alter table public.credit_transactions enable row level security;

create policy "Users can view own transactions" on public.credit_transactions
  for select using (auth.uid() = user_id);


-- 4. CONTEXT PHOTOS (Saved restaurant backgrounds)
create table if not exists public.context_photos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  image_url text not null,
  thumbnail_url text,
  ai_description text,
  label text default 'Mi espacio',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_context_photos_user
  on public.context_photos(user_id, sort_order);

alter table public.context_photos enable row level security;

create policy "Users can view own context photos" on public.context_photos
  for select using (auth.uid() = user_id);

create policy "Users can insert own context photos" on public.context_photos
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own context photos" on public.context_photos
  for delete using (auth.uid() = user_id);

create policy "Users can update own context photos" on public.context_photos
  for update using (auth.uid() = user_id);


-- 5. PROFILES — Add Stripe customer reference
alter table public.profiles
  add column if not exists stripe_customer_id text;


-- 6. JOBS — Add context photo reference
alter table public.jobs
  add column if not exists context_photo_id uuid references public.context_photos(id);


-- ============================================================
-- 7. DATABASE FUNCTIONS
-- ============================================================

-- 7a. consume_credits: Atomic deduction with audit log
create or replace function public.consume_credits(
  p_user_id uuid,
  p_amount int,
  p_type text default 'generation',
  p_ref_id text default null,
  p_description text default null
) returns int as $$
declare
  v_balance int;
begin
  update public.credit_balances
    set credits_remaining = credits_remaining - p_amount,
        total_consumed = total_consumed + p_amount,
        updated_at = now()
    where user_id = p_user_id
      and credits_remaining >= p_amount
    returning credits_remaining into v_balance;

  if not found then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  insert into public.credit_transactions
    (user_id, amount, balance_after, type, reference_id, description)
  values
    (p_user_id, -p_amount, v_balance, p_type, p_ref_id, p_description);

  return v_balance;
end;
$$ language plpgsql security definer;


-- 7b. add_purchased_credits: Called after Stripe payment
create or replace function public.add_purchased_credits(
  p_user_id uuid,
  p_amount int,
  p_stripe_payment_id text
) returns int as $$
declare
  v_balance int;
begin
  insert into public.credit_balances (user_id, credits_remaining, total_purchased, updated_at)
  values (p_user_id, p_amount, p_amount, now())
  on conflict (user_id)
  do update set
    credits_remaining = credit_balances.credits_remaining + p_amount,
    total_purchased = credit_balances.total_purchased + p_amount,
    updated_at = now()
  returning credits_remaining into v_balance;

  insert into public.credit_transactions
    (user_id, amount, balance_after, type, reference_id, description)
  values
    (p_user_id, p_amount, v_balance, 'purchase', p_stripe_payment_id,
     format('Compra de %s créditos', p_amount));

  return v_balance;
end;
$$ language plpgsql security definer;


-- 7c. grant_welcome_bonus: Called on new user signup
create or replace function public.grant_welcome_bonus(
  p_user_id uuid,
  p_amount int default 10
) returns int as $$
declare
  v_balance int;
begin
  insert into public.credit_balances (user_id, credits_remaining, total_purchased, updated_at)
  values (p_user_id, p_amount, 0, now())
  on conflict (user_id) do nothing
  returning credits_remaining into v_balance;

  if found then
    insert into public.credit_transactions
      (user_id, amount, balance_after, type, description)
    values
      (p_user_id, p_amount, p_amount, 'bonus', 'Bienvenido — 10 créditos gratis');
  end if;

  return coalesce(v_balance, 0);
end;
$$ language plpgsql security definer;


-- ============================================================
-- 8. UPDATE SIGNUP TRIGGER TO GRANT WELCOME BONUS
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- Grant 10 free credits on signup
  perform public.grant_welcome_bonus(new.id, 10);

  return new;
end;
$$ language plpgsql security definer;
