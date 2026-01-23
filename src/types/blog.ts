import { JSONContent } from '@tiptap/core';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount?: number;
}

export interface Author {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_ar?: string;
  slug: string;
  excerpt: string;
  excerpt_ar?: string;
  content: JSONContent;
  content_ar?: JSONContent;
  featured_image_url: string;
  author_id: string;
  category_id: string;
  tags: string[];
  status: 'draft' | 'published' | 'review';
  published_at: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  read_time_minutes: number;
}

export interface BlogPostFull extends BlogPost {
  author?: Author;
  category?: BlogCategory;
}

export interface BlogKPI {
  id: string;
  title: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  colorGradient?: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  inReviewPosts: number;
  totalViews: number;
  totalMedia: number;
}

export interface BlogActivity {
  id: string;
  text: string;
  time: string;
  type: 'publish' | 'media' | 'status' | 'create' | 'edit';
}

export interface BlogPostMedia {
  id: string;
  blogger_id: string;
  post_id?: string;
  media_type: 'image' | 'video';
  url: string;
  storage_path?: string;
  alt_text?: string;
  caption?: string;
  file_size_bytes?: number;
  mime_type?: string;
  video_provider?: 'local' | 'youtube' | 'vimeo';
  video_id?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  created_at: string;
}
