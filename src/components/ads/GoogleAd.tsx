"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GoogleAdProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export function GoogleAd({
  slot,
  format = "auto",
  responsive = true,
  className,
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return;
    if (pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 rounded-lg p-4", className)}>
        <div className="text-center text-gray-400">
          <p className="text-xs uppercase tracking-wide font-medium">Google Ad</p>
          <p className="text-sm mt-1">AdSense not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("ad-container", className)}>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider block text-center mb-1">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
