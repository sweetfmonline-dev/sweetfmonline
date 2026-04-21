-- Restructure editorial section:
--   OverSight PI (parent) replaces the old "Bolshevik Report" category
--   Bolshevik Perspective becomes a subcategory under OverSight PI for Scott Bolshevik editorials

-- 1. Rename bolshevik-report -> oversight-pi (preserves id, so any linked articles stay intact)
UPDATE categories
SET
  name = 'OverSight PI',
  slug = 'oversight-pi',
  description = 'Investigative reporting, editorials, and analysis from Sweet FM Online.',
  color = '#E60000'
WHERE slug = 'bolshevik-report';

-- 2. If the rename didn't happen (no existing row), insert OverSight PI fresh
INSERT INTO categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid()::text,
  'OverSight PI',
  'oversight-pi',
  'Investigative reporting, editorials, and analysis from Sweet FM Online.',
  '#E60000',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'oversight-pi');

-- 3. Add Bolshevik Perspective as a subcategory of OverSight PI
INSERT INTO categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid()::text,
  'Bolshevik Perspective',
  'bolshevik-perspective',
  'Editorials and commentary by Scott Bolshevik.',
  '#E60000',
  (SELECT id FROM categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'bolshevik-perspective');

-- 4. Ensure Bolshevik Perspective parent link is correct even if it already existed
UPDATE categories
SET parent_category_id = (SELECT id FROM categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE slug = 'bolshevik-perspective';
