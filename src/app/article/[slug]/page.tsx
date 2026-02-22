import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { getArticleBySlug, getTrendingArticles, getArticlesByCategory, getAdvertisements } from "@/lib/data";
import { TrendingSidebar, ArticleCard } from "@/components/news";
import { ShareBar } from "@/components/news/ShareBar";
import { RichTextRenderer } from "@/components/news/RichTextRenderer";
import { CommentsSection } from "@/components/news/CommentsSection";
import { AdBanner } from "@/components/ads";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found" };

  const shortTitle = article.title.length > 55
    ? article.title.slice(0, 55).trimEnd() + "…"
    : article.title;
  const shortDesc = article.excerpt.length > 155
    ? article.excerpt.slice(0, 155).trimEnd() + "…"
    : article.excerpt;
  const canonicalUrl = `https://www.sweetfmonline.com/article/${slug}`;

  return {
    title: shortTitle,
    description: shortDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: shortDesc,
      url: canonicalUrl,
      images: [article.featuredImage],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: shortDesc,
      images: [article.featuredImage],
    },
  };
}

// Revalidate article pages every 60 seconds (ISR)
export const revalidate = 30;

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const trendingArticles = await getTrendingArticles(5);
  const relatedArticles = (await getArticlesByCategory(article.category.slug)).filter(
    (a) => a.id !== article.id
  );
  const inArticleAds = await getAdvertisements("in-article");
  const sidebarAds = await getAdvertisements("sidebar");

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd article={article} />
      {/* Article Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-sweet-red transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${article.category.slug}`}
              className="hover:text-sweet-red transition-colors"
              style={{ color: article.category.color }}
            >
              {article.category.name}
            </Link>
          </div>
        </div>
      </div>

      <article className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Category Badge */}
                <div className="px-6 pt-6">
                  <span
                    className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide text-white rounded"
                    style={{ backgroundColor: article.category.color || "#E60000" }}
                  >
                    {article.category.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight px-6 pt-4">
                  {article.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg text-gray-600 px-6 pt-3 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 px-6 pt-4 pb-4 text-sm text-gray-500 border-b border-gray-100">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    {article.author.avatar && (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <span className="font-semibold text-charcoal">
                        {article.author.name}
                      </span>
                      {article.author.role && (
                        <span className="block text-xs text-gray-400">
                          {article.author.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-gray-300">|</span>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>

                  {article.readTime && (
                    <>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} min read</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Share Bar */}
                <ShareBar title={article.title} slug={article.slug} />

                {/* Featured Image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>

                {/* Article Body */}
                <div className="px-6 py-8 font-serif text-lg leading-relaxed text-charcoal">
                  {article.content ? (
                    <RichTextRenderer content={article.content} />
                  ) : (
                    <p>{article.excerpt}</p>
                  )}

                  {/* In-Article Ad */}
                  <div className="my-6">
                    <AdBanner ad={inArticleAds[0] || null} position="in-article" />
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="px-6 pb-6 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="mt-8">
                <CommentsSection articleSlug={article.slug} />
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-charcoal mb-4">
                    More in {article.category.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedArticles.slice(0, 4).map((related) => (
                      <ArticleCard
                        key={related.id}
                        article={related}
                        variant="featured"
                        className="rounded-lg shadow-sm border border-gray-100 hover:shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Back Link */}
              <div className="mt-6">
                <Link
                  href={`/category/${article.category.slug}`}
                  className="inline-flex items-center gap-2 text-sweet-red hover:underline font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {article.category.name}
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TrendingSidebar articles={trendingArticles} ad={sidebarAds[0] || null} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
