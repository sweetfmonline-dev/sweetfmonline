-- Fix: Change UUID id columns to TEXT to support Contentful string IDs
-- Run this in Supabase SQL Editor

-- Drop existing tables (they should be empty since we haven't synced yet)
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.breaking_news CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;

-- Drop triggers and functions
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

-- Recreate with TEXT ids
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  avatar TEXT,
  bio TEXT,
  role TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT,
  featured_image TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  read_time INTEGER,
  tags TEXT[],
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id TEXT REFERENCES public.authors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.breaking_news (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  url TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  unsubscribe_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_authors_slug ON public.authors(slug);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_category_id ON public.articles(category_id);
CREATE INDEX idx_articles_author_id ON public.articles(author_id);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_is_featured ON public.articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_articles_is_breaking ON public.articles(is_breaking) WHERE is_breaking = true;
CREATE INDEX idx_breaking_news_timestamp ON public.breaking_news(timestamp DESC);
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_authors_updated_at BEFORE UPDATE ON public.authors
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_articles_updated_at BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "public_read_authors" ON public.authors FOR SELECT USING (true);
CREATE POLICY "public_read_articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "public_read_breaking_news" ON public.breaking_news FOR SELECT USING (true);

-- Newsletter policies
CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select_newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "public_update_newsletter" ON public.newsletter_subscribers FOR UPDATE USING (true);
