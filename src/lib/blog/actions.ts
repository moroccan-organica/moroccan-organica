'use server';

import { prisma } from '@/lib/prisma';
import type { BlogPostFull, BlogCategory } from '@/types/blog';

function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

// ============================================
// PUBLIC SERVER ACTIONS FOR BLOG
// ============================================

export interface GetPostsOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
}

export interface PaginatedPostsResponse {
  posts: BlogPostFull[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all published blog posts (for client-facing pages)
 */
export async function getPublishedPosts(
  options: GetPostsOptions = {}
): Promise<PaginatedPostsResponse> {
  const { page = 1, pageSize = 10, categoryId, search } = options;

  try {
    const where: Record<string, unknown> = {
      status: 'published',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const formattedPosts: BlogPostFull[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: post.featuredImageUrl || '',
      author_id: post.authorId,
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt?.toISOString() || '',
      created_at: post.createdAt.toISOString(),
      updated_at: post.updatedAt.toISOString(),
      view_count: post.viewCount,
      read_time_minutes: post.readTimeMinutes,
      author: post.author
        ? {
            id: post.author.id,
            name: post.author.name || 'Unknown',
            avatar_url: post.author.image || '',
          }
        : undefined,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
            color: post.category.color || '#606C38',
            icon: post.category.icon || '',
          }
        : undefined,
    }));

    return {
      posts: formattedPosts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return {
      posts: [],
      pagination: { page: 1, pageSize, total: 0, totalPages: 0 },
    };
  }
}

/**
 * Get a single published blog post by slug
 */
export async function getPublishedPostBySlug(
  slug: string
): Promise<BlogPostFull | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'published',
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: true,
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: post.featuredImageUrl || '',
      author_id: post.authorId,
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt?.toISOString() || '',
      created_at: post.createdAt.toISOString(),
      updated_at: post.updatedAt.toISOString(),
      view_count: post.viewCount,
      read_time_minutes: post.readTimeMinutes,
      author: post.author
        ? {
            id: post.author.id,
            name: post.author.name || 'Unknown',
            avatar_url: post.author.image || '',
          }
        : undefined,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
            color: post.category.color || '#606C38',
            icon: post.category.icon || '',
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Get all blog categories
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { posts: { where: { status: 'published' } } } },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#606C38',
      icon: cat.icon || '',
      postCount: cat._count.posts,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Increment view count for a blog post
 */
export async function incrementPostViewCount(postId: string): Promise<void> {
  try {
    await prisma.blogPost.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

/**
 * Get related posts (same category, excluding current post)
 */
export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit: number = 3
): Promise<BlogPostFull[]> {
  try {
    const where: Record<string, unknown> = {
      status: 'published',
      id: { not: postId },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: post.featuredImageUrl || '',
      author_id: post.authorId,
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt?.toISOString() || '',
      created_at: post.createdAt.toISOString(),
      updated_at: post.updatedAt.toISOString(),
      view_count: post.viewCount,
      read_time_minutes: post.readTimeMinutes,
      author: post.author
        ? {
            id: post.author.id,
            name: post.author.name || 'Unknown',
            avatar_url: post.author.image || '',
          }
        : undefined,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
            color: post.category.color || '#606C38',
            icon: post.category.icon || '',
          }
        : undefined,
    }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
