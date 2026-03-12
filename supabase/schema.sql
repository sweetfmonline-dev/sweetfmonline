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

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  featured_image VARCHAR(1000) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  read_time INTEGER,
  tags TEXT[] NOT NULL DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
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

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_article_slug on public.comments(article_slug);
create index if not exists idx_comments_created_at on public.comments(created_at desc);

alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.breaking_news enable row level security;
alter table public.comments enable row level security;

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

drop policy if exists "Public read comments" on public.comments;
create policy "Public read comments"
on public.comments
for select
using (true);

drop policy if exists "Public insert comments" on public.comments;
create policy "Public insert comments"
on public.comments
for insert
with check (true);
