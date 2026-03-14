/**
 * One-time sync script to populate Supabase with existing Contentful data.
 * Uses the Contentful MANAGEMENT API (CMA) which has separate rate limits
 * from the Content Delivery API (CDA).
 *
 * Run with: npx tsx scripts/sync-contentful-to-supabase.ts
 */

const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
const contentfulManagementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const locale = "en-US";

if (!contentfulSpaceId || !contentfulManagementToken) {
  console.error("❌ CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN required");
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  process.exit(1);
}

const CMA_BASE = `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master`;

// ── Contentful CMA fetch ────────────────────────────────────────────

async function cmaFetch(path: string): Promise<any> {
  const url = `${CMA_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${contentfulManagementToken}` },
  });

  if (res.status === 429) {
    // Rate limited – wait and retry
    const retryAfter = Number(res.headers.get("x-contentful-ratelimit-reset") || "2");
    console.log(`  ⏳ Rate limited, waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return cmaFetch(path);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`CMA request failed (${res.status}): ${body}`);
  }

  return res.json();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Resolve an asset URL from its CMA sys link
async function resolveAssetUrl(assetLink: any): Promise<string | null> {
  if (!assetLink?.sys?.id) return null;
  try {
    const asset = await cmaFetch(`/assets/${assetLink.sys.id}`);
    const fileUrl = asset?.fields?.file?.[locale]?.url;
    return fileUrl ? `https:${fileUrl}` : null;
  } catch {
    return null;
  }
}

// ── Supabase helpers ────────────────────────────────────────────────

async function supabaseUpsert(table: string, data: any) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceKey!,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.warn(`  ⚠️  Supabase upsert to ${table} warning: ${error}`);
  }
}

// ── Sync functions ──────────────────────────────────────────────────

async function syncCategories() {
  console.log("📁 Syncing categories...");
  const data = await cmaFetch("/entries?content_type=category&limit=100");
  let count = 0;

  for (const entry of data.items) {
    const f = entry.fields;
    if (!f) continue;

    const slug = (f.slug?.[locale] || "").trim();
    if (!slug) { console.log(`  ⏭️  Skipping category with empty slug: ${entry.sys.id}`); continue; }

    await supabaseUpsert("categories", {
      id: entry.sys.id,
      name: f.name?.[locale] || "",
      slug,
      description: f.description?.[locale] || null,
      color: f.color?.[locale] || null,
    });
    count++;
  }

  console.log(`  ✅ Synced ${count} categories`);
}

async function syncAuthors() {
  console.log("👤 Syncing authors...");
  const data = await cmaFetch("/entries?content_type=author&limit=100");
  let count = 0;

  for (const entry of data.items) {
    const f = entry.fields;
    if (!f) continue;

    const authorSlug = (f.slug?.[locale] || "").trim();
    if (!authorSlug) { console.log(`  ⏭️  Skipping author with empty slug: ${entry.sys.id}`); continue; }

    const avatarUrl = await resolveAssetUrl(f.avatar?.[locale]);

    await supabaseUpsert("authors", {
      id: entry.sys.id,
      name: f.name?.[locale] || "",
      slug: authorSlug,
      avatar: avatarUrl,
      bio: f.bio?.[locale] || null,
      role: f.role?.[locale] || null,
    });
    count++;
  }

  console.log(`  ✅ Synced ${count} authors`);
}

async function syncArticles() {
  console.log("📰 Syncing articles...");
  let skip = 0;
  const limit = 50;
  let total = 0;

  while (true) {
    const data = await cmaFetch(
      `/entries?content_type=article&limit=${limit}&skip=${skip}&order=-sys.createdAt`
    );

    if (!data.items || data.items.length === 0) break;

    for (const entry of data.items) {
      const f = entry.fields;
      if (!f) continue;

      // Only sync published entries
      if (entry.sys.publishedAt === undefined) continue;

      const featuredImageUrl = await resolveAssetUrl(f.featuredImage?.[locale]);
      const categoryId = f.category?.[locale]?.sys?.id || null;
      const authorId = f.author?.[locale]?.sys?.id || null;

      const articleSlug = (f.slug?.[locale] || "").trim();
      if (!articleSlug) { console.log(`  ⏭️  Skipping article with empty slug: ${entry.sys.id}`); continue; }

      await supabaseUpsert("articles", {
        id: entry.sys.id,
        title: f.title?.[locale] || "",
        slug: articleSlug,
        excerpt: f.excerpt?.[locale] || "",
        content: f.content?.[locale] ? JSON.stringify(f.content[locale]) : null,
        featured_image: featuredImageUrl || "",
        published_at: f.publishedAt?.[locale] || entry.sys.firstPublishedAt || entry.sys.createdAt,
        updated_at: entry.sys.updatedAt,
        is_breaking: f.isBreaking?.[locale] || false,
        is_featured: f.isFeatured?.[locale] || false,
        read_time: f.readTime?.[locale] || null,
        tags: f.tags?.[locale] || null,
        category_id: categoryId,
        author_id: authorId,
      });
      total++;
    }

    console.log(`  📰 Synced ${total} articles so far...`);

    // Respect rate limits – small delay between pages
    await sleep(500);
    skip += limit;

    if (data.items.length < limit) break;
  }

  console.log(`  ✅ Synced ${total} articles total`);
}

async function syncBreakingNews() {
  console.log("🚨 Syncing breaking news...");
  const data = await cmaFetch("/entries?content_type=breakingNews&limit=100");
  let count = 0;

  for (const entry of data.items) {
    const f = entry.fields;
    if (!f) continue;

    await supabaseUpsert("breaking_news", {
      id: entry.sys.id,
      headline: f.headline?.[locale] || "",
      url: f.url?.[locale] || null,
      timestamp: f.timestamp?.[locale] || entry.sys.createdAt,
    });
    count++;
  }

  console.log(`  ✅ Synced ${count} breaking news items`);
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starting Contentful (CMA) → Supabase sync...\n");
  console.log("Using Management API (separate rate limits from CDA)\n");

  try {
    await syncCategories();
    await syncAuthors();
    await syncArticles();
    await syncBreakingNews();

    console.log("\n✨ Sync completed successfully!");
    console.log("Your site can now serve content from Supabase.");
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

main();
