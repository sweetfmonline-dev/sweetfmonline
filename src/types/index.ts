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

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featuredImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  readTime?: number;
  tags?: string[];
}

export interface BreakingNews {
  id: string;
  headline: string;
  url?: string;
  timestamp: string;
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
