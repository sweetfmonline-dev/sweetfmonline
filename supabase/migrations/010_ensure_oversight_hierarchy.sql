-- Ensure the complete OverSight PI hierarchy exists in this project.
-- Creates missing rows and repairs parent links. Fully idempotent — safe to re-run.
--
-- Run AFTER migration 009. "All Reports" is NOT a database row; it's just the
-- landing view that aggregates articles from oversight-pi + all its subcategories.

-- 1. Ensure OverSight PI parent category exists
INSERT INTO public.categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid(),
  'OverSight PI',
  'oversight-pi',
  'Investigative reporting, editorials, and analysis from Sweet FM Online.',
  '#E60000',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'oversight-pi');

-- 2. Ensure Bolshevik Perspective exists as a subcategory
INSERT INTO public.categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid(),
  'Bolshevik Perspective',
  'bolshevik-perspective',
  'Editorials and commentary by Scott Bolshevik.',
  '#E60000',
  (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'bolshevik-perspective');

-- 3. Repair parent links for every OverSight PI subsection in case any were
--    inserted with a NULL parent_category_id (e.g. if migration 009 ran before
--    the parent existed).
UPDATE public.categories
SET parent_category_id = (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE slug IN (
    'bolshevik-perspective',
    'the-dossier',
    'fact-check',
    'the-long-read',
    'the-forum'
  )
  AND parent_category_id IS DISTINCT FROM (
    SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1
  );

-- 4. Verify — returns the full OverSight PI hierarchy after migration
SELECT
  c.slug,
  c.name,
  p.slug AS parent_slug
FROM public.categories c
LEFT JOIN public.categories p ON c.parent_category_id = p.id
WHERE c.slug = 'oversight-pi'
   OR c.parent_category_id = (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
ORDER BY c.parent_category_id NULLS FIRST, c.name;
