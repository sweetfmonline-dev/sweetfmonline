# Webhook-Based CMS Architecture Setup Guide

This guide explains how to set up the webhook-based system where Contentful pushes updates to Supabase, drastically reducing API calls.

## Architecture Overview

```
Contentful CMS → Webhook → Your API → Supabase Database → Website
```

**Benefits:**
- 🚀 **~99% reduction in Contentful API calls**
- ⚡ **Faster page loads** (data served from Supabase)
- 💰 **Lower costs** (fewer API calls)
- 🔄 **Real-time updates** (webhook triggers instant sync)

---

## Setup Steps

### 1. Run Database Migrations

Go to your **Supabase Dashboard** → **SQL Editor** and run these migrations in order:

#### Migration 1: Base Schema
```sql
-- Copy and run the contents of: supabase/schema.sql
```

#### Migration 2: Newsletter Subscribers
```sql
-- Copy and run the contents of: supabase/migrations/002_create_newsletter_subscribers.sql
```

#### Migration 3: Foreign Key Relationships
```sql
-- Copy and run the contents of: supabase/migrations/003_update_articles_foreign_keys.sql
```

### 2. Add Environment Variables

#### Local Development (`.env.local`):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Contentful Webhook
CONTENTFUL_WEBHOOK_SECRET=your-random-secret-key
```

#### Vercel Production:
Add these to **Vercel Dashboard** → **Settings** → **Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)
- `CONTENTFUL_WEBHOOK_SECRET`

**To get your Supabase keys:**
1. Go to Supabase Dashboard → **Project Settings** → **API**
2. Copy `URL`, `anon/public` key, and `service_role` key

**Generate webhook secret:**
```bash
openssl rand -hex 32
```

### 3. Initial Data Sync

Populate Supabase with your existing Contentful data:

```bash
npm run sync
```

This will:
- ✅ Sync all categories
- ✅ Sync all authors
- ✅ Sync all articles
- ✅ Sync breaking news

### 4. Configure Contentful Webhooks

1. Go to **Contentful** → **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Configure:
   - **Name:** `Supabase Sync`
   - **URL:** `https://www.sweetfmonline.com/api/contentful-webhook`
   - **Headers:**
     - Key: `Authorization`
     - Value: `Bearer YOUR_CONTENTFUL_WEBHOOK_SECRET`
   - **Triggers:** Select all (Create, Update, Delete, Publish, Unpublish)
   - **Content types:** Select all (Article, Category, Author, Breaking News)
4. **Save**

### 5. Test the Webhook

1. Publish or update an article in Contentful
2. Check Vercel function logs:
   - Go to **Vercel Dashboard** → **Deployments** → **Functions**
   - Look for `/api/contentful-webhook` logs
3. Verify data in Supabase:
   - Go to **Supabase Dashboard** → **Table Editor**
   - Check the `articles` table

---

## How It Works

### Before (Direct CMS Calls):
```
User visits page → Next.js fetches from Contentful → Page renders
Every page load = 1+ API calls to Contentful
```

### After (Webhook + Database):
```
1. Editor publishes in Contentful
2. Contentful sends webhook to your API
3. API updates Supabase database
4. User visits page → Next.js fetches from Supabase → Page renders

Page loads = 0 Contentful API calls! ✨
```

---

## Data Flow

### When Content is Published:
1. **Contentful** → Webhook fires
2. **Your API** (`/api/contentful-webhook`) → Receives payload
3. **Supabase** → Data upserted
4. **Next.js** → Revalidates cached pages
5. **Users** → See updated content

### When Users Visit:
1. **Next.js** → Fetches from Supabase (primary)
2. **Fallback** → Contentful (if Supabase fails)
3. **Cache** → 5-10 minute revalidation

---

## Monitoring

### Check Webhook Logs:
- **Vercel:** Dashboard → Functions → `/api/contentful-webhook`
- **Contentful:** Settings → Webhooks → Activity Log

### Verify Data Sync:
- **Supabase:** Table Editor → Check tables
- **Website:** Visit pages and verify content

---

## Troubleshooting

### Webhook not firing:
- Check Contentful webhook activity log
- Verify webhook URL is correct
- Check authorization header matches secret

### Data not syncing:
- Check Vercel function logs for errors
- Verify Supabase service role key is correct
- Run manual sync: `npm run sync`

### Website showing old data:
- Trigger revalidation: Visit `/api/revalidate?secret=YOUR_SECRET`
- Check Supabase data is updated
- Clear browser cache

---

## Cost Savings

**Before:**
- ~1,000 Contentful API calls/day
- Approaching free tier limits

**After:**
- ~10 Contentful API calls/day (only webhooks)
- **99% reduction!**

---

## Next Steps

1. ✅ Run database migrations
2. ✅ Add environment variables
3. ✅ Run initial sync (`npm run sync`)
4. ✅ Configure Contentful webhook
5. ✅ Test by publishing content
6. ✅ Monitor logs and verify sync

Once set up, your website will be **faster, cheaper, and more scalable**! 🚀
