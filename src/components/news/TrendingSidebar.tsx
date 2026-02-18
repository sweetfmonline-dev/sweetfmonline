"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { AdBanner } from "@/components/ads";
import type { Article, Advertisement } from "@/types";

interface TrendingSidebarProps {
  articles: Article[];
  ad?: Advertisement | null;
  className?: string;
}

export function TrendingSidebar({ articles, ad, className }: TrendingSidebarProps) {
  return (
    <aside className={cn("bg-white rounded-lg border border-gray-100 p-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <TrendingUp className="w-5 h-5 text-sweet-red" />
        <h2 className="text-lg font-bold text-charcoal">Trending Now</h2>
      </div>

      {/* Trending List */}
      <ol className="space-y-4">
        {articles.slice(0, 5).map((article, index) => (
          <li key={article.id} className="group">
            <Link
              href={`/article/${article.slug}`}
              className="flex gap-3 items-start"
            >
              {/* Rank Number */}
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-sweet-red text-charcoal group-hover:text-white font-bold text-sm rounded transition-colors">
                {index + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-charcoal group-hover:text-sweet-red transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span
                    className="font-medium"
                    style={{ color: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {/* Sidebar Ad */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <AdBanner ad={ad || null} position="sidebar" />
      </div>
    </aside>
  );
}
