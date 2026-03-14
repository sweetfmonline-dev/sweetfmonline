-- Sweet FM Online - Combined Migration Script
-- Run this entire script in Supabase SQL Editor

-- Enable extensions
create extension if not exists pgcrypto;

-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Authors table
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

-- Articles table with foreign keys
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

-- Breaking news table
create table if not exists public.breaking_news (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  url text,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  unsubscribe_token VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_authors_slug on public.authors(slug);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_category_id on public.articles(category_id);
create index if not exists idx_articles_author_id on public.articles(author_id);
create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_articles_is_featured on public.articles(is_featured) WHERE is_featured = true;
create index if not exists idx_articles_is_breaking on public.articles(is_breaking) WHERE is_breaking = true;
create index if not exists idx_breaking_news_timestamp on public.breaking_news(timestamp desc);
create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);

-- Create updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply triggers
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

-- Enable Row Level Security
alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.breaking_news enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- RLS Policies for public read access
create policy "Allow public read access to categories"
  on public.categories for select
  using (true);

create policy "Allow public read access to authors"
  on public.authors for select
  using (true);

create policy "Allow public read access to articles"
  on public.articles for select
  using (true);

create policy "Allow public read access to breaking_news"
  on public.breaking_news for select
  using (true);

-- Newsletter RLS policies
create policy "Allow public insert to newsletter_subscribers"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Allow public select own subscription"
  on public.newsletter_subscribers for select
  using (true);

create policy "Allow public update own subscription"
  on public.newsletter_subscribers for update
  using (true);
