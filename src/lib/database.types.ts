// 🌸 花屿 - 数据库类型定义

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ArticleTag {
  article_id: number;
  tag_id: number;
}

export interface Friend {
  id: number;
  name: string;
  url: string;
  description: string | null;
  avatar: string | null;
  sort_order: number;
  created_at: string;
}

export interface SiteConfig {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}
