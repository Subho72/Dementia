create extension if not exists pgcrypto;

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  user_phone text,
  user_age text,
  user_gender text,
  assessment_type text not null,
  results jsonb not null,
  score integer not null,
  risk_level text not null check (risk_level in ('low','moderate','high')),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_assessments_created_at on public.assessments (created_at desc);
create index if not exists idx_assessments_user_phone on public.assessments (user_phone);

alter table public.assessments enable row level security;
-- NOTE: Access is via server-side service role in our route handler. No public policies are added here.
