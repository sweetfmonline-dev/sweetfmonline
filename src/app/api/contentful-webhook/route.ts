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
    // Verify webhook secret (supports Authorization header OR ?secret= query param)
    const authHeader = request.headers.get("authorization");
    const querySecret = new URL(request.url).searchParams.get("secret");
    const isAuthorized =
      WEBHOOK_SECRET &&
      (authHeader === `Bearer ${WEBHOOK_SECRET}` || querySecret === WEBHOOK_SECRET);

    if (!isAuthorized) {
      console.error("Webhook auth failed. Header:", authHeader ? "present" : "missing", "Query:", querySecret ? "present" : "missing");
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
      // Handle create/update/publish
      // Use payload fields directly (no CMA call needed for text data).
      // Only call CMA to resolve asset URLs (images), with graceful fallback.
      const fields = payload.fields;
      if (!fields) {
        console.log("No fields in payload, skipping");
        return NextResponse.json({ success: true, skipped: true });
      }

      switch (contentType) {
        case "article":
          await syncArticle(entryId, fields, payload.sys);
          break;
        case "category":
          await syncCategory(entryId, fields);
          break;
        case "author":
          await syncAuthor(entryId, fields);
          break;
        case "breakingNews":
          await syncBreakingNews(entryId, fields);
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

// ── Sync functions (use payload data directly) ──────────────────────

async function syncCategory(entryId: string, fields: Record<string, any>) {
  const slug = (fields.slug?.[locale] || "").trim();
  if (!slug) { console.log(`Category ${entryId}: empty slug, skipping`); return; }

  await supabaseUpsert("categories", {
    id: entryId,
    name: fields.name?.[locale] || "",
    slug,
    description: fields.description?.[locale] || null,
    color: fields.color?.[locale] || null,
  });
  console.log(`Synced category: ${slug}`);
}

async function syncAuthor(entryId: string, fields: Record<string, any>) {
  const slug = (fields.slug?.[locale] || "").trim();
  if (!slug) { console.log(`Author ${entryId}: empty slug, skipping`); return; }

  // Try to resolve avatar via CMA, fallback to null
  const avatarUrl = await resolveAssetUrl(fields.avatar?.[locale]);

  await supabaseUpsert("authors", {
    id: entryId,
    name: fields.name?.[locale] || "",
    slug,
    avatar: avatarUrl,
    bio: fields.bio?.[locale] || null,
    role: fields.role?.[locale] || null,
  });
  console.log(`Synced author: ${slug}`);
}

async function syncArticle(entryId: string, fields: Record<string, any>, sys: any) {
  const slug = (fields.slug?.[locale] || "").trim();
  if (!slug) { console.log(`Article ${entryId}: empty slug, skipping`); return; }

  // Try to resolve featured image via CMA, fallback to empty
  const featuredImageUrl = await resolveAssetUrl(fields.featuredImage?.[locale]);
  const categoryId = fields.category?.[locale]?.sys?.id || null;
  const authorId = fields.author?.[locale]?.sys?.id || null;

  await supabaseUpsert("articles", {
    id: entryId,
    title: fields.title?.[locale] || "",
    slug,
    excerpt: fields.excerpt?.[locale] || "",
    content: fields.content?.[locale] ? JSON.stringify(fields.content[locale]) : null,
    featured_image: featuredImageUrl || "",
    published_at: fields.publishedAt?.[locale] || sys?.firstPublishedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_breaking: fields.isBreaking?.[locale] || false,
    is_featured: fields.isFeatured?.[locale] || false,
    read_time: fields.readTime?.[locale] || null,
    tags: fields.tags?.[locale] || null,
    category_id: categoryId,
    author_id: authorId,
  });
  console.log(`Synced article: ${slug} (image: ${featuredImageUrl ? "yes" : "MISSING - CMA unavailable"})`);
}

async function syncBreakingNews(entryId: string, fields: Record<string, any>) {
  await supabaseUpsert("breaking_news", {
    id: entryId,
    headline: fields.headline?.[locale] || "",
    url: fields.url?.[locale] || null,
    timestamp: fields.timestamp?.[locale] || new Date().toISOString(),
  });
  console.log(`Synced breaking news: ${fields.headline?.[locale]}`);
}
