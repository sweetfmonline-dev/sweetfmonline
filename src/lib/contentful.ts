import { createClient, type Entry, type Asset, type EntrySkeletonType } from "contentful";
import type { Article, Author, Category, BreakingNews } from "@/types";

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
    content: (f.content as string) || undefined,
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

function transformBreakingNews(entry: Entry<EntrySkeletonType>): BreakingNews {
  const f = entry.fields;
  return {
    id: entry.sys.id,
    headline: (f.headline as string) || "",
    url: (f.url as string) || undefined,
    timestamp: entry.sys.createdAt,
  };
}

// ─── Mock data (fallback when Contentful has no content) ────────────

const mockCategories: Category[] = [
  { id: "1", name: "News", slug: "news", color: "#E60000" },
  { id: "2", name: "Politics", slug: "politics", color: "#1A1A1A" },
  { id: "3", name: "Business", slug: "business", color: "#0066CC" },
  { id: "4", name: "Sports", slug: "sports", color: "#FF6600" },
  { id: "5", name: "Entertainment", slug: "entertainment", color: "#CC00CC" },
  { id: "6", name: "World", slug: "world", color: "#006633" },
  { id: "7", name: "Opinion", slug: "opinion", color: "#663399" },
  { id: "8", name: "Technology", slug: "technology", color: "#0099CC" },
  { id: "9", name: "Health", slug: "health", color: "#009966" },
  { id: "10", name: "Elections", slug: "elections", color: "#CC6600" },
  { id: "11", name: "Regional", slug: "regional", color: "#996633" },
  { id: "12", name: "Crime", slug: "crime", color: "#990000" },
  { id: "13", name: "Education", slug: "education", color: "#336699" },
  { id: "14", name: "Arts & Culture", slug: "arts-culture", color: "#CC3366" },
  { id: "15", name: "Explainers", slug: "explainers", color: "#666699" },
];

