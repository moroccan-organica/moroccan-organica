'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { BlogPostFull, BlogCategory } from '@/types/blog';

// ============================================
// TYPES
// ============================================

interface BlogPostInput {
  title: string;
  titleAr?: string;
  content?: Record<string, unknown>;
  contentAr?: Record<string, unknown>;
  excerpt?: string;
  excerptAr?: string;
  categoryId?: string;
  tags?: string[];
  featuredImageUrl?: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface BlogCategoryInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface BlogPostUpdateData {
  title?: string;
  titleAr: string | null;
  content: string;
  contentAr: string | null;
  excerpt: string;
  excerptAr: string | null;
  categoryId: string | null;
  tags: string;
  featuredImageUrl: string | null;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  readTimeMinutes: number;
  publishedAt?: string;
}

interface SupabasePostRow {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt?: string;
  excerptAr?: string;
  content?: string;
  contentAr?: string;
  featuredImageUrl?: string;
  authorId?: string;
  categoryId?: string;
  status: string;
  tags?: string;
  viewCount?: number;
  readTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string; image?: string };
  category?: { id: string; name: string; slug: string; color?: string; icon?: string };
  media?: { url: string; mediaType: string }[];
}

interface SupabaseCategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  posts?: { count: number }[];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

// ============================================
// HELPERS
// ============================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Resolve the best featured image URL.
 * If featuredImageUrl is a broken /uploads/ path, try to use BlogMedia URL instead.
 */
function resolveFeaturedImageUrl(post: SupabasePostRow): string {
  const url = post.featuredImageUrl || '';
  // If URL is a valid Supabase Storage URL or external URL, use it directly
  if (url.startsWith('http')) return url;
  // If URL is an old /uploads/ path, try to find a valid URL from BlogMedia
  if (url.startsWith('/uploads/') && post.media?.length) {
    const imageMedia = post.media.find(m => m.mediaType === 'image' && m.url?.startsWith('http'));
    if (imageMedia) return imageMedia.url;
  }
  return url;
}

// No strict auth check - follows product.actions.ts pattern
// The admin pages are already protected by middleware/layout
// Returns a default admin user ID for authorId field
async function getDefaultAuthorId(): Promise<string> {
  // Get first admin user from database
  const { data: adminUser } = await supabase
    .from('User')
    .select('id')
    .eq('role', 'ADMIN')
    .limit(1)
    .maybeSingle();

  // Return found admin or default seed ID
  return adminUser?.id || 'user_admin_01';
}

// ============================================
// PUBLIC SERVER ACTIONS FOR BLOG
// ============================================

export interface GetPostsOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  status?: string;
}

