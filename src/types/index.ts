export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface SidebarStat {
  number: string;
  label: string;
}

export interface KeyRole {
  period: string;
  role: string;
}

export interface FastFact {
  label: string;
  value: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  featuredImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  readTime?: number;
  tags?: string[];

  // Feature-article fields (optional — used by OverSight PI magazine layout)
  kicker?: string;
  issueLabel?: string;
  pullQuote?: string;
  pullQuoteAttribution?: string;
  sidebarStats?: SidebarStat[];
  keyRoles?: KeyRole[];
  fastFacts?: FastFact[];
  timeline?: TimelineEntry[];
}

export interface BreakingNews {
  id: string;
  headline: string;
  url?: string;
  timestamp: string;
}

export type AdPosition = "sidebar" | "banner" | "in-article" | "header" | "footer";

export interface Advertisement {
  id: string;
  name: string;
  image: string;
  url: string;
  position: AdPosition;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}
