"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { 
    label: "News", 
    href: "/category/news",
    dropdown: [
      { label: "General News", href: "/category/news" },
      { label: "Politics", href: "/category/news/politics" },
    ]
  },
  { 
    label: "Business", 
    href: "/category/business",
    dropdown: [
      { label: "Agribusiness", href: "/category/business/agribusiness" },
      { label: "Banking and Finance", href: "/category/business/banking-and-finance" },
      { label: "Energy", href: "/category/business/energy" },
    ]
  },
  { 
    label: "World", 
    href: "/category/world",
    dropdown: [
      { label: "Africa", href: "/category/world/africa" },
      { label: "Europe", href: "/category/world/europe" },
      { label: "US", href: "/category/world/us" },
      { label: "Global", href: "/category/world/global" },
    ]
  },
  { label: "Sport", href: "/category/sport" },
  { 
    label: "Entertainment", 
    href: "/category/entertainment",
    dropdown: [
      { label: "Music", href: "/category/entertainment/music" },
      { label: "Movie", href: "/category/entertainment/movie" },
      { label: "Fashion", href: "/category/entertainment/fashion" },
    ]
  },
  { label: "Opinion", href: "/category/opinion" },
  {
    label: "OverSight PI",
    href: "/oversight-pi",
    dropdown: [
      { label: "All Reports", href: "/oversight-pi" },
      { label: "Bolshevik Perspective", href: "/oversight-pi/bolshevik-perspective" },
    ],
  },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-semibold text-charcoal hover:text-sweet-red transition-colors flex items-center gap-1"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px]">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm font-medium text-charcoal hover:text-sweet-red hover:bg-gray-50 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 text-base font-semibold text-charcoal hover:text-sweet-red hover:bg-gray-50 transition-colors"
                  onClick={() => !item.dropdown && setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                
                {/* Mobile Dropdown Items */}
                {item.dropdown && (
                  <div className="pl-4 bg-gray-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-sweet-red transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
