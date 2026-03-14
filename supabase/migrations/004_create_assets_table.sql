-- Create assets table to store Contentful asset URLs locally
-- This eliminates the need to call Contentful CMA to resolve image URLs

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  content_type TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_updated_at ON assets(updated_at DESC);

-- RLS: public read access
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for assets"
  ON assets FOR SELECT
  USING (true);
