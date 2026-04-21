-- Add Bolshevik Report editorial category
-- Bolshevik Report is a punchy, in-depth editorial section with its own branded layout

INSERT INTO categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid()::text,
  'Bolshevik Report',
  'bolshevik-report',
  'Unfiltered. Unafraid. Uncompromising. In-depth editorial reporting.',
  '#B00000',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'bolshevik-report');
