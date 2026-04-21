import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getArticlesByCategory } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolshevik Report — Unfiltered. Unafraid. Uncompromising.",
  description:
    "In-depth editorial reporting from Sweet FM Online. Punchy, incisive long-form journalism on power, influence, and the stories behind the headlines.",
  alternates: {
    canonical: "https://www.sweetfmonline.com/bolshevik-report",
  },
  openGraph: {
    title: "Bolshevik Report — Sweet FM Online",
    description:
      "Unfiltered. Unafraid. Uncompromising. In-depth editorial reporting.",
    url: "https://www.sweetfmonline.com/bolshevik-report",
    type: "website",
  },
};

// Revalidate every 5 minutes (ISR)
export const revalidate = 300;

export default async function BolshevikReportLanding() {
  const articles = await getArticlesByCategory("bolshevik-report");
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Masthead */}
      <header className="bg-[#b00000] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14 text-center">
          <div className="inline-block border-y-2 border-white/30 px-8 py-4">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold tracking-tight leading-none">
              Bolshevik <span className="italic">Report</span>
            </h1>
          </div>
          <p className="mt-6 text-xs lg:text-sm tracking-[0.35em] uppercase font-semibold text-white/90">
            Unfiltered · Unafraid · Uncompromising
          </p>
        </div>
      </header>

      {/* Issue line */}
      <div className="bg-[#1a1a1a] text-white/80 text-xs uppercase tracking-widest">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <span>In-Depth Editorial · Sweet FM Online</span>
          <span className="text-white/60">
            {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="font-serif text-2xl text-[#1a1a1a]/70">
            The first edition is being prepared.
          </p>
          <p className="mt-3 text-[#1a1a1a]/50">
            Stay with us. Long-form editorials drop soon.
          </p>
        </div>
      ) : (
        <>
          {/* Featured cover story */}
          {featured && (
            <section className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
              <Link
                href={`/bolshevik-report/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                {/* Cover Image */}
                <div className="relative aspect-[3/4] bg-[#ebe6dc] overflow-hidden shadow-2xl">
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
                  {/* Bolshevik Report badge overlay */}
                  <div className="absolute top-6 left-6 bg-[#b00000] text-white px-4 py-2 shadow-lg">
                    <div className="font-serif text-sm lg:text-base font-bold leading-tight">
                      Bolshevik
                    </div>
                    <div className="font-serif text-sm lg:text-base font-bold leading-tight italic">
                      Report
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[#b00000] font-bold mb-4">
                    Cover Story · In-Depth Profile
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-[1.05] tracking-tight">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-5 text-lg lg:text-xl text-[#1a1a1a]/75 leading-relaxed font-serif italic">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-3 text-sm text-[#1a1a1a]/60 uppercase tracking-wider">
                    {featured.author?.name && (
                      <>
                        <span>By {featured.author.name}</span>
                        <span>·</span>
                      </>
                    )}
                    <span>{formatDate(featured.publishedAt)}</span>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-[#b00000] font-bold uppercase tracking-wider text-sm border-b-2 border-[#b00000] pb-1 group-hover:gap-4 transition-all">
                    Read the Report <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Divider */}
          {rest.length > 0 && (
            <div className="max-w-6xl mx-auto px-4">
              <div className="border-t-2 border-[#1a1a1a]/15"></div>
              <div className="flex items-center justify-center -mt-4">
                <span className="bg-[#f5f1ea] px-6 text-xs uppercase tracking-[0.3em] text-[#1a1a1a]/60 font-bold">
                  More Reports
                </span>
              </div>
            </div>
          )}

          {/* Other reports */}
          {rest.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/bolshevik-report/${article.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] bg-[#ebe6dc] overflow-hidden mb-4">
                      {article.featuredImage && (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-[#b00000] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                        Bolshevik Report
                      </div>
                    </div>
                    <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#1a1a1a] leading-tight group-hover:text-[#b00000] transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-[#1a1a1a]/70 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#1a1a1a]/50 uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Footer tagline */}
      <div className="bg-[#1a1a1a] text-white/70 text-center py-10 mt-10">
        <p className="font-serif italic text-lg">
          &ldquo;Small. Persistent. Capable of drawing blood.&rdquo;
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
          Bolshevik Report · Sweet FM Online
        </p>
      </div>
    </div>
  );
}
