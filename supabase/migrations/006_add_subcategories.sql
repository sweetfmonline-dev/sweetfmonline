-- Add parent_category_id to support hierarchical categories
-- This allows subcategories like "Energy" to be children of "Business"

ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category_id TEXT REFERENCES categories(id) ON DELETE CASCADE;

-- Create index for faster parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);

-- Insert main categories (if they don't exist)
-- Use slug as conflict target since that's the unique constraint
INSERT INTO categories (id, name, slug, description, color, parent_category_id)
VALUES 
  ('news', 'News', 'news', 'Latest news and current affairs', '#E60000', NULL),
  ('business', 'Business', 'business', 'Business and economy news', '#0066CC', NULL),
  ('world', 'World', 'world', 'International news and global events', '#00AA00', NULL),
  ('sport', 'Sport', 'sport', 'Sports news and updates', '#FF6600', NULL),
  ('entertainment', 'Entertainment', 'entertainment', 'Entertainment and lifestyle', '#9900CC', NULL),
  ('opinion', 'Opinion', 'opinion', 'Opinion pieces and editorials', '#666666', NULL)
ON CONFLICT (slug) DO UPDATE SET
  parent_category_id = EXCLUDED.parent_category_id;

-- Insert subcategories for News
INSERT INTO categories (id, name, slug, description, parent_category_id)
VALUES 
  ('news-politics', 'Politics', 'politics', 'Political news and analysis', 'news')
ON CONFLICT (slug) DO UPDATE SET
  parent_category_id = EXCLUDED.parent_category_id;

-- Insert subcategories for Business
INSERT INTO categories (id, name, slug, description, parent_category_id)
VALUES 
  ('business-agribusiness', 'Agribusiness', 'agribusiness', 'Agriculture and farming business', 'business'),
  ('business-banking-and-finance', 'Banking and Finance', 'banking-and-finance', 'Banking, finance, and markets', 'business'),
  ('business-energy', 'Energy', 'energy', 'Energy sector news', 'business')
ON CONFLICT (slug) DO UPDATE SET
  parent_category_id = EXCLUDED.parent_category_id;

-- Insert subcategories for World
INSERT INTO categories (id, name, slug, description, parent_category_id)
VALUES 
  ('world-africa', 'Africa', 'africa', 'African news and events', 'world'),
  ('world-europe', 'Europe', 'europe', 'European news', 'world'),
  ('world-us', 'US', 'us', 'United States news', 'world'),
  ('world-global', 'Global', 'global', 'Global news and international affairs', 'world')
ON CONFLICT (slug) DO UPDATE SET
  parent_category_id = EXCLUDED.parent_category_id;

-- Insert subcategories for Entertainment
INSERT INTO categories (id, name, slug, description, parent_category_id)
VALUES 
  ('entertainment-music', 'Music', 'music', 'Music news and releases', 'entertainment'),
  ('entertainment-movie', 'Movie', 'movie', 'Movie news and reviews', 'entertainment'),
  ('entertainment-fashion', 'Fashion', 'fashion', 'Fashion and style', 'entertainment')
ON CONFLICT (slug) DO UPDATE SET
  parent_category_id = EXCLUDED.parent_category_id;
