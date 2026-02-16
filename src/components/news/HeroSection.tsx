import { cn } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface HeroSectionProps {
  leadStory: Article;
  topStories: Article[];
  className?: string;
}

export function HeroSection({ leadStory, topStories, className }: HeroSectionProps) {
  return (
    <section className={cn("py-6 lg:py-8", className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Lead Story - Takes 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <ArticleCard
              article={leadStory}
              variant="lead"
              priority
              className="h-full rounded-lg shadow-sm border border-gray-100 hover:shadow-md"
            />
          </div>

          {/* Top Stories Stack - Takes 1/3 width on desktop */}
          <div className="flex flex-col gap-4">
            {topStories.slice(0, 3).map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
                priority={index === 0}
                className="rounded-lg shadow-sm border border-gray-100 hover:shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
