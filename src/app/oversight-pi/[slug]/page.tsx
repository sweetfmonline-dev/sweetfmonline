import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/data";
import { OversightRichText } from "@/components/news/OversightRichText";
import { ShareBar } from "@/components/news/ShareBar";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { formatDate } from "@/lib/utils";
import {
  OVERSIGHT_CATEGORY_SLUGS,
  OVERSIGHT_SUBSECTION_BY_SLUG,
} from "@/lib/oversight";
import type { Metadata } from "next";
import "./feature-article.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Report Not Found — OverSight PI" };

  const canonicalUrl = `https://www.sweetfmonline.com/oversight-pi/${slug}`;
  const shortDesc =
    article.excerpt && article.excerpt.length > 155
      ? article.excerpt.slice(0, 155).trimEnd() + "…"
      : article.excerpt;

  return {
    title: `${article.title} — OverSight PI`,
    description: shortDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.title,
      description: shortDesc,
      url: canonicalUrl,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: shortDesc,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export const revalidate = 600;

// Split a headline on " — " or ": " so editors can produce a two-line headline
// with the accent part rendered in italic red (like "The Man in the Shadows").
function splitHeadline(title: string): { main: string; accent?: string } {
  const separators = [" — ", ": ", " – "];
  for (const sep of separators) {
    const idx = title.indexOf(sep);
    if (idx > 0) {
      return { main: title.slice(0, idx), accent: title.slice(idx + sep.length) };
    }
  }
  return { main: title };
}

// Issue label: "Vol. XII · Issue 04 · April 2026 · Optional Tag"
function buildIssueMeta(publishedAt: string, issueLabel?: string): string[] {
  const d = new Date(publishedAt);
  const year = d.getFullYear();
  const monthName = d.toLocaleString("en-US", { month: "long" });
  const month = String(d.getMonth() + 1).padStart(2, "0");
  // Volume: year minus 2014 (Sweet FM digital start; tweak if needed)
  const volume = Math.max(1, year - 2014);
  const toRoman = (n: number): string => {
    const map: [number, string][] = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];
    let out = "";
    let rem = n;
    for (const [v, s] of map) { while (rem >= v) { out += s; rem -= v; } }
    return out;
  };
  const parts = [
    `Vol. ${toRoman(volume)}`,
    `Issue ${month}`,
    `${monthName} ${year}`,
  ];
  if (issueLabel) parts.push(issueLabel);
  return parts;
}

