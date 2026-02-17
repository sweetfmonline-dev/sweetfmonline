-- Sweet FM Online initial schema for Supabase
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  avatar text,
  bio text,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text,
  featured_image text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  author_id uuid not null references public.authors(id) on delete restrict,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_breaking boolean not null default false,
  is_featured boolean not null default false,
  read_time integer,
  tags text[] not null default '{}'
);

create table if not exists public.breaking_news (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  url text,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_authors_slug on public.authors(slug);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_category_id on public.articles(category_id);
create index if not exists idx_articles_author_id on public.articles(author_id);
create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_articles_is_featured on public.articles(is_featured);
create index if not exists idx_breaking_news_timestamp on public.breaking_news(timestamp desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_authors_updated_at on public.authors;
create trigger set_authors_updated_at
before update on public.authors
for each row execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.breaking_news enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories
for select
using (true);

drop policy if exists "Public read authors" on public.authors;
create policy "Public read authors"
on public.authors
for select
using (true);

drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles"
on public.articles
for select
using (true);

drop policy if exists "Public read breaking news" on public.breaking_news;
create policy "Public read breaking news"
on public.breaking_news
for select
using (true);
