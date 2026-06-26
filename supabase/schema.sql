-- Vintage Fabric — Supabase / Postgres schema (plan §5).
-- Run this in the Supabase SQL editor, then run seed.sql.
-- The site works WITHOUT this (it falls back to local seed data); add it when
-- you want leads to persist and /admin to show stored inquiries.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id          text primary key,
  name        text not null,
  slug        text unique not null,
  hero_image  text,
  description text,
  seo         jsonb,
  sort        int default 0
);

create table if not exists qualities (
  id          text primary key,
  name        text not null,
  code        text unique not null,
  slug        text unique not null,
  fabric_type text,
  width       text,
  composition text,
  foil        boolean default false,
  hero_image  text,
  category_id text references categories(id),
  seo         jsonb
);

create table if not exists collections (
  id          text primary key,
  title       text not null,
  slug        text unique not null,
  type        text default 'series',
  hero_image  text,
  description text,
  status      text default 'published',
  seo         jsonb
);

create table if not exists designs (
  id            text primary key,
  title         text not null,
  slug          text unique not null,
  design_no     text,
  category_id   text references categories(id),
  quality_id    text references qualities(id),
  collection_id text references collections(id),
  images        jsonb,         -- {front, back, neck, dupatta, colourways:[…]}
  description   text,
  status        text default 'published',
  seo           jsonb
);

create table if not exists collection_items (
  collection_id text references collections(id),
  design_id     text references designs(id),
  primary key (collection_id, design_id)
);

create table if not exists journal (
  id           text primary key,
  title        text not null,
  slug         text unique not null,
  excerpt      text,
  body         text,
  tags         text[],
  seo          jsonb,
  published_at timestamptz default now()
);

create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  type            text not null default 'inquiry',
  name            text not null,
  company         text,
  country         text,
  email           text not null,
  phone           text,
  message         text,
  interested_refs text[],
  source          text,
  utm             jsonb,
  status          text default 'new',
  created_at      timestamptz default now()
);

-- Row Level Security: lock down by default. The service-role key (used by the
-- server in /api/leads and /admin) bypasses RLS, so no public policies needed
-- for Stage 1. Add read policies later if you expose content via the anon key.
alter table leads enable row level security;
