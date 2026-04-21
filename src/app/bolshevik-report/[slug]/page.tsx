import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  getArticleBySlug,
  getArticlesByCategory,
} from "@/lib/data";
import { BolshevikRichText } from "@/components/news/BolshevikRichText";
import { ShareBar } from "@/components/news/ShareBar";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Report Not Found — Bolshevik Report" };

  const canonicalUrl = `https://www.sweetfmonline.com/bolshevik-report/${slug}`;
  const shortDesc = article.excerpt?.length > 155
    ? article.excerpt.slice(0, 155).trimEnd() + "…"
    : article.excerpt;

  return {
    title: `${article.title} — Bolshevik Report`,
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

// Revalidate every 10 minutes (ISR)
export const revalidate = 600;

export default async function BolshevikArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // Only render this route for Bolshevik Report articles
  if (article.category?.slug !== "bolshevik-report") {
    notFound();
  }

  const related = (await getArticlesByCategory("bolshevik-report")).filter(
    (a) => a.id !== article.id
  );

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      <ArticleJsonLd article={article} />

      {/* Masthead */}
      <header className="bg-[#b00000] text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/bolshevik-report" className="flex items-center gap-3">
            <div className="border border-white/40 px-3 py-1.5">
              <div className="font-serif text-lg font-bold leading-none">
                Bolshevik
              </div>
              <div className="font-serif text-lg font-bold leading-none italic">
                Report
              </div>
            </div>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] text-white/80">
              Unfiltered · Unafraid · Uncompromising
            </span>
          </Link>
          <Link
            href="/bolshevik-report"
            className="text-xs uppercase tracking-wider hover:text-white/70 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Reports
          </Link>
        </div>
      </header>

      {/* Cover Section */}
      <section className="bg-[#f5f1ea]">
        <div className="max-w-5xl mx-auto px-4 pt-10 lg:pt-16 pb-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-[#b00000] font-bold mb-6">
            {article.tags?.[0] || "In-Depth Report"} · {formatDate(article.publishedAt)}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a1a1a] leading-[1.02] tracking-tight max-w-4xl mx-auto">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-6 text-xl lg:text-2xl text-[#1a1a1a]/70 font-serif italic leading-relaxed max-w-3xl mx-auto">
              {article.excerpt}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/60">
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
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative aspect-[3/2] lg:aspect-[16/9] bg-[#ebe6dc] shadow-2xl">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}
      </section>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
        {/* Drop cap on first paragraph via CSS */}
        <div className="bolshevik-body">
          {article.content ? (
            <BolshevikRichText content={article.content} />
          ) : (
            <p className="text-lg leading-relaxed">{article.excerpt}</p>
          )}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t-2 border-[#1a1a1a]/15">
          <ShareBar title={article.title} slug={`bolshevik-report/${article.slug}`} />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#1a1a1a]/5 text-[#1a1a1a]/70 text-xs uppercase tracking-wider font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Byline */}
        {article.author && (
          <div className="mt-10 pt-8 border-t border-[#1a1a1a]/10 flex items-start gap-4">
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
              <div className="font-serif text-lg font-bold text-[#1a1a1a]">
                {article.author.name}
              </div>
              {article.author.role && (
                <div className="text-xs uppercase tracking-wider text-[#1a1a1a]/50 mt-0.5">
                  {article.author.role}
                </div>
              )}
              {article.author.bio && (
                <p className="mt-2 text-sm text-[#1a1a1a]/70 leading-relaxed">
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </article>

      {/* More Reports */}
      {related.length > 0 && (
        <section className="bg-[#1a1a1a] text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="text-xs uppercase tracking-[0.3em] text-[#b00000] font-bold mb-2">
                Continue Reading
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">
                More from Bolshevik Report
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.slice(0, 3).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/bolshevik-report/${rel.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] bg-[#2a2a2a] overflow-hidden mb-4">
                    {rel.featuredImage && (
                      <Image
                        src={rel.featuredImage}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <h3 className="font-serif text-xl lg:text-2xl font-bold leading-tight group-hover:text-[#b00000] transition-colors">
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

      {/* Footer tagline */}
      <div className="bg-[#b00000] text-white text-center py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-white/90 font-bold">
          Bolshevik Report · Sweet FM Online
        </p>
      </div>
    </div>
  );
}
