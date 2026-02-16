import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/news";
import { TrendingSidebar } from "@/components/news";
import { getArticlesByCategory, getCategories, getTrendingArticles } from "@/lib/contentful";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
}

function formatSubCategory(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const primarySlug = slug[0];
  const subSlug = slug[1];
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === primarySlug);

  const title = subSlug
    ? `${formatSubCategory(subSlug)} — ${category?.name || primarySlug} | Sweet FM Online`
    : `${category?.name || primarySlug} News | Sweet FM Online`;

  return {
    title,
    description: `Latest ${category?.name || primarySlug} news from Sweet FM Online — Ghana's premier news portal.`,
  };
}

// Revalidate category pages every 60 seconds (ISR)
export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const primarySlug = slug[0];
  const subSlug = slug[1];
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === primarySlug);

  if (!category) notFound();

  const articles = await getArticlesByCategory(primarySlug);
  const trendingArticles = await getTrendingArticles(5);
  const displayName = subSlug ? formatSubCategory(subSlug) : category.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="flex items-center gap-3">
            <div
              className="w-1.5 h-8 rounded-full"
              style={{ backgroundColor: category.color || "#E60000" }}
            />
            <div>
              {subSlug && (
                <p className="text-sm text-gray-500 mb-1">
                  <a href={`/category/${primarySlug}`} className="hover:text-sweet-red transition-colors">
                    {category.name}
                  </a>
                  <span className="mx-1">/</span>
                </p>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">
                {displayName}
              </h1>
              {category.description && !subSlug && (
                <p className="text-gray-500 mt-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-2">
              {articles.length > 0 ? (
                <>
                  {/* Lead Article */}
                  <ArticleCard
                    article={articles[0]}
                    variant="lead"
                    priority
                    className="rounded-lg shadow-sm border border-gray-100 hover:shadow-md mb-6"
                  />

                  {/* Remaining Articles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {articles.slice(1).map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="featured"
                        className="rounded-lg shadow-sm border border-gray-100 hover:shadow-md"
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-charcoal hover:bg-charcoal-light text-white font-semibold rounded-lg transition-colors">
                      Load More Stories
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No articles found in this category yet.
                  </p>
                  <p className="text-gray-400 mt-2 text-sm">
                    Check back soon for the latest updates.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TrendingSidebar articles={trendingArticles} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
