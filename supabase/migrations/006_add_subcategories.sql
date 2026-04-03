-- Add parent_category_id to support hierarchical categories
-- This allows subcategories like "Energy" to be children of "Business"

ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category_id TEXT REFERENCES categories(id) ON DELETE CASCADE;

-- Create index for faster parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);

-- Ensure main categories exist (update if they do)
INSERT INTO categories (id, name, slug, description, color, parent_category_id)
VALUES 
  (gen_random_uuid()::text, 'News', 'news', 'Latest news and current affairs', '#E60000', NULL),
  (gen_random_uuid()::text, 'Business', 'business', 'Business and economy news', '#0066CC', NULL),
  (gen_random_uuid()::text, 'World', 'world', 'International news and global events', '#00AA00', NULL),
  (gen_random_uuid()::text, 'Sport', 'sport', 'Sports news and updates', '#FF6600', NULL),
  (gen_random_uuid()::text, 'Entertainment', 'entertainment', 'Entertainment and lifestyle', '#9900CC', NULL),
  (gen_random_uuid()::text, 'Opinion', 'opinion', 'Opinion pieces and editorials', '#666666', NULL)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  parent_category_id = NULL;

-- Insert subcategories for News (lookup parent ID by slug)
INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Politics',
  'politics',
  'Political news and analysis',
  (SELECT id FROM categories WHERE slug = 'news' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'politics');

-- Insert subcategories for Business
INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Agribusiness',
  'agribusiness',
  'Agriculture and farming business',
  (SELECT id FROM categories WHERE slug = 'business' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'agribusiness');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Banking and Finance',
  'banking-and-finance',
  'Banking, finance, and markets',
  (SELECT id FROM categories WHERE slug = 'business' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'banking-and-finance');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Energy',
  'energy',
  'Energy sector news',
  (SELECT id FROM categories WHERE slug = 'business' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'energy');

-- Insert subcategories for World
INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Africa',
  'africa',
  'African news and events',
  (SELECT id FROM categories WHERE slug = 'world' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'africa');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Europe',
  'europe',
  'European news',
  (SELECT id FROM categories WHERE slug = 'world' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'europe');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'US',
  'us',
  'United States news',
  (SELECT id FROM categories WHERE slug = 'world' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'us');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Global',
  'global',
  'Global news and international affairs',
  (SELECT id FROM categories WHERE slug = 'world' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'global');

-- Insert subcategories for Entertainment
INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Music',
  'music',
  'Music news and releases',
  (SELECT id FROM categories WHERE slug = 'entertainment' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'music');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Movie',
  'movie',
  'Movie news and reviews',
  (SELECT id FROM categories WHERE slug = 'entertainment' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'movie');

INSERT INTO categories (id, name, slug, description, parent_category_id)
SELECT 
  gen_random_uuid()::text,
  'Fashion',
  'fashion',
  'Fashion and style',
  (SELECT id FROM categories WHERE slug = 'entertainment' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'fashion');

-- Update existing subcategories if they exist (set parent_category_id)
UPDATE categories SET parent_category_id = (SELECT id FROM categories WHERE slug = 'news' LIMIT 1) WHERE slug = 'politics';
UPDATE categories SET parent_category_id = (SELECT id FROM categories WHERE slug = 'business' LIMIT 1) WHERE slug IN ('agribusiness', 'banking-and-finance', 'energy');
UPDATE categories SET parent_category_id = (SELECT id FROM categories WHERE slug = 'world' LIMIT 1) WHERE slug IN ('africa', 'europe', 'us', 'global');
UPDATE categories SET parent_category_id = (SELECT id FROM categories WHERE slug = 'entertainment' LIMIT 1) WHERE slug IN ('music', 'movie', 'fashion');
