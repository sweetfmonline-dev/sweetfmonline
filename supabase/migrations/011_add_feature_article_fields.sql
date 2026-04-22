-- Add optional "feature article" fields to the articles table.
-- These power the OverSight PI magazine-style article layout.
-- All fields are optional — the layout gracefully degrades when values are null/empty.
--
-- Field shapes:
--   kicker                  — short eyebrow text above headline (e.g. "In-Depth Profile · Power & Influence")
--   issue_label             — optional issue tag (e.g. "Special Profile Edition")
--   pull_quote              — large red pull-quote bar below the hero
--   pull_quote_attribution  — source/speaker attributed to the pull quote
--   sidebar_stats           — JSON array of { number: string, label: string }
--   key_roles               — JSON array of { period: string, role: string }
--   fast_facts              — JSON array of { label: string, value: string }
--   timeline                — JSON array of { year: string, title: string, description: string, highlight?: boolean }

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS kicker TEXT,
  ADD COLUMN IF NOT EXISTS issue_label TEXT,
  ADD COLUMN IF NOT EXISTS pull_quote TEXT,
  ADD COLUMN IF NOT EXISTS pull_quote_attribution TEXT,
  ADD COLUMN IF NOT EXISTS sidebar_stats JSONB,
  ADD COLUMN IF NOT EXISTS key_roles JSONB,
  ADD COLUMN IF NOT EXISTS fast_facts JSONB,
  ADD COLUMN IF NOT EXISTS timeline JSONB;

-- Sanity check
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'articles'
  AND column_name IN (
    'kicker', 'issue_label', 'pull_quote', 'pull_quote_attribution',
    'sidebar_stats', 'key_roles', 'fast_facts', 'timeline'
  )
ORDER BY column_name;
