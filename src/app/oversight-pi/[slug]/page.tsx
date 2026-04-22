import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  getArticleBySlug,
  getArticlesByCategoryTree,
} from "@/lib/data";
import { OversightRichText } from "@/components/news/OversightRichText";
import { ShareBar } from "@/components/news/ShareBar";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { formatDate } from "@/lib/utils";
import {
  OVERSIGHT_CATEGORY_SLUGS,
  OVERSIGHT_SUBSECTION_BY_SLUG,
} from "@/lib/oversight";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Report Not Found — OverSight PI" };

  const canonicalUrl = `https://www.sweetfmonline.com/oversight-pi/${slug}`;
  const shortDesc = article.excerpt?.length > 155
    ? article.excerpt.slice(0, 155).trimEnd() + "…"
    : article.excerpt;

  return {
    title: `${article.title} — OverSight PI`,
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

export const revalidate = 600;

export default async function OversightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // Only render this route for OverSight PI articles (parent + all subcategories)
  if (!article.category?.slug || !OVERSIGHT_CATEGORY_SLUGS.has(article.category.slug)) {
    notFound();
  }

  const subsection = OVERSIGHT_SUBSECTION_BY_SLUG[article.category.slug];

  const related = (await getArticlesByCategoryTree("oversight-pi")).filter(
    (a) => a.id !== article.id
  );

  return (
    <div className="min-h-screen bg-white">
      <ArticleJsonLd article={article} />

      {/* Masthead */}
      <header className="bg-charcoal text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/oversight-pi" className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-sweet-red"></div>
              <span className="font-serif text-2xl font-bold leading-none tracking-tight">
                OverSight <span className="text-sweet-red">PI</span>
              </span>
            </div>
          </Link>
          <Link
            href={subsection ? `/oversight-pi/${subsection.slug}` : "/oversight-pi"}
            className="text-xs uppercase tracking-wider hover:text-sweet-red transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {subsection ? subsection.label : "All Reports"}
          </Link>
        </div>
      </header>

      {/* Cover Section */}
      <section className="bg-white border-b border-charcoal/10">
        <div className="max-w-5xl mx-auto px-4 pt-10 lg:pt-16 pb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-sweet-red"></div>
            <span className="text-xs uppercase tracking-[0.3em] text-sweet-red font-bold">
              {subsection ? subsection.label : "OverSight PI"} ·{" "}
              {formatDate(article.publishedAt)}
            </span>
            <div className="h-px w-8 bg-sweet-red"></div>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-[1.02] tracking-tight max-w-4xl mx-auto">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-6 text-xl lg:text-2xl text-charcoal/70 font-serif italic leading-relaxed max-w-3xl mx-auto">
              {article.excerpt}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-charcoal/60">
            {article.author?.name && (
              <>
                <span className="font-bold">By {article.author.name}</span>
                <span>·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
            {article.readTime && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} min read
                </span>
              </>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="max-w-5xl mx-auto px-4 pb-10">
            <div className="relative aspect-[3/2] lg:aspect-[16/9] bg-gray-100 shadow-2xl">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              {subsection && (
                <div className="absolute top-4 left-4 bg-sweet-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {subsection.label}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <div className="oversight-body">
          {article.content ? (
            <OversightRichText content={article.content} />
          ) : (
            <p className="text-lg leading-relaxed">{article.excerpt}</p>
          )}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t-2 border-charcoal/15">
          <ShareBar title={article.title} slug={`oversight-pi/${article.slug}`} />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-charcoal/5 text-charcoal/70 text-xs uppercase tracking-wider font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Byline */}
        {article.author && (
          <div className="mt-10 pt-8 border-t border-charcoal/10 flex items-start gap-4">
            {article.author.avatar && (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={56}
                height={56}
                className="rounded-full"
              />
            )}
            <div>
              <div className="font-serif text-lg font-bold text-charcoal">
                {article.author.name}
              </div>
              {article.author.role && (
                <div className="text-xs uppercase tracking-wider text-charcoal/50 mt-0.5">
                  {article.author.role}
                </div>
              )}
              {article.author.bio && (
                <p className="mt-2 text-sm text-charcoal/70 leading-relaxed">
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </article>

      {/* More Reports */}
      {related.length > 0 && (
        <section className="bg-charcoal text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-8 bg-sweet-red"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-sweet-red font-bold">
                  Continue Reading
                </span>
                <div className="h-px w-8 bg-sweet-red"></div>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">
                More from OverSight PI
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.slice(0, 3).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/oversight-pi/${rel.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] bg-white/5 overflow-hidden mb-4">
                    {rel.featuredImage && (
                      <Image
                        src={rel.featuredImage}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    {rel.category?.slug &&
                      OVERSIGHT_SUBSECTION_BY_SLUG[rel.category.slug] && (
                        <div className="absolute top-3 left-3 bg-sweet-red text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                          {OVERSIGHT_SUBSECTION_BY_SLUG[rel.category.slug].shortBadge}
                        </div>
                      )}
                  </div>
                  <h3 className="font-serif text-xl lg:text-2xl font-bold leading-tight group-hover:text-sweet-red transition-colors">
                    {rel.title}
                  </h3>
                  {rel.excerpt && (
                    <p className="mt-2 text-sm text-white/60 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
