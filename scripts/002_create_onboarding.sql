create extension if not exists pgcrypto;

create table if not exists public.onboarding_profiles (
  id uuid primary key default gen_random_uuid(),
  user_name text,
  user_phone text unique,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_onboarding_created_at on public.onboarding_profiles (created_at desc);
create index if not exists idx_onboarding_user_phone on public.onboarding_profiles (user_phone);

alter table public.onboarding_profiles enable row level security;
-- NOTE: Access is via server-side service role in our route handler. No public policies are added here.
