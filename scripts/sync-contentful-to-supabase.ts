/**
 * One-time sync script to populate Supabase with existing Contentful data
 * Run with: npx tsx scripts/sync-contentful-to-supabase.ts
 */

import { createClient } from "contentful";

const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!contentfulSpaceId || !contentfulAccessToken) {
  console.error("❌ Contentful credentials not found");
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase credentials not found");
  process.exit(1);
}

const contentful = createClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
});

async function supabaseUpsert(table: string, data: any) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase upsert failed: ${error}`);
  }
}

async function syncCategories() {
  console.log("📁 Syncing categories...");
  const entries = await contentful.getEntries({ content_type: "category", limit: 100 });

  for (const entry of entries.items) {
    const fields = entry.fields as any;
    await supabaseUpsert("categories", {
      id: entry.sys.id,
      name: fields.name || "",
      slug: (fields.slug || "").trim(),
      description: fields.description || null,
      color: fields.color || null,
    });
  }

  console.log(`✅ Synced ${entries.items.length} categories`);
}

async function syncAuthors() {
  console.log("👤 Syncing authors...");
  const entries = await contentful.getEntries({ content_type: "author", limit: 100 });

  for (const entry of entries.items) {
    const fields = entry.fields as any;
    const avatarUrl = fields.avatar?.fields?.file?.url;

    await supabaseUpsert("authors", {
      id: entry.sys.id,
      name: fields.name || "",
      slug: fields.slug || "",
      avatar: avatarUrl ? `https:${avatarUrl}` : null,
      bio: fields.bio || null,
      role: fields.role || null,
    });
  }

  console.log(`✅ Synced ${entries.items.length} authors`);
}

async function syncArticles() {
  console.log("📰 Syncing articles...");
  let skip = 0;
  const limit = 100;
  let total = 0;

  while (true) {
    const entries = await contentful.getEntries({
      content_type: "article",
      limit,
      skip,
      order: "-sys.createdAt",
    });

    if (entries.items.length === 0) break;

    for (const entry of entries.items) {
      const fields = entry.fields as any;
      const featuredImageUrl = fields.featuredImage?.fields?.file?.url;
      const categoryId = fields.category?.sys?.id;
      const authorId = fields.author?.sys?.id;

      await supabaseUpsert("articles", {
        id: entry.sys.id,
        title: fields.title || "",
        slug: (fields.slug || "").trim(),
        excerpt: fields.excerpt || "",
        content: JSON.stringify(fields.content) || null,
        featured_image: featuredImageUrl ? `https:${featuredImageUrl}` : "",
        published_at: fields.publishedAt || entry.sys.createdAt,
        updated_at: entry.sys.updatedAt,
        is_breaking: fields.isBreaking || false,
        is_featured: fields.isFeatured || false,
        read_time: fields.readTime || null,
        tags: fields.tags || null,
        category_id: categoryId || null,
        author_id: authorId || null,
      });

      total++;
    }

    console.log(`  Synced ${total} articles...`);
    skip += limit;

    if (entries.items.length < limit) break;
  }

  console.log(`✅ Synced ${total} articles total`);
}

async function syncBreakingNews() {
  console.log("🚨 Syncing breaking news...");
  const entries = await contentful.getEntries({
    content_type: "breakingNews",
    limit: 100,
  });

  for (const entry of entries.items) {
    const fields = entry.fields as any;

    await supabaseUpsert("breaking_news", {
      id: entry.sys.id,
      headline: fields.headline || "",
      url: fields.url || null,
      timestamp: fields.timestamp || entry.sys.createdAt,
    });
  }

  console.log(`✅ Synced ${entries.items.length} breaking news items`);
}

async function main() {
  console.log("🚀 Starting Contentful → Supabase sync...\n");

  try {
    await syncCategories();
    await syncAuthors();
    await syncArticles();
    await syncBreakingNews();

    console.log("\n✨ Sync completed successfully!");
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

main();
