-- ============================================================
-- ABHISHEK.OS — Portfolio CMS Schema
-- Run this once in your Supabase SQL editor
-- ============================================================

-- Profile (single row, id always = 1)
create table if not exists portfolio_profile (
  id int primary key default 1,
  name text not null,
  title text,
  tagline text,
  location text,
  email text,
  summary text,
  updated_at timestamptz default now()
);

-- Projects
create table if not exists portfolio_projects (
  id text primary key,
  name text not null,
  featured boolean default false,
  live text,
  github text,
  tags text[] default '{}',
  description text,
  details text[] default '{}',
  architecture jsonb default '[]',
  tech jsonb default '{}',
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- Experience
create table if not exists portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text,
  period text,
  location text,
  highlights text[] default '{}',
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- Certifications
create table if not exists portfolio_certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,
  code text,
  issued text,
  expires text,
  credential_id text,
  skills text[] default '{}',
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- RLS: allow public reads, no public writes
alter table portfolio_profile enable row level security;
alter table portfolio_projects enable row level security;
alter table portfolio_experience enable row level security;
alter table portfolio_certifications enable row level security;

create policy "Public read profile" on portfolio_profile for select using (true);
create policy "Public read projects" on portfolio_projects for select using (true);
create policy "Public read experience" on portfolio_experience for select using (true);
create policy "Public read certifications" on portfolio_certifications for select using (true);
