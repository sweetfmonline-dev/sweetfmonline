import Link from "next/link";
import { cn } from "@/lib/utils";
import { OVERSIGHT_SUBSECTIONS } from "@/lib/oversight";

interface OversightSubNavProps {
  // Pass the slug of the currently-active subsection, or "all" for the parent landing
  active: string;
}

export function OversightSubNav({ active }: OversightSubNavProps) {
  const tabs = [
    { slug: "all", href: "/oversight-pi", label: "All Reports" },
    ...OVERSIGHT_SUBSECTIONS.map((s) => ({
      slug: s.slug,
      href: `/oversight-pi/${s.slug}`,
      label: s.label,
    })),
  ];

  return (
    <div className="border-b-2 border-charcoal bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.slug === active;
            return (
              <Link
                key={tab.slug}
                href={tab.href}
                className={cn(
                  "py-4 text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-colors",
                  isActive
                    ? "font-bold text-charcoal border-b-2 border-sweet-red -mb-0.5"
                    : "font-semibold text-charcoal/60 hover:text-sweet-red"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
