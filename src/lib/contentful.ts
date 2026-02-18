import { createClient, type Entry, type Asset, type EntrySkeletonType } from "contentful";
import type { Article, Author, Category, BreakingNews, Advertisement, AdPosition } from "@/types";

// ─── Contentful Client ──────────────────────────────────────────────
const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const isConfigured = !!contentfulSpaceId && !!contentfulAccessToken;

const client = isConfigured
  ? createClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
    })
  : null;

// ─── Transform helpers ──────────────────────────────────────────────

function assetUrl(asset?: Asset): string {
  const file = asset?.fields?.file;
  if (!file) return "";
  const url = typeof file === "object" && "url" in file ? (file as { url: string }).url : "";
  return url.startsWith("//") ? `https:${url}` : url;
}

function transformCategory(entry: Entry<EntrySkeletonType>): Category {
  const f = entry.fields;
  return {
    id: entry.sys.id,
    name: (f.name as string) || "",
    slug: ((f.slug as string) || "").trim(),
    description: (f.description as string) || undefined,
    color: (f.color as string) || undefined,
  };
}

function transformAuthor(entry: Entry<EntrySkeletonType>): Author {
  const f = entry.fields;
  return {
    id: entry.sys.id,
    name: (f.name as string) || "",
    slug: (f.slug as string) || "",
    avatar: f.avatar ? assetUrl(f.avatar as Asset) : undefined,
    bio: (f.bio as string) || undefined,
    role: (f.role as string) || undefined,
  };
}

function transformArticle(entry: Entry<EntrySkeletonType>): Article {
  const f = entry.fields;
  const categoryEntry = f.category as Entry<EntrySkeletonType> | undefined;
  const authorEntry = f.author as Entry<EntrySkeletonType> | undefined;
  const imageAsset = f.featuredImage as Asset | undefined;

  return {
    id: entry.sys.id,
    title: (f.title as string) || "",
    slug: ((f.slug as string) || "").trim(),
    excerpt: (f.excerpt as string) || "",
    content: f.content || undefined,
    featuredImage: imageAsset ? assetUrl(imageAsset) : "",
    category: categoryEntry
      ? transformCategory(categoryEntry)
      : { id: "", name: "Uncategorized", slug: "uncategorized" },
    author: authorEntry
      ? transformAuthor(authorEntry)
      : { id: "", name: "Staff Writer", slug: "staff-writer" },
    publishedAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    isBreaking: (f.isBreaking as boolean) || false,
    isFeatured: (f.isFeatured as boolean) || false,
    readTime: (f.readTime as number) || undefined,
    tags: (f.tags as string[]) || [],
  };
}

function normalizeBreakingNewsUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  // If it's a full URL or already starts with /, use as-is
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) return trimmed;
  // Otherwise treat as an article slug
  return `/article/${trimmed}`;
}

function transformBreakingNews(entry: Entry<EntrySkeletonType>): BreakingNews {
  const f = entry.fields;
  return {
    id: entry.sys.id,
    headline: (f.headline as string) || "",
    url: normalizeBreakingNewsUrl(f.url as string),
    timestamp: entry.sys.createdAt,
  };
}

// ─── API Functions — Contentful only ─────────────────────────────────

export async function getArticles(limit: number = 10): Promise<Article[]> {
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "article",
      limit,
      order: ["-sys.createdAt"],
      include: 2,
    });
    return entries.items.map(transformArticle);
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return [];
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "article",
      "fields.isFeatured": true,
      order: ["-sys.createdAt"],
      include: 2,
    });
    return entries.items.map(transformArticle);
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!client) return null;
  try {
    let entries = await client.getEntries({
      content_type: "article",
      "fields.slug": slug,
      limit: 1,
      include: 2,
    });
    if (entries.items.length === 0) {
      entries = await client.getEntries({
        content_type: "article",
        "fields.slug[match]": slug,
        limit: 1,
        include: 2,
      });
    }
    return entries.items.length > 0 ? transformArticle(entries.items[0]) : null;
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return null;
  }
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  if (!client) return [];
  try {
    const catEntries = await client.getEntries({
      content_type: "category",
      "fields.slug": categorySlug,
      limit: 1,
    });
    if (catEntries.items.length === 0) return [];
    const catId = catEntries.items[0].sys.id;
    const entries = await client.getEntries({
      content_type: "article",
      "fields.category.sys.id": catId,
      order: ["-sys.createdAt"],
      include: 2,
    });
    return entries.items.map(transformArticle);
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "category",
      order: ["fields.name"],
      limit: 100,
    });
    return entries.items.map(transformCategory);
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return [];
  }
}

export async function getBreakingNews(): Promise<BreakingNews[]> {
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "breakingNews",
      order: ["-sys.createdAt"],
      limit: 10,
    });
    return entries.items.map(transformBreakingNews);
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return [];
  }
}

export async function getTrendingArticles(limit: number = 5): Promise<Article[]> {
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "article",
      order: ["-sys.createdAt"],
      limit,
      include: 2,
    });
    return entries.items.map(transformArticle);
  } catch (e) {
    console.warn("Contentful fetch failed:", e);
    return [];
  }
}

function transformAdvertisement(entry: Entry<EntrySkeletonType>): Advertisement {
  const f = entry.fields;
  const imageAsset = f.image as Asset | undefined;
  return {
    id: entry.sys.id,
    name: (f.name as string) || "",
    image: imageAsset ? assetUrl(imageAsset) : "",
    url: (f.url as string) || "#",
    position: ((f.position as string) || "sidebar") as AdPosition,
    isActive: (f.isActive as boolean) ?? true,
    startDate: (f.startDate as string) || undefined,
    endDate: (f.endDate as string) || undefined,
  };
}

export async function getAdvertisements(position?: AdPosition): Promise<Advertisement[]> {
  if (client) {
    try {
      const query: Record<string, unknown> = {
        content_type: "advertisement",
        "fields.isActive": true,
        limit: 20,
        include: 2,
      };
      if (position) query["fields.position"] = position;
      const entries = await client.getEntries(query);
      const now = new Date();
      return entries.items
        .map(transformAdvertisement)
        .filter((ad) => {
          if (ad.startDate && new Date(ad.startDate) > now) return false;
          if (ad.endDate && new Date(ad.endDate) < now) return false;
          return true;
        });
    } catch (e) {
      console.warn("Contentful ad fetch failed:", e);
    }
  }
  return [];
}

export { client };
