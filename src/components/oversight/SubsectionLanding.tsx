import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { OversightSubsectionConfig } from "@/lib/oversight";
import type { Article } from "@/types";
import { OversightSubNav } from "./OversightSubNav";

interface SubsectionLandingProps {
  config: OversightSubsectionConfig;
  articles: Article[];
  emptyMessage?: string;
}

export function SubsectionLanding({
  config,
  articles,
  emptyMessage = "The first edition is being prepared.",
}: SubsectionLandingProps) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Masthead */}
      <header className="relative bg-charcoal text-white overflow-hidden min-h-[280px] lg:min-h-[340px] flex items-center">
        <Image
          src={config.heroImage}
          alt={config.heroAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal/80 to-transparent" />

        <div className="relative w-full max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <Link
            href="/oversight-pi"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70 hover:text-sweet-red transition-colors mb-4"
          >
            ← OverSight PI
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-sweet-red"></div>
            <span className="text-xs uppercase tracking-[0.35em] text-sweet-red font-bold">
              {config.kicker}
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold tracking-tight leading-none drop-shadow-lg">
            {config.title}{" "}
            {config.titleAccent && (
              <span className="italic text-sweet-red">{config.titleAccent}</span>
            )}
          </h1>
          <p className="mt-5 text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed font-serif italic">
            {config.description}
          </p>
        </div>
      </header>

      {/* Sub-nav */}
      <OversightSubNav active={config.slug} />

      {articles.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="font-serif text-2xl text-charcoal/70">{emptyMessage}</p>
          <p className="mt-3 text-charcoal/50">
            Stay with us. New pieces drop soon.
          </p>
        </div>
      ) : (
        <>
          {featured && (
            <section className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
              <Link
                href={`/oversight-pi/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden shadow-2xl">
                  {featured.featuredImage && (
                    <Image
                      src={featured.featuredImage}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-sweet-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {config.shortBadge}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px w-8 bg-sweet-red"></div>
                    <span className="text-xs uppercase tracking-[0.25em] text-sweet-red font-bold">
                      Latest Edition
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
                        <span className="font-semibold">By {featured.author.name}</span>
                        <span>·</span>
                      </>
                    )}
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-sweet-red font-bold uppercase tracking-wider text-sm border-b-2 border-sweet-red pb-1 group-hover:gap-4 transition-all">
                    {config.readActionLabel} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          {rest.length > 0 && (
            <>
              <div className="max-w-6xl mx-auto px-4">
                <div className="border-t-2 border-charcoal/15"></div>
                <div className="flex items-center justify-center -mt-4">
                  <span className="bg-white px-6 text-xs uppercase tracking-[0.3em] text-charcoal/60 font-bold">
                    More Editions
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
                        <div className="absolute top-3 left-3 bg-sweet-red text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                          {config.shortBadge}
                        </div>
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
