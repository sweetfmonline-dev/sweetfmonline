import { cache } from "react";
import type { Article, Author, BreakingNews, Category, Advertisement, AdPosition } from "@/types";
import { isSupabaseConfigured, supabaseRestFetch } from "@/lib/supabase";

// Contentful CDA is disabled – all reads come from Supabase.
// Contentful is only used via the Management API webhook for writes.

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  parent_category_id: string | null;
}

interface AuthorRow {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  bio: string | null;
  role: string | null;
}

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  featured_image: string;
  published_at: string;
  updated_at: string | null;
  is_breaking: boolean;
  is_featured: boolean;
  read_time: number | null;
  tags: string[] | null;
  category: CategoryRow | null;
  author: AuthorRow | null;
}

interface BreakingNewsRow {
  id: string;
  headline: string;
  url: string | null;
  timestamp: string;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    color: row.color || undefined,
  };
}

function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    avatar: row.avatar || undefined,
    bio: row.bio || undefined,
    role: row.role || undefined,
  };
}

function mapArticle(row: ArticleRow): Article {
  const fallbackCategory: Category = {
    id: "",
    name: "Uncategorized",
    slug: "uncategorized",
  };

  const fallbackAuthor: Author = {
    id: "",
    name: "Staff Writer",
    slug: "staff-writer",
  };

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content ? (typeof row.content === "string" ? JSON.parse(row.content) : row.content) : undefined,
    featuredImage: row.featured_image,
    publishedAt: row.published_at,
    updatedAt: row.updated_at || undefined,
    isBreaking: row.is_breaking,
    isFeatured: row.is_featured,
    readTime: row.read_time || undefined,
    tags: row.tags || [],
    category: row.category ? mapCategory(row.category) : fallbackCategory,
    author: row.author ? mapAuthor(row.author) : fallbackAuthor,
  };
}

function mapBreakingNews(row: BreakingNewsRow): BreakingNews {
  return {
    id: row.id,
    headline: row.headline,
    url: row.url || undefined,
    timestamp: row.timestamp,
  };
}

const articleSelect =
  "id,title,slug,excerpt,content,featured_image,published_at,updated_at,is_breaking,is_featured,read_time,tags,category:categories(id,name,slug,description,color,parent_category_id),author:authors(id,name,slug,avatar,bio,role)";

async function trySupabaseCategories(): Promise<Category[] | null> {
  if (!isSupabaseConfigured) return null;

  const rows = await supabaseRestFetch<CategoryRow>({
    table: "categories",
    select: "id,name,slug,description,color",
    order: { column: "name", ascending: true },
    limit: 100,
  });

  return rows.length > 0 ? rows.map(mapCategory) : [];
}

async function trySupabaseArticles(limit: number): Promise<Article[] | null> {
  if (!isSupabaseConfigured) return null;

  const rows = await supabaseRestFetch<ArticleRow>({
    table: "articles",
    select: articleSelect,
    order: { column: "published_at", ascending: false },
    limit,
  });

  return rows.length > 0 ? rows.map(mapArticle) : [];
}

async function trySupabaseFeaturedArticles(): Promise<Article[] | null> {
  if (!isSupabaseConfigured) return null;

  const rows = await supabaseRestFetch<ArticleRow>({
    table: "articles",
    select: articleSelect,
    filters: { is_featured: "eq.true" },
    order: { column: "published_at", ascending: false },
  });

  return rows.length > 0 ? rows.map(mapArticle) : [];
}

async function trySupabaseArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured) return null;

  const rows = await supabaseRestFetch<ArticleRow>({
    table: "articles",
    select: articleSelect,
    filters: { slug: `eq.${slug}` },
    limit: 1,
  });

  if (rows.length === 0) return null;
  return mapArticle(rows[0]);
}

