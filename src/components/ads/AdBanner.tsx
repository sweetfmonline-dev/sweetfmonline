"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Advertisement, AdPosition } from "@/types";

interface AdBannerProps {
  ad?: Advertisement | null;
  position: AdPosition;
  className?: string;
  fallbackSize?: string;
}

const sizeMap: Record<AdPosition, { width: number; height: number; label: string }> = {
  sidebar: { width: 300, height: 250, label: "300 × 250" },
  banner: { width: 728, height: 90, label: "728 × 90" },
  "in-article": { width: 468, height: 60, label: "468 × 60" },
  header: { width: 970, height: 90, label: "970 × 90" },
  footer: { width: 728, height: 90, label: "728 × 90" },
};

export function AdBanner({ ad, position, className }: AdBannerProps) {
  const size = sizeMap[position];

  // No ad available — show subtle CTA
  if (!ad) {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
          Advertisement
        </span>
        <a
          href="/advertise"
          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center w-full hover:border-gray-300 transition-colors group"
          style={{ aspectRatio: `${size.width}/${size.height}`, maxWidth: size.width }}
        >
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-gray-700 group-hover:text-sweet-red transition-colors">
              Your Ad Here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Reach thousands of readers daily
            </p>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
        Advertisement
      </span>
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block hover:opacity-90 transition-opacity"
      >
        <Image
          src={ad.image}
          alt={ad.name}
          width={size.width}
          height={size.height}
          className="rounded-lg object-cover"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </a>
    </div>
  );
}
