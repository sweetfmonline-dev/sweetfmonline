"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreakingNews } from "@/types";

interface BreakingNewsTickerProps {
  news: BreakingNews[];
  className?: string;
}

export function BreakingNewsTicker({ news, className }: BreakingNewsTickerProps) {
  const [paused, setPaused] = useState(false);

  if (!news || news.length === 0) return null;

  // Duplicate the news items to create seamless loop
  const duplicatedNews = [...news, ...news];

  return (
    <div
      className={cn(
        "bg-sweet-red text-white overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Breaking Label */}
        <div className="flex-shrink-0 bg-charcoal px-4 py-2 flex items-center gap-2 z-10">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wide">Breaking</span>
        </div>

        {/* Ticker Content */}
        <div
          className="overflow-hidden flex-1 py-2 cursor-pointer"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: "ticker 30s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {duplicatedNews.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.url || "#"}
                className="inline-flex items-center mx-8 hover:underline"
              >
                <span className="text-sm font-medium">{item.headline}</span>
                <span className="mx-4 text-white/50">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
