/**
 * Contentful Setup Script — Plain Client API
 * Creates content models and seeds sample data for Sweet FM Online.
 * Run with: node scripts/setup-contentful.mjs
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local (Next.js doesn't do this for plain node scripts)
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env.local not found — rely on shell env
}

import pkg from "contentful-management";
const { createClient } = pkg;

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || "master";

if (!SPACE_ID || !CMA_TOKEN) {
  console.error(
    "Missing required env vars: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN"
  );
  process.exit(1);
}

const client = createClient(
  { accessToken: CMA_TOKEN },
  {
    type: "plain",
    defaults: { spaceId: SPACE_ID, environmentId: ENV_ID },
  }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("🔗 Connecting to Contentful (plain client)...");

  // Test connection by listing content types
  const existing = await client.contentType.getMany({});
  console.log(`✅ Connected! Found ${existing.items.length} existing content types.`);

  // ─── 1. Create Content Types ───────────────────────────────────────

  const existingIds = new Set(existing.items.map((ct) => ct.sys.id));

  async function upsertContentType(id, data) {
    if (existingIds.has(id)) {
      console.log(`  ⏭️  ${data.name} already exists — skipping`);
      return;
    }
    try {
      const ct = await client.contentType.createWithId({ contentTypeId: id }, data);
      await client.contentType.publish({ contentTypeId: id }, ct);
      console.log(`  ✅ ${data.name} created & published`);
    } catch (e) {
      console.log(`  ⏭️  ${data.name} — skipped (${e?.message || e?.status || "already exists"})`);
    }
  }

  // --- Author ---
  console.log("\n📝 Creating content types...");
  await upsertContentType("author", {
    name: "Author",
    displayField: "name",
    fields: [
      { id: "name", name: "Name", type: "Symbol", required: true },
      { id: "slug", name: "Slug", type: "Symbol", required: true, validations: [{ unique: true }] },
      { id: "avatar", name: "Avatar", type: "Link", linkType: "Asset", required: false },
      { id: "bio", name: "Bio", type: "Text", required: false },
      { id: "role", name: "Role", type: "Symbol", required: false },
    ],
  });

  // --- Category ---
  await upsertContentType("category", {
    name: "Category",
    displayField: "name",
    fields: [
      { id: "name", name: "Name", type: "Symbol", required: true },
      { id: "slug", name: "Slug", type: "Symbol", required: true, validations: [{ unique: true }] },
      { id: "description", name: "Description", type: "Text", required: false },
      { id: "color", name: "Color", type: "Symbol", required: false, validations: [{ regexp: { pattern: "^#[0-9A-Fa-f]{6}$" } }] },
    ],
  });

  // --- Article ---
  await upsertContentType("article", {
    name: "Article",
    displayField: "title",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      { id: "slug", name: "Slug", type: "Symbol", required: true, validations: [{ unique: true }] },
      { id: "excerpt", name: "Excerpt", type: "Text", required: true },
      { id: "content", name: "Content", type: "RichText", required: false },
      { id: "featuredImage", name: "Featured Image", type: "Link", linkType: "Asset", required: true },
      { id: "category", name: "Category", type: "Link", linkType: "Entry", required: true, validations: [{ linkContentType: ["category"] }] },
      { id: "author", name: "Author", type: "Link", linkType: "Entry", required: true, validations: [{ linkContentType: ["author"] }] },
      { id: "isBreaking", name: "Breaking News", type: "Boolean", required: false },
      { id: "isFeatured", name: "Featured", type: "Boolean", required: false },
      { id: "readTime", name: "Read Time (minutes)", type: "Integer", required: false },
      { id: "tags", name: "Tags", type: "Array", items: { type: "Symbol" }, required: false },
    ],
  });

  // --- Breaking News ---
  await upsertContentType("breakingNews", {
    name: "Breaking News",
    displayField: "headline",
    fields: [
      { id: "headline", name: "Headline", type: "Symbol", required: true },
      { id: "url", name: "URL", type: "Symbol", required: false },
    ],
  });

  // ─── 2. Seed Data ──────────────────────────────────────────────────

  console.log("\n🌱 Seeding data...");

  // Helper: localize fields
  function loc(fields) {
    const out = {};
    for (const [k, v] of Object.entries(fields)) out[k] = { "en-US": v };
    return out;
  }

  // Helper: create entry
  async function seedEntry(contentTypeId, entryId, fields) {
    try {
      const entry = await client.entry.createWithId(
        { contentTypeId, entryId },
        { fields: loc(fields) }
      );
      await client.entry.publish({ entryId }, entry);
      return entry;
    } catch (e) {
      // Entry likely already exists — try to fetch it
      try {
        return await client.entry.get({ entryId });
      } catch {
        throw e; // re-throw original if fetch also fails
      }
    }
  }

  // Helper: create asset from URL
  async function seedAsset(assetId, title, imageUrl) {
    try {
      const asset = await client.asset.createWithId(
        { assetId },
        {
          fields: {
            title: { "en-US": title },
            file: {
              "en-US": {
                contentType: "image/jpeg",
                fileName: `${assetId}.jpg`,
                upload: imageUrl,
              },
            },
          },
        }
      );
      await client.asset.processForAllLocales({}, asset);
      await sleep(4000);
      const latest = await client.asset.get({ assetId });
      await client.asset.publish({ assetId }, latest);
      return latest;
    } catch (e) {
      // Asset likely already exists — try to fetch it
      try {
        return await client.asset.get({ assetId });
      } catch {
        throw e; // re-throw original if fetch also fails
      }
    }
  }

  // --- Categories ---
  console.log("\n  📂 Categories...");
  const cats = [
    ["cat-news", "News", "news", "#E60000"],
    ["cat-politics", "Politics", "politics", "#1A1A1A"],
    ["cat-business", "Business", "business", "#0066CC"],
    ["cat-sports", "Sports", "sports", "#FF6600"],
    ["cat-entertainment", "Entertainment", "entertainment", "#CC00CC"],
    ["cat-world", "World", "world", "#006633"],
    ["cat-opinion", "Opinion", "opinion", "#663399"],
    ["cat-technology", "Technology", "technology", "#0099CC"],
    ["cat-health", "Health", "health", "#009966"],
    ["cat-elections", "Elections", "elections", "#CC6600"],
    ["cat-regional", "Regional", "regional", "#996633"],
    ["cat-crime", "Crime", "crime", "#990000"],
    ["cat-education", "Education", "education", "#336699"],
    ["cat-arts-culture", "Arts & Culture", "arts-culture", "#CC3366"],
    ["cat-explainers", "Explainers", "explainers", "#666699"],
  ];
  for (const [id, name, slug, color] of cats) {
    await seedEntry("category", id, { name, slug, color });
    console.log(`    ✅ ${name}`);
  }

  // --- Authors ---
  console.log("\n  👤 Authors...");
  const authors = [
    ["author-kwame", "Kwame Asante", "kwame-asante", "Senior Political Correspondent"],
    ["author-ama", "Ama Serwaa", "ama-serwaa", "Business Editor"],
    ["author-kofi", "Kofi Mensah", "kofi-mensah", "Sports Analyst"],
    ["author-abena", "Abena Osei", "abena-osei", "Entertainment & Showbiz Reporter"],
    ["author-yaw", "Yaw Boateng", "yaw-boateng", "Technology Editor"],
    ["author-efua", "Efua Mensimah", "efua-mensimah", "Health Correspondent"],
  ];
  for (const [id, name, slug, role] of authors) {
    await seedEntry("author", id, { name, slug, role });
    console.log(`    ✅ ${name}`);
  }

  // --- Images ---
  console.log("\n  🖼️  Images (this takes a minute)...");
  const images = [
    ["img-economy", "Ghana Economy", "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=800&fit=crop"],
    ["img-parliament", "Parliament", "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop"],
    ["img-football", "Football", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop"],
    ["img-tech-hub", "Tech Hub", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"],
    ["img-ecowas", "ECOWAS Summit", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"],
    ["img-cocoa", "Cocoa Farmers", "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop"],
    ["img-music", "Music Festival", "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop"],
    ["img-health", "Health Campaign", "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop"],
  ];
  for (const [id, title, url] of images) {
    await seedAsset(id, title, url);
    console.log(`    ✅ ${title}`);
  }

  // --- Articles ---
  console.log("\n  📰 Articles...");
  const link = (linkType, id) => ({ sys: { type: "Link", linkType, id } });
  const articles = [
    { id: "art-economy", title: "Ghana's Economy Shows Strong Recovery Signs as GDP Growth Exceeds Expectations", slug: "ghana-economy-recovery-gdp-growth", excerpt: "The Bank of Ghana reports a 6.2% GDP growth in Q3, surpassing analyst predictions and signaling a robust economic recovery.", cat: "cat-business", auth: "author-ama", img: "img-economy", isBreaking: true, isFeatured: true, readTime: 5, tags: ["Economy", "GDP", "Bank of Ghana"] },
    { id: "art-parliament", title: "Parliament Passes Historic Climate Change Bill with Bipartisan Support", slug: "parliament-climate-change-bill", excerpt: "Ghana's Parliament unanimously approves comprehensive climate legislation aimed at reducing carbon emissions by 45% by 2035.", cat: "cat-politics", auth: "author-kwame", img: "img-parliament", isBreaking: false, isFeatured: true, readTime: 4, tags: ["Parliament", "Climate", "Legislation"] },
    { id: "art-football", title: "Black Stars Captain Named African Footballer of the Year", slug: "black-stars-captain-african-footballer-year", excerpt: "Ghana's national team captain receives the prestigious CAF award following an exceptional season.", cat: "cat-sports", auth: "author-kofi", img: "img-football", isBreaking: false, isFeatured: true, readTime: 3, tags: ["Black Stars", "Football", "CAF Awards"] },
    { id: "art-tech", title: "New Tech Hub Opens in Accra, Creating 5,000 Jobs for Young Ghanaians", slug: "tech-hub-accra-jobs", excerpt: "The state-of-the-art technology center aims to position Ghana as West Africa's leading innovation destination.", cat: "cat-technology", auth: "author-yaw", img: "img-tech-hub", isBreaking: false, isFeatured: true, readTime: 4, tags: ["Technology", "Jobs", "Innovation"] },
    { id: "art-ecowas", title: "Regional Leaders Gather in Accra for ECOWAS Summit on Security", slug: "ecowas-summit-accra", excerpt: "West African heads of state convene to discuss regional security and democratic governance.", cat: "cat-world", auth: "author-kwame", img: "img-ecowas", isBreaking: false, isFeatured: false, readTime: 6, tags: ["ECOWAS", "Diplomacy", "West Africa"] },
    { id: "art-cocoa", title: "Cocoa Farmers Benefit from New Government Support Program", slug: "cocoa-farmers-government-support", excerpt: "The Ministry of Agriculture launches a comprehensive initiative to boost cocoa production.", cat: "cat-news", auth: "author-ama", img: "img-cocoa", isBreaking: false, isFeatured: false, readTime: 4, tags: ["Agriculture", "Cocoa", "Farmers"] },
    { id: "art-music", title: "Sarkodie and Stonebwoy Headline Sold-Out Accra Music Festival", slug: "sarkodie-stonebwoy-accra-music-festival", excerpt: "Over 30,000 fans pack the Accra Sports Stadium for the biggest music event of the year.", cat: "cat-entertainment", auth: "author-abena", img: "img-music", isBreaking: false, isFeatured: false, readTime: 3, tags: ["Music", "Showbiz", "Sarkodie", "Stonebwoy"] },
    { id: "art-health", title: "Ghana Health Service Launches Nationwide Malaria Vaccination Campaign", slug: "ghs-malaria-vaccination-campaign", excerpt: "The expanded programme targets children under five in all 16 regions.", cat: "cat-health", auth: "author-efua", img: "img-health", isBreaking: false, isFeatured: false, readTime: 5, tags: ["Health", "Malaria", "Vaccination", "GHS"] },
  ];

  for (const a of articles) {
    const { id, cat, auth, img, ...rest } = a;
    await seedEntry("article", id, {
      ...rest,
      category: link("Entry", cat),
      author: link("Entry", auth),
      featuredImage: link("Asset", img),
    });
    console.log(`    ✅ ${a.title.substring(0, 55)}...`);
  }

  // --- Breaking News ---
  console.log("\n  🔴 Breaking News...");
  const bns = [
    ["bn-1", "BREAKING: Ghana's Economy Shows Strong Recovery Signs as GDP Growth Exceeds Expectations", "/article/ghana-economy-recovery-gdp-growth"],
    ["bn-2", "URGENT: Parliament Passes Historic Climate Change Bill with Bipartisan Support", "/article/parliament-climate-change-bill"],
    ["bn-3", "LIVE: Black Stars Captain Named African Footballer of the Year", "/article/black-stars-captain-african-footballer-year"],
  ];
  for (const [id, headline, url] of bns) {
    await seedEntry("breakingNews", id, { headline, url });
    console.log(`    ✅ ${headline.substring(0, 55)}...`);
  }

  console.log("\n🎉 Contentful setup complete!");
  console.log(`   Content models: Author, Category, Article, BreakingNews`);
  console.log(`   Categories: ${cats.length}`);
  console.log(`   Authors: ${authors.length}`);
  console.log(`   Articles: ${articles.length}`);
  console.log(`   Breaking News: ${bns.length}`);
}

run().catch((err) => {
  console.error("❌ Setup failed:", err?.message || err);
  if (err?.details?.errors) {
    console.error("   Details:", JSON.stringify(err.details.errors, null, 2));
  }
  process.exit(1);
});
