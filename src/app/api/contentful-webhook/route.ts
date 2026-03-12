import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface ContentfulWebhookPayload {
  sys: {
    type: string;
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization");
    if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 503 }
      );
    }

    const payload: ContentfulWebhookPayload = await request.json();
    const contentType = payload.sys.contentType?.sys.id;
    const entryId = payload.sys.id;
    const eventType = payload.sys.type;

    console.log("Contentful webhook received:", {
      contentType,
      entryId,
      eventType,
    });

    // Handle different content types
    switch (contentType) {
      case "article":
        await syncArticle(payload, eventType);
        break;
      case "category":
        await syncCategory(payload, eventType);
        break;
      case "author":
        await syncAuthor(payload, eventType);
        break;
      case "breakingNews":
        await syncBreakingNews(payload, eventType);
        break;
      default:
        console.log(`Unhandled content type: ${contentType}`);
    }

    // Revalidate relevant paths
    revalidatePath("/", "layout");
    revalidatePath("/article/[slug]", "page");
    revalidatePath("/category/[...slug]", "page");

    return NextResponse.json({
      success: true,
      contentType,
      entryId,
      eventType,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: String(error) },
      { status: 500 }
    );
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
    throw new Error(`Supabase upsert failed: ${error}`);
  }

  return response.json();
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
    throw new Error(`Supabase delete failed: ${error}`);
  }
}

async function syncCategory(payload: ContentfulWebhookPayload, eventType: string) {
  if (eventType === "DeletedEntry") {
    await supabaseDelete("categories", payload.sys.id);
    return;
  }

  const fields = payload.fields;
  if (!fields) return;

  const categoryData = {
    id: payload.sys.id,
    name: fields.name?.["en-US"] || "",
    slug: (fields.slug?.["en-US"] || "").trim(),
    description: fields.description?.["en-US"] || null,
    color: fields.color?.["en-US"] || null,
  };

  await supabaseUpsert("categories", categoryData);
}

async function syncAuthor(payload: ContentfulWebhookPayload, eventType: string) {
  if (eventType === "DeletedEntry") {
    await supabaseDelete("authors", payload.sys.id);
    return;
  }

  const fields = payload.fields;
  if (!fields) return;

  const avatarUrl = fields.avatar?.["en-US"]?.fields?.file?.["en-US"]?.url;

  const authorData = {
    id: payload.sys.id,
    name: fields.name?.["en-US"] || "",
    slug: fields.slug?.["en-US"] || "",
    avatar: avatarUrl ? `https:${avatarUrl}` : null,
    bio: fields.bio?.["en-US"] || null,
    role: fields.role?.["en-US"] || null,
  };

  await supabaseUpsert("authors", authorData);
}

async function syncArticle(payload: ContentfulWebhookPayload, eventType: string) {
  if (eventType === "DeletedEntry") {
    await supabaseDelete("articles", payload.sys.id);
    return;
  }

  const fields = payload.fields;
  if (!fields) return;

  const featuredImageUrl = fields.featuredImage?.["en-US"]?.fields?.file?.["en-US"]?.url;
  const categoryId = fields.category?.["en-US"]?.sys?.id;
  const authorId = fields.author?.["en-US"]?.sys?.id;

  const articleData = {
    id: payload.sys.id,
    title: fields.title?.["en-US"] || "",
    slug: (fields.slug?.["en-US"] || "").trim(),
    excerpt: fields.excerpt?.["en-US"] || "",
    content: JSON.stringify(fields.content?.["en-US"]) || null,
    featured_image: featuredImageUrl ? `https:${featuredImageUrl}` : "",
    published_at: fields.publishedAt?.["en-US"] || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_breaking: fields.isBreaking?.["en-US"] || false,
    is_featured: fields.isFeatured?.["en-US"] || false,
    read_time: fields.readTime?.["en-US"] || null,
    tags: fields.tags?.["en-US"] || null,
    category_id: categoryId || null,
    author_id: authorId || null,
  };

  await supabaseUpsert("articles", articleData);
}

async function syncBreakingNews(payload: ContentfulWebhookPayload, eventType: string) {
  if (eventType === "DeletedEntry") {
    await supabaseDelete("breaking_news", payload.sys.id);
    return;
  }

  const fields = payload.fields;
  if (!fields) return;

  const breakingNewsData = {
    id: payload.sys.id,
    headline: fields.headline?.["en-US"] || "",
    url: fields.url?.["en-US"] || null,
    timestamp: fields.timestamp?.["en-US"] || new Date().toISOString(),
  };

  await supabaseUpsert("breaking_news", breakingNewsData);
}
