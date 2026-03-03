# TSD-01: Database Schema — On-Demand Credit Model
**Project:** FoodSocial AI — SaaS Transformation
**Module:** Supabase PostgreSQL + Data Architecture
**Status:** DRAFT v2 — On-Demand Credits (Replicate model)
**Dependency:** None (foundational — all other TSDs depend on this)

---

## 1. Purpose
This TSD defines the database schema to transform FoodSocial AI into a pay-as-you-go SaaS product using prepaid credits. Users buy credit packs (€10, €20, €50, custom) and consume them per action. **No subscriptions, no monthly commitments, no billing cycles.**

---

## 2. Current State (What We Have)

```sql
profiles (
  id uuid PK → auth.users,
  email, full_name, avatar_url,
  tenant_id text DEFAULT 'default',
  quota_remaining int DEFAULT 50,  -- ⚠️ Static, no purchase logic
  created_at, updated_at
)

jobs (
  id uuid PK,
  user_id uuid FK → auth.users,
  status, style_id, narrative, aspect_ratio,
  input_image_url, output_image_url,
  business_name, location, post_context,
  result_data jsonb, error_message,
  created_at, updated_at
)
```

---

## 3. Target Schema

### 3.1 `credit_packs` — Purchasable Credit Packs (Catalog)
Read-only reference table. Defines the available top-up options.

```sql
create table if not exists public.credit_packs (
  id text primary key,                    -- 'pack_10', 'pack_20', 'pack_50'
  display_name text not null,             -- '40 créditos', '80 créditos', '200 créditos'
  credits int not null,                   -- 40, 80, 200
  price_eur numeric(6,2) not null,        -- 10.00, 20.00, 50.00
  stripe_price_id text,                   -- Stripe Price ID for one-time payment
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Seed packs (€0.25/credit)
insert into public.credit_packs (id, display_name, credits, price_eur) values
  ('pack_10', '40 créditos', 40, 10.00),
  ('pack_20', '80 créditos', 80, 20.00),
  ('pack_50', '200 créditos', 200, 50.00);
```

### 3.2 `credit_balances` — Current User Balance
One row per user. Simple counter.

```sql
create table if not exists public.credit_balances (
  user_id uuid references auth.users on delete cascade primary key,
  credits_remaining int not null default 0,
  total_purchased int not null default 0,   -- lifetime credits purchased
  total_consumed int not null default 0,    -- lifetime credits used
  updated_at timestamptz default now()
);

alter table public.credit_balances enable row level security;
create policy "Users can view own balance" on public.credit_balances
  for select using (auth.uid() = user_id);
```

### 3.3 `credit_transactions` — Audit Ledger
Append-only log. Every credit movement is recorded.

```sql
create table if not exists public.credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount int not null,                          -- positive = purchased/refunded, negative = consumed
  balance_after int not null,                   -- snapshot after this transaction
  type text not null
    check (type in ('purchase','generation','context_upload','refund','bonus','admin_adjustment')),
  reference_id text,                            -- job_id, stripe_payment_intent_id, etc.
  description text,
  created_at timestamptz default now()
);

create index idx_credit_tx_user on public.credit_transactions(user_id, created_at desc);

alter table public.credit_transactions enable row level security;
create policy "Users can view own transactions" on public.credit_transactions
  for select using (auth.uid() = user_id);
```

### 3.4 `context_photos` — Saved Restaurant Background Images
Users can save up to 10 interior/ambiance photos that persist across sessions and serve as backgrounds for AI generation. Each upload+analysis costs 2 credits (1+1).

```sql
create table if not exists public.context_photos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  image_url text not null,                -- Supabase Storage public URL
  thumbnail_url text,                     -- Smaller preview for the picker grid
  ai_description text,                    -- AI-generated description of the scene (used in prompt enrichment)
  label text,                             -- User-defined label, e.g. "Terraza noche", "Barra principal"
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Max 10 photos per user enforced at application level (not DB constraint)
create index idx_context_photos_user on public.context_photos(user_id, sort_order);

alter table public.context_photos enable row level security;

create policy "Users can view own context photos" on public.context_photos
  for select using (auth.uid() = user_id);

create policy "Users can insert own context photos" on public.context_photos
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own context photos" on public.context_photos
  for delete using (auth.uid() = user_id);

create policy "Users can update own context photos" on public.context_photos
  for update using (auth.uid() = user_id);
```

### 3.5 `profiles` — Modifications
Add Stripe customer reference. Keep `quota_remaining` temporarily for backward compat.

```sql
alter table public.profiles
  add column if not exists stripe_customer_id text;
```

### 3.6 `jobs` — Add Context Photo Reference
Link a generation job to the context photo used (if any).

```sql
alter table public.jobs
  add column if not exists context_photo_id uuid references public.context_photos(id);
```

---

## 4. Credit Cost Matrix

| Action | Credits | Notes |
|--------|:-------:|-------|
| `generate_image_standard` | 2 | Standard 1K quality |
| `generate_image_hd` | 3 | Future: 2K/4K |
| `upload_context_photo` | 1 | Interior photo for prompt enrichment |
| `context_photo_analysis` | 1 | AI description of uploaded context |
| `regenerate_variation` | 2 | New variation of existing job |

**Pricing logic:** €0.25/credit → 1 generation (2 cr) = €0.50 → COGS ~€0.09 → **Margin ~82%** ✅

---

## 5. Key Database Functions

### 5.1 `consume_credits()` — Atomic Deduction
```sql
create or replace function public.consume_credits(
  p_user_id uuid,
  p_amount int,
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
    (p_user_id, -p_amount, v_balance, 'generation', p_ref_id, p_description);

  return v_balance;
end;
$$ language plpgsql security definer;
```

### 5.2 `add_purchased_credits()` — After Stripe Payment
```sql
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
```

---

## 6. Migration Strategy
1. **Phase 1:** Create new tables (`credit_packs`, `credit_balances`, `credit_transactions`, `context_photos`) — zero impact.
2. **Phase 2:** Add `stripe_customer_id` to `profiles`, add `context_photo_id` to `jobs`.
3. **Phase 3:** Update `auth.py` to read from `credit_balances`.
4. **Phase 4:** Grant existing users a welcome bonus (e.g., 10 free credits) and deprecate `profiles.quota_remaining`.

---

## 7. Acceptance Criteria
- [ ] All tables created with RLS policies
- [ ] `consume_credits()` prevents negative balances atomically
- [ ] `add_purchased_credits()` correctly increments balance and logs the transaction
- [ ] `credit_transactions` provides a complete audit trail
- [ ] Seed data for 3 credit packs inserted
- [ ] `context_photos` table supports CRUD with RLS per user
- [ ] Max 10 context photos enforced at app level
- [ ] Zero breaking changes to existing `jobs` or `profiles` queries
