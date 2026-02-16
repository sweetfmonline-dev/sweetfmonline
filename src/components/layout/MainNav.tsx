"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "News", href: "/category/news" },
  { label: "Politics", href: "/category/politics" },
  { label: "Business", href: "/category/business" },
  { label: "Sports", href: "/category/sports" },
  { label: "Entertainment", href: "/category/entertainment" },
  { label: "World", href: "/category/world" },
  { label: "Opinion", href: "/category/opinion" },
  { label: "Technology", href: "/category/technology" },
  { label: "Health", href: "/category/health" },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        "bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/sweet-fm-logo.svg"
              alt="Sweet FM 106.5"
              width={240}
              height={90}
              className="h-20 lg:h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-semibold text-charcoal hover:text-sweet-red transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Listen Live Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/live"
              className="hidden sm:flex items-center gap-2 bg-sweet-red hover:bg-sweet-red-dark text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Listen Live
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-charcoal hover:text-sweet-red transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2.5 text-base font-semibold text-charcoal hover:text-sweet-red hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Listen Live */}
            <div className="px-4 pt-4 sm:hidden">
              <Link
                href="/live"
                className="w-full flex items-center justify-center gap-2 bg-sweet-red hover:bg-sweet-red-dark text-white px-4 py-3 rounded-full font-semibold text-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Listen Live
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