async function trySupabaseArticlesByCategoryTree(parentSlug: string): Promise<Article[] | null> {
  if (!isSupabaseConfigured) return null;

  const parentRows = await supabaseRestFetch<CategoryRow>({
    table: "categories",
    select: "id,slug,name,description,color,parent_category_id",
    filters: { slug: `eq.${parentSlug}` },
    limit: 1,
  });

  if (parentRows.length === 0) return [];

  const parentId = parentRows[0].id;

  const subcatRows = await supabaseRestFetch<CategoryRow>({
    table: "categories",
    select: "id",
    filters: { parent_category_id: `eq.${parentId}` },
  });

  const ids = [parentId, ...subcatRows.map((c) => c.id)];

  const rows = await supabaseRestFetch<ArticleRow>({
    table: "articles",
    select: articleSelect,
    filters: { category_id: `in.(${ids.join(",")})` },
    order: { column: "published_at", ascending: false },
  });

  return rows.length > 0 ? rows.map(mapArticle) : [];
}

async function trySupabaseArticlesByCategory(categorySlug: string): Promise<Article[] | null> {
  if (!isSupabaseConfigured) return null;

  const categories = await supabaseRestFetch<CategoryRow>({
    table: "categories",
    select: "id,slug,name,description,color,parent_category_id",
    filters: { slug: `eq.${categorySlug}` },
    limit: 1,
  });

  if (categories.length === 0) return [];

  const rows = await supabaseRestFetch<ArticleRow>({
    table: "articles",
    select: articleSelect,
    filters: { category_id: `eq.${categories[0].id}` },
    order: { column: "published_at", ascending: false },
  });

  return rows.length > 0 ? rows.map(mapArticle) : [];
}

async function trySupabaseBreakingNews(): Promise<BreakingNews[] | null> {
  if (!isSupabaseConfigured) return null;

  const rows = await supabaseRestFetch<BreakingNewsRow>({
    table: "breaking_news",
    select: "id,headline,url,timestamp",
    order: { column: "timestamp", ascending: false },
    limit: 10,
  });

  return rows.length > 0 ? rows.map(mapBreakingNews) : [];
}

export const getArticles = cache(async (limit: number = 10): Promise<Article[]> => {
  try {
    const articles = await trySupabaseArticles(limit);
    return articles ?? [];
  } catch (e) {
    console.error("getArticles failed:", e);
    return [];
  }
});

export const getFeaturedArticles = cache(async (): Promise<Article[]> => {
  try {
    const articles = await trySupabaseFeaturedArticles();
    return articles ?? [];
  } catch (e) {
    console.error("getFeaturedArticles failed:", e);
    return [];
  }
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  try {
    return await trySupabaseArticleBySlug(slug);
  } catch (e) {
    console.error("getArticleBySlug failed:", e);
    return null;
  }
});

export const getArticlesByCategory = cache(async (categorySlug: string): Promise<Article[]> => {
  try {
    const articles = await trySupabaseArticlesByCategory(categorySlug);
    return articles ?? [];
  } catch (e) {
    console.error("getArticlesByCategory failed:", e);
    return [];
  }
});

// Returns articles from the given category AND any of its subcategories
export const getArticlesByCategoryTree = cache(async (parentSlug: string): Promise<Article[]> => {
  try {
    const articles = await trySupabaseArticlesByCategoryTree(parentSlug);
    return articles ?? [];
  } catch (e) {
    console.error("getArticlesByCategoryTree failed:", e);
    return [];
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const categories = await trySupabaseCategories();
    return categories ?? [];
  } catch (e) {
    console.error("getCategories failed:", e);
    return [];
  }
});

export const getBreakingNews = cache(async (): Promise<BreakingNews[]> => {
  try {
    const news = await trySupabaseBreakingNews();
    return news ?? [];
  } catch (e) {
    console.error("getBreakingNews failed:", e);
    return [];
  }
});

export const getTrendingArticles = cache(async (limit: number = 5): Promise<Article[]> => {
  try {
    const articles = await trySupabaseArticles(limit);
    return articles ?? [];
  } catch (e) {
    console.error("getTrendingArticles failed:", e);
    return [];
  }
});

export const getAdvertisements = cache(async (position?: AdPosition): Promise<Advertisement[]> => {
  // Advertisements are not yet in Supabase – return empty for now
  return [];
});
