"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  variant?: "lead" | "featured" | "compact" | "horizontal";
  className?: string;
  priority?: boolean;
}

export function ArticleCard({
  article,
  variant = "featured",
  className,
  priority = false,
}: ArticleCardProps) {
  const isLead = variant === "lead";
  const isCompact = variant === "compact";
  const isHorizontal = variant === "horizontal";

  return (
    <article
      className={cn(
        "group relative bg-white overflow-hidden transition-smooth",
        isHorizontal ? "flex gap-4" : "flex flex-col",
        className
      )}
    >
      {/* Image Container */}
      <Link
        href={`/article/${article.slug}`}
        className={cn(
          "relative overflow-hidden block flex-shrink-0",
          isLead && "aspect-[16/9]",
          variant === "featured" && "aspect-[16/10]",
          isCompact && "aspect-[16/9]",
          isHorizontal && "w-32 h-24 sm:w-40 sm:h-28"
        )}
      >
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          priority={priority}
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          sizes={
            isLead
              ? "(max-width: 768px) 100vw, 66vw"
              : isHorizontal
              ? "160px"
              : "(max-width: 768px) 100vw, 33vw"
          }
        />
        {/* Category Badge */}
        {!isCompact && !isHorizontal && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: article.category.color || "#E60000" }}
            >
              {article.category.name}
            </span>
          </div>
        )}
        {/* Breaking Badge */}
        {article.isBreaking && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-sweet-red text-white animate-pulse">
              Breaking
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col",
          !isHorizontal && "p-4",
          isLead && "p-4 lg:p-6",
          isHorizontal && "py-1 flex-1 min-w-0"
        )}
      >
        {/* Category for horizontal */}
        {isHorizontal && (
          <span
            className="text-xs font-bold uppercase tracking-wide mb-1"
            style={{ color: article.category.color || "#E60000" }}
          >
            {article.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/article/${article.slug}`}>
          <h3
            className={cn(
              "font-bold text-charcoal group-hover:text-sweet-red transition-colors leading-tight",
              isLead && "text-2xl sm:text-3xl lg:text-4xl",
              variant === "featured" && "text-lg sm:text-xl",
              isCompact && "text-base",
              isHorizontal && "text-sm sm:text-base line-clamp-2"
            )}
          >
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {!isCompact && !isHorizontal && (
          <p
            className={cn(
              "text-gray-600 mt-2 line-clamp-2",
              isLead && "text-base lg:text-lg line-clamp-3",
              variant === "featured" && "text-sm"
            )}
          >
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div
          className={cn(
            "flex items-center gap-3 text-gray-500 mt-auto",
            isLead && "mt-4",
            variant === "featured" && "mt-3",
            isCompact && "mt-2",
            isHorizontal && "mt-1"
          )}
        >
          {!isHorizontal && (
            <span className="text-xs font-medium">{article.author.name}</span>
          )}
          <div className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
          {article.readTime && !isHorizontal && (
            <span className="text-xs">{article.readTime} min read</span>
          )}
        </div>
      </div>
    </article>
  );
}
