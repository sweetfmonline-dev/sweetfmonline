-- Add 4 new subcategories under OverSight PI to complete the editorial lineup.
-- Alongside the existing Bolshevik Perspective, these form the 5 core verticals.
--
-- Prerequisite: migration 008 must have been run so the `oversight-pi` parent
-- category exists. Safe to re-run (idempotent).

-- The Dossier — long-form investigations
INSERT INTO public.categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid(),
  'The Dossier',
  'the-dossier',
  'Long-form investigative reports on power, institutions, and public officials.',
  '#E60000',
  (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'the-dossier');

-- Fact Check — verification of political claims and viral misinformation
INSERT INTO public.categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid(),
  'Fact Check',
  'fact-check',
  'Verification of political claims, viral rumors, and statements from public figures.',
  '#E60000',
  (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'fact-check');

-- The Long Read — literary longform journalism, profiles, essays
INSERT INTO public.categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid(),
  'The Long Read',
  'the-long-read',
  'Literary longform journalism — profiles, essays, and cultural deep dives.',
  '#E60000',
  (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'the-long-read');

-- The Forum — guest voices and outside contributors
INSERT INTO public.categories (id, name, slug, description, color, parent_category_id)
SELECT
  gen_random_uuid(),
  'The Forum',
  'the-forum',
  'Guest voices — op-eds from academics, former officials, activists, and industry experts.',
  '#E60000',
  (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'the-forum');

-- Ensure parent links are correct for every OverSight PI subsection (idempotent)
UPDATE public.categories
SET parent_category_id = (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1)
WHERE slug IN ('the-dossier', 'fact-check', 'the-long-read', 'the-forum', 'bolshevik-perspective')
  AND parent_category_id IS DISTINCT FROM (SELECT id FROM public.categories WHERE slug = 'oversight-pi' LIMIT 1);