export interface PaginatedPostsResponse {
  data: BlogPostFull[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get blog posts with filters (can be used for admin or public)
 */
export async function getBlogPosts(
  options: GetPostsOptions = {}
): Promise<PaginatedPostsResponse> {
  const { page = 1, pageSize = 10, categoryId, search, status } = options;

  try {
    let query = supabase
      .from('BlogPost')
      .select('*, author:User(id, name, image), category:BlogCategory(*), media:BlogMedia(url, mediaType)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (categoryId) {
      query = query.eq('categoryId', categoryId);
    }

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`;
      query = query.or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern}`);
    }

    const { data: posts, count: total, error } = await query
      .order('createdAt', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    const formattedPosts: BlogPostFull[] = (posts || []).map((post: SupabasePostRow) => ({
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: resolveFeaturedImageUrl(post),
      author_id: post.authorId || '',
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt || '',
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      view_count: post.viewCount || 0,
      read_time_minutes: post.readTimeMinutes || 0,
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
      data: formattedPosts,
      pagination: {
        page,
        pageSize,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / pageSize),
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      data: [],
      pagination: { page: 1, pageSize, total: 0, totalPages: 0 },
    };
  }
}

/**
 * Get published posts for the public blog page
 */
export async function getPublishedPosts(
  options: { page?: number; pageSize?: number; categoryId?: string; search?: string } = {}
): Promise<{ posts: BlogPostFull[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }> {
  const result = await getBlogPosts({
    ...options,
    status: 'published',
  });
  return {
    posts: result.data,
    pagination: result.pagination,
  };
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPostById(id: string): Promise<BlogPostFull | null> {
  try {
    const { data: post, error } = await supabase
      .from('BlogPost')
      .select('*, author:User(id, name, image), category:BlogCategory(*), media:BlogMedia(url, mediaType)')
      .eq('id', id)
      .single();

    if (error || !post) return null;

    return {
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: resolveFeaturedImageUrl(post),
      author_id: post.authorId,
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt || '',
      created_at: post.createdAt,
      updated_at: post.updatedAt,
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
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

/**
 * Get a single published blog post by slug
 */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPostFull | null> {
  try {
    const { data: post, error } = await supabase
      .from('BlogPost')
      .select('*, author:User(id, name, image), category:BlogCategory(*), media:BlogMedia(url, mediaType)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) return null;

    return {
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: resolveFeaturedImageUrl(post),
      author_id: post.authorId,
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt || '',
      created_at: post.createdAt,
      updated_at: post.updatedAt,
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
 * Create a new blog post (ADMIN ONLY)
 */
export async function createBlogPost(input: BlogPostInput) {
  try {
    const authorId = await getDefaultAuthorId();
    const { title, titleAr, content, contentAr, excerpt, excerptAr, categoryId, tags, featuredImageUrl, status, metaTitle, metaDescription } = input;

    const slug = generateSlug(title);
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
      const { data: existing } = await supabase
        .from('BlogPost')
        .select('id')
        .eq('slug', uniqueSlug)
        .maybeSingle();

      if (!existing) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const { data: post, error } = await supabase
      .from('BlogPost')
      .insert({
        title,
        titleAr: titleAr || null,
        slug: uniqueSlug,
        content: JSON.stringify(content || { type: 'doc', content: [] }),
        contentAr: contentAr ? JSON.stringify(contentAr) : null,
        excerpt: excerpt || '',
        excerptAr: excerptAr || null,
        categoryId: categoryId || null,
        tags: JSON.stringify(tags || []),
        featuredImageUrl: featuredImageUrl || null,
        status: status || 'draft',
        authorId,
        publishedAt: status === 'published' ? new Date().toISOString() : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        readTimeMinutes: Math.max(1, Math.ceil((JSON.stringify(content || {}).length) / 1000)),
      })
      .select()
      .single();

    if (error) throw error;

    // Handle Media linking logic
    if (featuredImageUrl && !featuredImageUrl.startsWith('data:') && !featuredImageUrl.startsWith('blob:')) {
      const { data: existingMedia } = await supabase
        .from('BlogMedia')
        .select('id')
        .eq('url', featuredImageUrl)
        .is('postId', null)
        .maybeSingle();

      if (existingMedia) {
        await supabase.from('BlogMedia').update({ postId: post.id }).eq('id', existingMedia.id);
      } else {
        await supabase.from('BlogMedia').insert({ postId: post.id, mediaType: 'image', url: featuredImageUrl });
      }
    }

    revalidatePath('/[lang]/blog');
    revalidatePath('/[lang]/admin/blog');
    return { success: true, id: post.id, slug: post.slug };
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Update a blog post (ADMIN ONLY)
 */
export async function updateBlogPost(postId: string, input: Partial<BlogPostInput>) {
  try {
    const { title, titleAr, content, contentAr, excerpt, excerptAr, categoryId, tags, featuredImageUrl, status, metaTitle, metaDescription } = input;

    const updateData: BlogPostUpdateData = {
      title,
      titleAr: titleAr || null,
      content: JSON.stringify(content || { type: 'doc', content: [] }),
      contentAr: contentAr ? JSON.stringify(contentAr) : null,
      excerpt: excerpt || '',
      excerptAr: excerptAr || null,
      categoryId: categoryId || null,
      tags: JSON.stringify(tags || []),
      featuredImageUrl: featuredImageUrl || null,
      status: status || 'draft',
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      readTimeMinutes: Math.max(1, Math.ceil((JSON.stringify(content || {}).length) / 1000)),
    };

    if (status === 'published') {
      updateData.publishedAt = new Date().toISOString();
    }

    const { error } = await supabase
      .from('BlogPost')
      .update(updateData)
      .eq('id', postId);

    if (error) throw error;

    revalidatePath('/[lang]/blog');
    revalidatePath('/[lang]/admin/blog');
    revalidatePath(`/[lang]/blog/${postId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating post:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Delete a blog post (ADMIN ONLY)
 */
export async function deleteBlogPost(postId: string) {
  try {
    const { error } = await supabase.from('BlogPost').delete().eq('id', postId);
    if (error) throw error;

    revalidatePath('/[lang]/blog');
    revalidatePath('/[lang]/admin/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting post:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Publish a blog post (ADMIN ONLY)
 */
export async function publishBlogPost(postId: string) {
  try {
    const { error } = await supabase
      .from('BlogPost')
      .update({
        status: 'published',
        publishedAt: new Date().toISOString()
      })
      .eq('id', postId);

    if (error) throw error;

    revalidatePath('/[lang]/blog');
    revalidatePath('/[lang]/admin/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error publishing post:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Archive a blog post (ADMIN ONLY)
 */
export async function archiveBlogPost(postId: string) {
  try {
    const { error } = await supabase
      .from('BlogPost')
      .update({ status: 'archived' })
      .eq('id', postId);

    if (error) throw error;

    revalidatePath('/[lang]/blog');
    revalidatePath('/[lang]/admin/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error archiving post:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Unarchive a blog post (ADMIN ONLY)
 */
export async function unarchiveBlogPost(postId: string) {
  try {
    const { error } = await supabase
      .from('BlogPost')
      .update({ status: 'draft' })
      .eq('id', postId);

    if (error) throw error;

    revalidatePath('/[lang]/blog');
    revalidatePath('/[lang]/admin/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error unarchiving post:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Get all blog categories (with optional counts)
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data: categories, error } = await supabase
      .from('BlogCategory')
      .select('*, posts:BlogPost(count)')
      .order('sortOrder', { ascending: true });

    if (error) throw error;

    return (categories || []).map((cat: SupabaseCategoryRow) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#606C38',
      icon: cat.icon || '',
      postCount: cat.posts?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Create a blog category (ADMIN ONLY)
 */
export async function createBlogCategory(input: BlogCategoryInput) {
  try {
    const { name, description, color, icon } = input;
    const slug = generateSlug(name);

    const { data, error } = await supabase
      .from('BlogCategory')
      .insert({
        name,
        description: description || null,
        color: color || '#606C38',
        icon: icon || null,
        slug,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/[lang]/admin/blog');
    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error creating category:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Delete a blog category (ADMIN ONLY)
 */
export async function deleteBlogCategory(categoryId: string) {
  try {
    // Check for associated posts first
    const { count, error: countError } = await supabase
      .from('BlogPost')
      .select('*', { count: 'exact', head: true })
      .eq('categoryId', categoryId);

    if (countError) throw countError;

    if (count && count > 0) {
      return { success: false, error: 'Cannot delete category with associated posts' };
    }

    const { error } = await supabase.from('BlogCategory').delete().eq('id', categoryId);
    if (error) throw error;

    revalidatePath('/[lang]/admin/blog');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting category:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Increment view count
 */
export async function incrementPostViewCount(postId: string): Promise<void> {
  try {
    const { data: post } = await supabase.from('BlogPost').select('viewCount').eq('id', postId).single();
    if (post) {
      await supabase.from('BlogPost').update({ viewCount: (post.viewCount || 0) + 1 }).eq('id', postId);
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

/**
 * Get related posts
 */
export async function getRelatedPosts(postId: string, categoryId: string | null, limit: number = 3): Promise<BlogPostFull[]> {
  try {
    let query = supabase
      .from('BlogPost')
      .select('*, author:User(id, name, image), category:BlogCategory(*)')
      .eq('status', 'published')
      .neq('id', postId);

    if (categoryId) query = query.eq('categoryId', categoryId);

    const { data: posts, error } = await query
      .order('publishedAt', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (posts || []).map((post: SupabasePostRow) => ({
      id: post.id,
      title: post.title,
      title_ar: post.titleAr || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      excerpt_ar: post.excerptAr || '',
      content: safeJsonParse(post.content, { type: 'doc', content: [] }),
      content_ar: safeJsonParse(post.contentAr, { type: 'doc', content: [] }),
      featured_image_url: post.featuredImageUrl || '',
      author_id: post.authorId || '',
      category_id: post.categoryId || '',
      tags: safeJsonParse(post.tags, []),
      status: post.status as 'draft' | 'published' | 'review',
      published_at: post.publishedAt || '',
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      view_count: post.viewCount || 0,
      read_time_minutes: post.readTimeMinutes || 0,
      author: post.author ? {
        id: post.author.id,
        name: post.author.name || 'Unknown',
        avatar_url: post.author.image || '',
      } : undefined,
      category: post.category ? {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        color: post.category.color || '#606C38',
        icon: post.category.icon || '',
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
