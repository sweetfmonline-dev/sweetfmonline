import { getArticles } from "@/lib/data";

export const revalidate = 30;

export async function GET() {
  const articles = await getArticles(100);

  const urls = articles
    .map((article) => {
      const pubDate = new Date(article.publishedAt).toISOString();
      return `
    <url>
      <loc>https://www.sweetfmonline.com/article/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>Sweet FM Online</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
      </news:news>
    </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
