"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import type { Article } from "@/types";

interface BreakingNewsCarouselProps {
  articles: Article[];
}

export function BreakingNewsCarousel({ articles }: BreakingNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length]);

  if (!articles || articles.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setIsAutoPlaying(false);
  };

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative bg-charcoal text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative aspect-[21/9] lg:aspect-[21/7]">
          {/* Background Image */}
          <Image
            src={currentArticle.featuredImage}
            alt={currentArticle.title}
            fill
            priority
            className="object-cover object-top opacity-40"
            sizes="100vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-4 lg:px-8">
              <div className="max-w-3xl">
                {/* Breaking Badge */}
                <div className="inline-flex items-center gap-2 bg-sweet-red px-3 py-1.5 rounded mb-4">
                  <AlertCircle className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wide">Breaking News</span>
                </div>

                {/* Category */}
                <div className="mb-2">
                  <span
                    className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide text-white rounded"
                    style={{ backgroundColor: currentArticle.category.color || "#E60000" }}
                  >
                    {currentArticle.category.name}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/article/${currentArticle.slug}`}>
                  <h2 className="text-2xl lg:text-4xl font-bold mb-3 hover:text-sweet-red transition-colors line-clamp-2">
                    {currentArticle.title}
                  </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-300 text-sm lg:text-base mb-4 line-clamp-2">
                  {currentArticle.excerpt}
                </p>

                {/* Read More */}
                <Link
                  href={`/article/${currentArticle.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sweet-red hover:text-white transition-colors"
                >
                  Read Full Story
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {articles.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-sweet-red rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-sweet-red rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Next story"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {articles.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-sweet-red w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
