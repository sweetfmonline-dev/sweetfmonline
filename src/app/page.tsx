import { HeroSection, TrendingSidebar, ArticleCard } from "@/components/news";
import { getFeaturedArticles, getArticles, getTrendingArticles, getAdvertisements } from "@/lib/data";
import { AdBanner } from "@/components/ads";

export const revalidate = 30;

export default async function Home() {
  const featuredArticles = await getFeaturedArticles();
  const latestArticles = await getArticles(10);
  const trendingArticles = await getTrendingArticles(5);
  const bannerAds = await getAdvertisements("banner");
  const sidebarAds = await getAdvertisements("sidebar");

  const leadStory = featuredArticles[0];
  const topStories = featuredArticles.slice(1, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="sr-only">Sweet FM Online — Ghana&apos;s Premier News Portal</h1>
      {/* Hero Section */}
      {leadStory && (
        <HeroSection leadStory={leadStory} topStories={topStories} />
      )}

      {/* Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner ad={bannerAds[0] || null} position="banner" />
      </div>

      {/* Main Content Area */}
      <section className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* The Feed - Latest News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-charcoal">Latest News</h2>
                <a
                  href="/category/news"
                  className="text-sm font-medium text-sweet-red hover:underline"
                >
                  View All →
                </a>
              </div>

              <div className="space-y-4">
                {latestArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="horizontal"
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md"
                  />
                ))}
              </div>

              {/* Load More Button */}
              <div className="mt-6 text-center">
                <button className="px-6 py-3 bg-charcoal hover:bg-charcoal-light text-white font-semibold rounded-lg transition-colors">
                  Load More Stories
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TrendingSidebar articles={trendingArticles} ad={sidebarAds[0] || null} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
