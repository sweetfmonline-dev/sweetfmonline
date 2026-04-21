import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { getArticlesByCategoryTree } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OverSight PI — Investigations, Editorials & Analysis",
  description:
    "In-depth investigative reporting, editorials, and analysis from Sweet FM Online. Unfiltered journalism on power, policy, and the stories behind the headlines.",
  alternates: {
    canonical: "https://www.sweetfmonline.com/oversight-pi",
  },
  openGraph: {
    title: "OverSight PI — Sweet FM Online",
    description:
      "Investigative reporting, editorials, and analysis from Sweet FM Online.",
    url: "https://www.sweetfmonline.com/oversight-pi",
    type: "website",
  },
};

// Revalidate every 5 minutes (ISR)
export const revalidate = 300;

export default async function OversightPiLanding() {
  const articles = await getArticlesByCategoryTree("oversight-pi");
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Masthead */}
      <header className="bg-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-sweet-red"></div>
                <span className="text-xs uppercase tracking-[0.35em] text-sweet-red font-bold">
                  Sweet FM Online
                </span>
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl font-bold tracking-tight leading-none">
                OverSight <span className="text-sweet-red">PI</span>
              </h1>
              <p className="mt-4 text-sm lg:text-base text-white/70 max-w-2xl leading-relaxed">
                Investigations · Editorials · Analysis. Unfiltered reporting on
                power, policy, and the stories behind the headlines.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Search className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">
                {new Date().toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Section navigation */}
      <div className="border-b-2 border-charcoal bg-white sticky top-20 lg:top-24 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <Link
              href="/oversight-pi"
              className="py-4 text-xs uppercase tracking-[0.2em] font-bold text-charcoal border-b-2 border-sweet-red -mb-0.5 whitespace-nowrap"
            >
              All Reports
            </Link>
            <Link
              href="/oversight-pi/bolshevik-perspective"
              className="py-4 text-xs uppercase tracking-[0.2em] font-semibold text-charcoal/60 hover:text-sweet-red whitespace-nowrap transition-colors"
            >
              Bolshevik Perspective
            </Link>
          </div>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="font-serif text-2xl text-charcoal/70">
            No reports yet — the first edition is coming soon.
          </p>
          <p className="mt-3 text-charcoal/50">
            Long-form investigations and editorials drop here.
          </p>
        </div>
      ) : (
        <>
          {/* Featured cover story */}
          {featured && (
            <section className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
              <Link
                href={`/oversight-pi/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                {/* Cover Image */}
                <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[3/2] bg-gray-100 overflow-hidden shadow-xl">
                  {featured.featuredImage && (
                    <Image
                      src={featured.featuredImage}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  )}
                  {featured.category?.slug === "bolshevik-perspective" && (
                    <div className="absolute top-4 left-4 bg-sweet-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Bolshevik Perspective
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="lg:col-span-5 lg:pt-4">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px w-8 bg-sweet-red"></div>
                    <span className="text-xs uppercase tracking-[0.25em] text-sweet-red font-bold">
                      {featured.category?.slug === "bolshevik-perspective"
                        ? "Bolshevik Perspective"
                        : "Cover Story"}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.05] tracking-tight">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-5 text-lg lg:text-xl text-charcoal/70 leading-relaxed font-serif italic">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-3 text-xs text-charcoal/60 uppercase tracking-wider">
                    {featured.author?.name && (
                      <>
                        <span className="font-semibold">
                          By {featured.author.name}
                        </span>
                        <span>·</span>
                      </>
                    )}
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-sweet-red font-bold uppercase tracking-wider text-sm border-b-2 border-sweet-red pb-1 group-hover:gap-4 transition-all">
                    Read the Report <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* More reports */}
          {rest.length > 0 && (
            <>
              <div className="max-w-6xl mx-auto px-4">
                <div className="border-t-2 border-charcoal/15"></div>
                <div className="flex items-center justify-center -mt-4">
                  <span className="bg-white px-6 text-xs uppercase tracking-[0.3em] text-charcoal/60 font-bold">
                    More Reports
                  </span>
                </div>
              </div>

              <section className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                  {rest.map((article) => (
                    <Link
                      key={article.id}
                      href={`/oversight-pi/${article.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                        {article.featuredImage && (
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        )}
                        {article.category?.slug === "bolshevik-perspective" && (
                          <div className="absolute top-3 left-3 bg-sweet-red text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                            Bolshevik
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif text-xl lg:text-2xl font-bold text-charcoal leading-tight group-hover:text-sweet-red transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-charcoal/70 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-xs text-charcoal/50 uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
