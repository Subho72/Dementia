-- id matches auth.users.id so we can enforce per-user access
create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can see and manage only their own profile
do $$
begin
  if not exists (
    select 1 from pg_policies where polname = 'Profiles select own'
  ) then
    create policy "Profiles select own" on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where polname = 'Profiles insert own'
  ) then
    create policy "Profiles insert own" on public.profiles
      for insert with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where polname = 'Profiles update own'
  ) then
    create policy "Profiles update own" on public.profiles
      for update using (auth.uid() = id);
  end if;
end $$;