export default async function OversightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // Only render this route for OverSight PI articles (parent + all subcategories)
  if (!article.category?.slug || !OVERSIGHT_CATEGORY_SLUGS.has(article.category.slug)) {
    notFound();
  }

  const subsection = OVERSIGHT_SUBSECTION_BY_SLUG[article.category.slug];
  const sectionLabel = subsection?.label || "OverSight PI";

  const { main: titleMain, accent: titleAccent } = splitHeadline(article.title);
  const issueMeta = buildIssueMeta(article.publishedAt, article.issueLabel);

  const kicker = article.kicker || subsection?.kicker || sectionLabel;
  const pullQuote = article.pullQuote;
  const pullQuoteAttr = article.pullQuoteAttribution;
  const sidebarStats = article.sidebarStats || [];
  const keyRoles = article.keyRoles || [];
  const fastFacts = article.fastFacts || [];
  const timeline = article.timeline || [];

  const hasSidebar =
    sidebarStats.length > 0 || keyRoles.length > 0 || fastFacts.length > 0;
  const hasTimeline = timeline.length > 0;

  return (
    <div className="feature-article">
      <ArticleJsonLd article={article} />

      {/* ── MASTHEAD ── */}
      <header className="fa-masthead">
        <div>
          <Link
            href={subsection ? `/oversight-pi/${subsection.slug}` : "/oversight-pi"}
            className="fa-masthead-logo"
          >
            OverSight<br />PI
          </Link>
          <div className="fa-masthead-tagline">
            Investigations · Editorials · Analysis
          </div>
        </div>
        <div className="fa-masthead-meta">
          {issueMeta.map((part, i) => (
            <span key={i}>
              {part}
              {i < issueMeta.length - 1 && <br />}
            </span>
          ))}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="fa-hero">
        <div className="fa-hero-noise" aria-hidden="true" />
        <div className="fa-hero-inner">
          <div className="fa-hero-text">
            <div className="fa-hero-kicker">{kicker}</div>
            <h1 className="fa-hero-headline">
              {titleMain}
              {titleAccent && (
                <>
                  <br />
                  <em>{titleAccent}</em>
                </>
              )}
            </h1>
            {article.excerpt && (
              <p className="fa-hero-deck">{article.excerpt}</p>
            )}
            <div className="fa-hero-byline">
              {article.author?.name && (
                <span>
                  <strong>By {article.author.name}</strong>
                  {sectionLabel}
                </span>
              )}
              <span>
                <strong>Published</strong>
                {formatDate(article.publishedAt)}
              </span>
              {article.readTime && (
                <span>
                  <strong>Read Time</strong>
                  {article.readTime} min
                </span>
              )}
            </div>
          </div>

          {article.featuredImage && (
            <div className="fa-hero-image-wrap">
              <div className="fa-hero-accent-bar" aria-hidden="true" />
              <div className="fa-hero-cover-frame">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  priority
                  className="fa-hero-cover"
                  sizes="(max-width: 900px) 320px, 380px"
                />
              </div>
              <p className="fa-hero-cover-caption">
                Cover · {sectionLabel} · {formatDate(article.publishedAt)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── PULL QUOTE BAR (optional) ── */}
      {pullQuote && (
        <div className="fa-pull-bar">
          <div className="fa-pull-bar-inner">
            <blockquote>{pullQuote}</blockquote>
            {pullQuoteAttr && (
              <div className="fa-pull-bar-source">{pullQuoteAttr}</div>
            )}
          </div>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="fa-body-wrap">
        <div className={`fa-body-inner${hasSidebar ? "" : " no-sidebar"}`}>
          <div className="fa-section-label" aria-hidden="true">
            {sectionLabel} · Feature
          </div>

          <article className="fa-article-body">
            {article.content ? (
              <OversightRichText content={article.content} />
            ) : (
              <p>{article.excerpt}</p>
            )}

            {/* Share */}
            <div className="fa-article-footer">
              <ShareBar title={article.title} slug={`oversight-pi/${article.slug}`} />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="fa-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="fa-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Byline */}
            {article.author && (
              <div className="fa-byline-card">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={56}
                    height={56}
                    className="fa-byline-avatar"
                  />
                )}
                <div>
                  <div className="fa-byline-name">{article.author.name}</div>
                  {article.author.role && (
                    <div className="fa-byline-role">{article.author.role}</div>
                  )}
                  {article.author.bio && (
                    <p className="fa-byline-bio">{article.author.bio}</p>
                  )}
                </div>
              </div>
            )}
          </article>

          {hasSidebar && (
            <aside className="fa-sidebar">
              {sidebarStats.map((stat, i) => (
                <div key={i} className="fa-sidebar-stat">
                  <span className="fa-stat-number">{stat.number}</span>
                  <span className="fa-stat-label">{stat.label}</span>
                </div>
              ))}

              {keyRoles.length > 0 && (
                <div className="fa-sidebar-box">
                  <h4>Key Roles</h4>
                  <ul>
                    {keyRoles.map((r, i) => (
                      <li key={i}>
                        <strong>{r.period}</strong>
                        {r.role}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fastFacts.length > 0 && (
                <div className="fa-sidebar-box">
                  <h4>Fast Facts</h4>
                  <ul>
                    {fastFacts.map((f, i) => (
                      <li key={i}>
                        <strong>{f.label}</strong>
                        {f.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>

      {/* ── TIMELINE (optional) ── */}
      {hasTimeline && (
        <>
          <div className="fa-divider-band">
            <div className="fa-divider-band-line" />
            <div className="fa-divider-band-text">Timeline</div>
            <div className="fa-divider-band-line" />
          </div>

          <section className="fa-timeline-section">
            <div className="fa-timeline-inner">
              <h3 className="fa-section-title">Key Moments</h3>
              <div className="fa-timeline">
                {timeline.map((item, i) => (
                  <div className="fa-timeline-item" key={i}>
                    <div className="fa-timeline-year">{item.year}</div>
                    <div className={`fa-timeline-dot${item.highlight ? " gold" : ""}`} />
                    <div className="fa-timeline-content">
                      <h5>{item.title}</h5>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER STRIP ── */}
      <footer className="fa-footer-strip">
        <Link href="/oversight-pi" className="fa-footer-logo">
          OverSight PI
        </Link>
        <div className="fa-footer-copy">
          © {new Date().getFullYear()} Sweet FM Online · {sectionLabel} · All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
