-- PROYECTO: FoodSocial AI
-- MANUAL DE BASE DE DATOS PARA SUPABASE

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- 2. TABLA DE PERFILES (Vinculada a auth.users de Supabase)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  tenant_id text default 'default',
  quota_remaining int default 50,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en profiles
alter table public.profiles enable row level security;

-- Política: Los usuarios pueden ver su propio perfil
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 3. TABLA DE TRABAJOS (JOBS) DE IA
create table if not exists public.jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  status text not null check (status in ('processing', 'completed', 'failed')),
  style_id text not null,
  narrative text,
  aspect_ratio text,
  input_image_url text not null,
  output_image_url text,
  business_name text,
  location text,
  post_context text,
  result_data jsonb, -- Almacena copy, hashtags, etc.
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS en jobs
alter table public.jobs enable row level security;

-- Política: Los usuarios pueden ver sus propios trabajos
create policy "Users can view own jobs" on public.jobs
  for select using (auth.uid() = user_id);

-- Política: Los usuarios pueden crear sus propios trabajos
create policy "Users can insert own jobs" on public.jobs
  for insert with check (auth.uid() = user_id);

-- 4. FUNCIÓN AUTOMÁTICA PARA CREAR PERFIL AL REGISTRARSE
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para ejecutar la función anterior
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
