# Sweet FM Online

Sweet FM Online is a Next.js news website with a data layer that supports:

1. Contentful (primary source when configured)
2. Supabase (fallback)
3. Local mock data (final fallback)

## 1) Environment setup

Copy `.env.example` to `.env.local` and fill in values.

Required for Supabase fallback:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

Contentful (recommended if you want to manage news from CMS):

```bash
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
CONTENTFUL_MANAGEMENT_TOKEN=your-management-token
CONTENTFUL_ENVIRONMENT_ID=master
```

To initialize Contentful content models and seed starter content:

```bash
node scripts/setup-contentful.mjs
```

## 2) Create database schema in Supabase

Run the SQL in:

`supabase/schema.sql`

You can paste this file in Supabase SQL Editor and execute it.

This creates:

- `categories`
- `authors`
- `articles`
- `breaking_news`

plus indexes, `updated_at` triggers, and read policies for anon users.

## 3) Seed initial data

Insert records into the tables in this order:

1. `categories`
2. `authors`
3. `articles`
4. `breaking_news`

You can use Supabase Table Editor or SQL inserts.

## 4) Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5) Deploy (Vercel)

Set the same environment variables in Vercel Project Settings > Environment Variables.

At minimum for production DB-backed content:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