const mockAuthors: Author[] = [
  { id: "1", name: "Kwame Asante", slug: "kwame-asante", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", role: "Senior Political Correspondent" },
  { id: "2", name: "Ama Serwaa", slug: "ama-serwaa", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", role: "Business Editor" },
  { id: "3", name: "Kofi Mensah", slug: "kofi-mensah", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", role: "Sports Analyst" },
  { id: "4", name: "Abena Osei", slug: "abena-osei", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop", role: "Entertainment & Showbiz Reporter" },
  { id: "5", name: "Yaw Boateng", slug: "yaw-boateng", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", role: "Technology Editor" },
  { id: "6", name: "Efua Mensimah", slug: "efua-mensimah", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", role: "Health Correspondent" },
];

const mockArticles: Article[] = [
  { id: "1", title: "Ghana's Economy Shows Strong Recovery Signs as GDP Growth Exceeds Expectations", slug: "ghana-economy-recovery-gdp-growth", excerpt: "The Bank of Ghana reports a 6.2% GDP growth in Q3, surpassing analyst predictions and signaling a robust economic recovery following global challenges.", featuredImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=800&fit=crop", category: mockCategories[2], author: mockAuthors[1], publishedAt: new Date(Date.now() - 3600000).toISOString(), isBreaking: true, isFeatured: true, readTime: 5, tags: ["Economy", "GDP", "Bank of Ghana"] },
  { id: "2", title: "Parliament Passes Historic Climate Change Bill with Bipartisan Support", slug: "parliament-climate-change-bill", excerpt: "In a landmark decision, Ghana's Parliament unanimously approves comprehensive climate legislation aimed at reducing carbon emissions by 45% by 2035.", featuredImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop", category: mockCategories[1], author: mockAuthors[0], publishedAt: new Date(Date.now() - 7200000).toISOString(), isFeatured: true, readTime: 4, tags: ["Parliament", "Climate", "Legislation"] },
  { id: "3", title: "Black Stars Captain Named African Footballer of the Year", slug: "black-stars-captain-african-footballer-year", excerpt: "Ghana's national team captain receives the prestigious CAF award following an exceptional season with both club and country.", featuredImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop", category: mockCategories[3], author: mockAuthors[2], publishedAt: new Date(Date.now() - 10800000).toISOString(), isFeatured: true, readTime: 3, tags: ["Black Stars", "Football", "CAF Awards"] },
  { id: "4", title: "New Tech Hub Opens in Accra, Creating 5,000 Jobs for Young Ghanaians", slug: "tech-hub-accra-jobs", excerpt: "The state-of-the-art technology center aims to position Ghana as West Africa's leading innovation destination, with partnerships from Google and Microsoft.", featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", category: mockCategories[7], author: mockAuthors[4], publishedAt: new Date(Date.now() - 14400000).toISOString(), isFeatured: true, readTime: 4, tags: ["Technology", "Jobs", "Innovation"] },
  { id: "5", title: "Regional Leaders Gather in Accra for ECOWAS Summit on Security", slug: "ecowas-summit-accra", excerpt: "West African heads of state convene to discuss regional security, economic integration, and democratic governance across the sub-region.", featuredImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", category: mockCategories[5], author: mockAuthors[0], publishedAt: new Date(Date.now() - 18000000).toISOString(), readTime: 6, tags: ["ECOWAS", "Diplomacy", "West Africa"] },
  { id: "6", title: "Cocoa Farmers Benefit from New Government Support Program in Western Region", slug: "cocoa-farmers-government-support", excerpt: "The Ministry of Agriculture launches a comprehensive initiative to boost cocoa production and improve farmer livelihoods across cocoa-growing regions.", featuredImage: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop", category: mockCategories[0], author: mockAuthors[1], publishedAt: new Date(Date.now() - 21600000).toISOString(), readTime: 4, tags: ["Agriculture", "Cocoa", "Farmers"] },
  { id: "7", title: "Sarkodie and Stonebwoy Headline Sold-Out Accra Music Festival", slug: "sarkodie-stonebwoy-accra-music-festival", excerpt: "Over 30,000 fans pack the Accra Sports Stadium for the biggest music event of the year, featuring top Ghanaian and African artistes.", featuredImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop", category: mockCategories[4], author: mockAuthors[3], publishedAt: new Date(Date.now() - 25200000).toISOString(), readTime: 3, tags: ["Music", "Showbiz", "Sarkodie", "Stonebwoy"] },
  { id: "8", title: "Ghana Health Service Launches Nationwide Malaria Vaccination Campaign", slug: "ghs-malaria-vaccination-campaign", excerpt: "The expanded programme targets children under five in all 16 regions, with WHO support and funding from the Global Fund.", featuredImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop", category: mockCategories[8], author: mockAuthors[5], publishedAt: new Date(Date.now() - 28800000).toISOString(), readTime: 5, tags: ["Health", "Malaria", "Vaccination", "GHS"] },
  { id: "9", title: "EC Announces Dates for 2028 District Assembly Elections", slug: "ec-district-assembly-elections-2028", excerpt: "The Electoral Commission outlines the roadmap for the upcoming district-level elections, including voter registration timelines.", featuredImage: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800&h=600&fit=crop", category: mockCategories[9], author: mockAuthors[0], publishedAt: new Date(Date.now() - 32400000).toISOString(), readTime: 4, tags: ["Elections", "EC", "District Assembly"] },
  { id: "10", title: "Ashanti Region Roads Get Major Facelift Under New Infrastructure Plan", slug: "ashanti-region-roads-infrastructure", excerpt: "The government commits GH₵2.5 billion to rehabilitate and construct key road networks across the Ashanti Region.", featuredImage: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop", category: mockCategories[10], author: mockAuthors[1], publishedAt: new Date(Date.now() - 36000000).toISOString(), readTime: 4, tags: ["Ashanti Region", "Roads", "Infrastructure"] },
  { id: "11", title: "Ghana's Education System Needs a Complete Overhaul — Here's Why", slug: "ghana-education-system-overhaul", excerpt: "A veteran educator argues that the current curriculum fails to prepare students for the demands of a modern, technology-driven economy.", featuredImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop", category: mockCategories[6], author: mockAuthors[0], publishedAt: new Date(Date.now() - 39600000).toISOString(), readTime: 7, tags: ["Opinion", "Education", "Reform"] },
  { id: "12", title: "Police Arrest Suspected Armed Robbers in Kumasi After Dramatic Chase", slug: "police-arrest-armed-robbers-kumasi", excerpt: "Three suspects apprehended following a high-speed pursuit through the Kumasi metropolis. Stolen items recovered.", featuredImage: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=600&fit=crop", category: mockCategories[11], author: mockAuthors[0], publishedAt: new Date(Date.now() - 43200000).toISOString(), readTime: 3, tags: ["Crime", "Police", "Kumasi"] },
  { id: "13", title: "WAEC Releases 2026 WASSCE Results: Pass Rate Improves to 68%", slug: "waec-wassce-results-2026", excerpt: "The West African Examinations Council reports a significant improvement in pass rates, crediting the Free SHS policy and teacher training investments.", featuredImage: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&h=600&fit=crop", category: mockCategories[12], author: mockAuthors[5], publishedAt: new Date(Date.now() - 46800000).toISOString(), readTime: 4, tags: ["Education", "WAEC", "WASSCE"] },
  { id: "14", title: "Kente Weaving Gets UNESCO Intangible Cultural Heritage Recognition", slug: "kente-weaving-unesco-recognition", excerpt: "Ghana's iconic Kente cloth tradition receives global recognition, boosting cultural tourism and artisan livelihoods in the Volta and Ashanti regions.", featuredImage: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&h=600&fit=crop", category: mockCategories[13], author: mockAuthors[3], publishedAt: new Date(Date.now() - 50400000).toISOString(), readTime: 5, tags: ["Culture", "Kente", "UNESCO", "Heritage"] },
  { id: "15", title: "Hearts of Oak Edge Kotoko in Thrilling Super Clash at Baba Yara", slug: "hearts-kotoko-super-clash", excerpt: "A late winner from the Phobians seals a dramatic 2-1 victory in the Ghana Premier League's biggest fixture of the season.", featuredImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop", category: mockCategories[3], author: mockAuthors[2], publishedAt: new Date(Date.now() - 54000000).toISOString(), readTime: 3, tags: ["GPL", "Hearts of Oak", "Kotoko", "Football"] },
  { id: "16", title: "Ghana Signs $3 Billion Deal for New Offshore Oil Block Development", slug: "ghana-offshore-oil-block-deal", excerpt: "The Petroleum Commission finalizes agreements with international partners to develop the Cape Three Points Deep Water block.", featuredImage: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=600&fit=crop", category: mockCategories[2], author: mockAuthors[1], publishedAt: new Date(Date.now() - 57600000).toISOString(), readTime: 5, tags: ["Oil", "Energy", "Petroleum"] },
];

const mockBreakingNews: BreakingNews[] = [
  { id: "1", headline: "BREAKING: Ghana's Economy Shows Strong Recovery Signs as GDP Growth Exceeds Expectations", url: "/article/ghana-economy-recovery-gdp-growth", timestamp: new Date().toISOString() },
  { id: "2", headline: "URGENT: Parliament Passes Historic Climate Change Bill with Bipartisan Support", url: "/article/parliament-climate-change-bill", timestamp: new Date().toISOString() },
  { id: "3", headline: "LIVE: Black Stars Captain Named African Footballer of the Year", url: "/article/black-stars-captain-african-footballer-year", timestamp: new Date().toISOString() },
  { id: "4", headline: "UPDATE: EC Announces Dates for 2028 District Assembly Elections", url: "/article/ec-district-assembly-elections-2028", timestamp: new Date().toISOString() },
];

// ─── API Functions — Contentful-first with mock fallback ────────────

export async function getArticles(limit: number = 10): Promise<Article[]> {
  if (client) {
    try {
      const entries = await client.getEntries({
        content_type: "article",
        limit,
        order: ["-sys.createdAt"],
        include: 2,
      });
      return entries.items.map(transformArticle);
    } catch (e) {
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockArticles.slice(0, limit);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  if (client) {
    try {
      const entries = await client.getEntries({
        content_type: "article",
        "fields.isFeatured": true,
        order: ["-sys.createdAt"],
        include: 2,
      });
      return entries.items.map(transformArticle);
    } catch (e) {
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockArticles.filter((a) => a.isFeatured);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (client) {
    try {
      // Try exact match first
      let entries = await client.getEntries({
        content_type: "article",
        "fields.slug": slug,
        limit: 1,
        include: 2,
      });
      // Fallback: slug may have whitespace in Contentful — match via [match]
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
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockArticles.find((a) => a.slug === slug) || null;
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  if (client) {
    try {
      // First get the category entry by slug
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
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockArticles.filter((a) => a.category.slug === categorySlug);
}

export async function getCategories(): Promise<Category[]> {
  if (client) {
    try {
      const entries = await client.getEntries({
        content_type: "category",
        order: ["fields.name"],
        limit: 100,
      });
      return entries.items.map(transformCategory);
    } catch (e) {
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockCategories;
}

export async function getBreakingNews(): Promise<BreakingNews[]> {
  if (client) {
    try {
      const entries = await client.getEntries({
        content_type: "breakingNews",
        order: ["-sys.createdAt"],
        limit: 10,
      });
      return entries.items.map(transformBreakingNews);
    } catch (e) {
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockBreakingNews;
}

export async function getTrendingArticles(limit: number = 5): Promise<Article[]> {
  if (client) {
    try {
      const entries = await client.getEntries({
        content_type: "article",
        order: ["-sys.createdAt"],
        limit,
        include: 2,
      });
      return entries.items.map(transformArticle);
    } catch (e) {
      console.warn("Contentful fetch failed, using mock data:", e);
    }
  }
  return mockArticles.slice(0, limit);
}

export { client };
