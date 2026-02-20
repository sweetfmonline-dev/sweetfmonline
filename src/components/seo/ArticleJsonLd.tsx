import type { Article } from "@/types";

interface ArticleJsonLdProps {
  article: Article;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Sweet FM Online",
      logo: {
        "@type": "ImageObject",
        url: "https://www.sweetfmonline.com/sweet-fm-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.sweetfmonline.com/article/${article.slug}`,
    },
    articleSection: article.category.name,
    keywords: article.tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
