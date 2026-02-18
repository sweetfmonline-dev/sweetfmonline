import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from "lucide-react";
import { getArticleBySlug, getTrendingArticles, getArticlesByCategory } from "@/lib/data";
import { TrendingSidebar, ArticleCard } from "@/components/news";
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

  return {
    title: `${article.title} | Sweet FM Online`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
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
                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Share:</span>
                  <button className="p-2 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity" aria-label="Share on Facebook">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity" aria-label="Share on Twitter">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity" aria-label="Share on WhatsApp">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-400 text-white hover:opacity-80 transition-opacity" aria-label="Copy link">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Featured Image */}
                <div className="relative aspect-[16/9]">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>

                {/* Article Body */}
                <div className="px-6 py-8 font-serif text-lg leading-relaxed text-charcoal space-y-6">
                  <p>
                    {article.excerpt} This is placeholder body content that will be replaced
                    with real article content from Contentful CMS once integrated.
                  </p>
                  <p>
                    Ghana continues to make significant strides in various sectors, with
                    developments that impact millions of citizens across all 16 regions.
                    Stakeholders have expressed optimism about the direction of the country,
                    while analysts urge caution and continued reform efforts.
                  </p>
                  <p>
                    The government has reiterated its commitment to transparency and
                    accountability, promising regular updates to the public on the progress
                    of key initiatives. Civil society organizations have welcomed the move,
                    calling it a step in the right direction for democratic governance.
                  </p>
                  <p>
                    Industry experts note that these developments could have far-reaching
                    implications for the West African sub-region, with neighbouring countries
                    closely monitoring Ghana&apos;s approach as a potential model for their own
                    reform agendas.
                  </p>
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
              <TrendingSidebar articles={trendingArticles} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
