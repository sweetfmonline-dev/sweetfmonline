-- Migration to update articles table with proper foreign key relationships

-- Drop old JSONB columns if they exist
ALTER TABLE articles DROP COLUMN IF EXISTS category;
ALTER TABLE articles DROP COLUMN IF EXISTS author;

-- Add foreign key columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='articles' AND column_name='category_id') THEN
    ALTER TABLE articles ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='articles' AND column_name='author_id') THEN
    ALTER TABLE articles ADD COLUMN author_id UUID REFERENCES authors(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at_desc ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON articles(is_breaking) WHERE is_breaking = true;
