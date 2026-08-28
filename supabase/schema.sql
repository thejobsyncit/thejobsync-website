-- The Jobsync — Supabase schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- once per project, before starting the backend.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- blogs
-- ---------------------------------------------------------------------
create table if not exists blogs (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null,
  category     text default 'General',
  author       text default 'The Jobsync Team',
  author_role  text default 'IT Consultant',
  date         text,
  read_time    text,
  cover_image  text default '',
  images       jsonb default '[]'::jsonb,
  excerpt      text,
  content      text not null,
  created_at   timestamptz not null default now()
);
create index if not exists blogs_slug_idx on blogs (slug);
create index if not exists blogs_created_at_idx on blogs (created_at desc);

-- ---------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text default 'Client',
  company     text default 'Enterprise Partner',
  avatar      text default '',
  rating      integer default 5,
  category    text default 'IT Consulting',
  quote       text not null,
  created_at  timestamptz not null default now()
);
create index if not exists testimonials_created_at_idx on testimonials (created_at desc);

-- ---------------------------------------------------------------------
-- inquiries (contact form submissions)
-- ---------------------------------------------------------------------
create table if not exists inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text default 'N/A',
  message     text not null,
  date        text,
  status      text not null default 'New'
              check (status in ('New', 'In Progress', 'Contacted', 'Resolved')),
  created_at  timestamptz not null default now()
);
create index if not exists inquiries_created_at_idx on inquiries (created_at desc);

-- ---------------------------------------------------------------------
-- careers (job postings)
-- ---------------------------------------------------------------------
create table if not exists careers (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  department  text default 'Engineering',
  type        text default 'Full-Time',
  location    text default 'Remote / Hybrid',
  experience  text default '2+ Years',
  status      text default 'Active',
  created_at  timestamptz not null default now()
);
create index if not exists careers_created_at_idx on careers (created_at desc);

-- ---------------------------------------------------------------------
-- admin_users
-- ---------------------------------------------------------------------
create table if not exists admin_users (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  password    text not null,
  role        text default 'Administrator',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- The backend talks to Supabase using the service_role key, which
-- bypasses RLS entirely. RLS is enabled here with no public policies
-- so these tables stay unreachable from the browser using the anon key.
-- ---------------------------------------------------------------------
alter table blogs         enable row level security;
alter table testimonials  enable row level security;
alter table inquiries     enable row level security;
alter table careers       enable row level security;
alter table admin_users   enable row level security;
