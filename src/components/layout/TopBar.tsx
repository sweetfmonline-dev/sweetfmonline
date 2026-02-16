"use client";

import { Cloud, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const today = new Date();

  return (
    <div
      className={cn(
        "bg-charcoal text-white text-sm py-2 px-4",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Date */}
        <div className="hidden sm:flex items-center gap-2 text-gray-300">
          <span>{formatDate(today)}</span>
        </div>

        {/* Weather Widget (Mockup) */}
        <div className="flex items-center gap-2 text-gray-300">
          <Cloud className="w-4 h-4" />
          <span className="hidden xs:inline">Accra:</span>
          <span className="font-medium text-white">28°C</span>
          <span className="hidden sm:inline text-gray-400">Partly Cloudy</span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=100088742005548"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/sweetfmonline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/sweetfm106.5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/@sweetfmonline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
