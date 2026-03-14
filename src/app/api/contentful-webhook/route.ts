import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

const CMA_BASE = `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master`;
const locale = "en-US";

// ── Helpers ─────────────────────────────────────────────────────────

async function cmaFetch(path: string): Promise<any> {
  const res = await fetch(`${CMA_BASE}${path}`, {
    headers: { Authorization: `Bearer ${CONTENTFUL_MGMT_TOKEN}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function resolveAssetUrl(assetLink: any): Promise<string | null> {
  if (!assetLink?.sys?.id || !CONTENTFUL_MGMT_TOKEN) return null;
  try {
    const asset = await cmaFetch(`/assets/${assetLink.sys.id}`);
    const fileUrl = asset?.fields?.file?.[locale]?.url;
    return fileUrl ? `https:${fileUrl}` : null;
  } catch {
    return null;
  }
}

async function supabaseUpsert(table: string, data: Record<string, any>) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Supabase upsert to ${table} failed:`, error);
    throw new Error(`Supabase upsert failed: ${error}`);
  }
}

async function supabaseDelete(table: string, id: string) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_SERVICE_KEY!,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`Supabase delete from ${table} failed:`, error);
    throw new Error(`Supabase delete failed: ${error}`);
  }
}

// ── Main webhook handler ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization");
    if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.error("Webhook auth failed. Header:", authHeader ? "present" : "missing");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error("Supabase not configured in env vars");
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    // Contentful sends event info via headers
    const topic = request.headers.get("x-contentful-topic") || "";
    // topic format: "ContentManagement.Entry.publish" or "ContentManagement.Entry.delete" etc.
    const isDelete = topic.includes("delete") || topic.includes("unpublish");

    const payload = await request.json();
    const contentType = payload.sys?.contentType?.sys?.id;
    const entryId = payload.sys?.id;

    console.log("Webhook received:", { topic, contentType, entryId, isDelete });

    if (!contentType || !entryId) {
      console.log("Skipping - no contentType or entryId in payload");
      return NextResponse.json({ success: true, skipped: true });
    }

    if (isDelete) {
      // Handle deletes
      const tableMap: Record<string, string> = {
        article: "articles",
        category: "categories",
        author: "authors",
        breakingNews: "breaking_news",
      };
      const table = tableMap[contentType];
      if (table) {
        await supabaseDelete(table, entryId);
        console.log(`Deleted ${contentType} ${entryId} from ${table}`);
      }
    } else {
      // Handle create/update/publish – fetch full entry from CMA
      // The webhook payload fields may be incomplete (no resolved links),
      // so we fetch the full entry from the Management API instead.
      switch (contentType) {
        case "article":
          await syncArticleFromCMA(entryId);
          break;
        case "category":
          await syncCategoryFromCMA(entryId);
          break;
        case "author":
          await syncAuthorFromCMA(entryId);
          break;
        case "breakingNews":
          await syncBreakingNewsFromCMA(entryId);
          break;
        default:
          console.log(`Unhandled content type: ${contentType}`);
      }
    }

    // Revalidate relevant paths
    revalidatePath("/", "layout");
    revalidatePath("/article/[slug]", "page");
    revalidatePath("/category/[...slug]", "page");

    return NextResponse.json({ success: true, topic, contentType, entryId });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: String(error) },
      { status: 500 }
    );
  }
}

// ── Sync functions (fetch full entry from CMA) ─────────────────────

async function syncCategoryFromCMA(entryId: string) {
  const entry = await cmaFetch(`/entries/${entryId}`);
  if (!entry?.fields) { console.log(`Category ${entryId}: no fields`); return; }

  const f = entry.fields;
  const slug = (f.slug?.[locale] || "").trim();
  if (!slug) { console.log(`Category ${entryId}: empty slug, skipping`); return; }

  await supabaseUpsert("categories", {
    id: entryId,
    name: f.name?.[locale] || "",
    slug,
    description: f.description?.[locale] || null,
    color: f.color?.[locale] || null,
  });
  console.log(`Synced category: ${slug}`);
}

async function syncAuthorFromCMA(entryId: string) {
  const entry = await cmaFetch(`/entries/${entryId}`);
  if (!entry?.fields) { console.log(`Author ${entryId}: no fields`); return; }

  const f = entry.fields;
  const slug = (f.slug?.[locale] || "").trim();
  if (!slug) { console.log(`Author ${entryId}: empty slug, skipping`); return; }

  const avatarUrl = await resolveAssetUrl(f.avatar?.[locale]);

  await supabaseUpsert("authors", {
    id: entryId,
    name: f.name?.[locale] || "",
    slug,
    avatar: avatarUrl,
    bio: f.bio?.[locale] || null,
    role: f.role?.[locale] || null,
  });
  console.log(`Synced author: ${slug}`);
}

async function syncArticleFromCMA(entryId: string) {
  const entry = await cmaFetch(`/entries/${entryId}`);
  if (!entry?.fields) { console.log(`Article ${entryId}: no fields`); return; }

  const f = entry.fields;
  const slug = (f.slug?.[locale] || "").trim();
  if (!slug) { console.log(`Article ${entryId}: empty slug, skipping`); return; }

  const featuredImageUrl = await resolveAssetUrl(f.featuredImage?.[locale]);
  const categoryId = f.category?.[locale]?.sys?.id || null;
  const authorId = f.author?.[locale]?.sys?.id || null;

  await supabaseUpsert("articles", {
    id: entryId,
    title: f.title?.[locale] || "",
    slug,
    excerpt: f.excerpt?.[locale] || "",
    content: f.content?.[locale] ? JSON.stringify(f.content[locale]) : null,
    featured_image: featuredImageUrl || "",
    published_at: f.publishedAt?.[locale] || entry.sys.firstPublishedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_breaking: f.isBreaking?.[locale] || false,
    is_featured: f.isFeatured?.[locale] || false,
    read_time: f.readTime?.[locale] || null,
    tags: f.tags?.[locale] || null,
    category_id: categoryId,
    author_id: authorId,
  });
  console.log(`Synced article: ${slug}`);
}

async function syncBreakingNewsFromCMA(entryId: string) {
  const entry = await cmaFetch(`/entries/${entryId}`);
  if (!entry?.fields) { console.log(`BreakingNews ${entryId}: no fields`); return; }

  const f = entry.fields;

  await supabaseUpsert("breaking_news", {
    id: entryId,
    headline: f.headline?.[locale] || "",
    url: f.url?.[locale] || null,
    timestamp: f.timestamp?.[locale] || new Date().toISOString(),
  });
  console.log(`Synced breaking news: ${f.headline?.[locale]}`);
}
