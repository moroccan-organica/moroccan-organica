import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

// GET /api/blog/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const formattedPost = {
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
      meta_title: post.metaTitle || '',
      meta_description: post.metaDescription || '',
      author: post.author ? {
        id: post.author.id,
        name: post.author.name || 'Unknown',
        avatar_url: post.author.image || '',
      } : undefined,
      category: post.category ? {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        color: post.category.color || '',
      } : undefined,
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/blog/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, titleAr, content, contentAr, excerpt, excerptAr, categoryId, tags, featuredImageUrl, status, metaTitle, metaDescription } = body;

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      updateData.title = title;
      const newSlug = generateSlug(title);
      if (newSlug !== existingPost.slug) {
        let counter = 1;
        let uniqueSlug = newSlug;
        while (await prisma.blogPost.findFirst({ where: { slug: uniqueSlug, id: { not: id } } })) {
          uniqueSlug = `${newSlug}-${counter}`;
          counter++;
        }
        updateData.slug = uniqueSlug;
      }
    }
    if (titleAr !== undefined) updateData.titleAr = titleAr || null;
    if (content !== undefined) updateData.content = JSON.stringify(content);
    if (contentAr !== undefined) updateData.contentAr = contentAr ? JSON.stringify(contentAr) : null;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (excerptAr !== undefined) updateData.excerptAr = excerptAr || null;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (featuredImageUrl !== undefined) updateData.featuredImageUrl = featuredImageUrl || null;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription || null;

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && existingPost.status !== 'published') {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
        media: true,
      },
    });

    // Update BlogMedia if featured image URL changed
    if (featuredImageUrl !== undefined && featuredImageUrl &&
      !featuredImageUrl.startsWith('data:') && !featuredImageUrl.startsWith('blob:')) {
      // Check if media already exists for this post
      const existingMedia = await prisma.blogMedia.findFirst({
        where: {
          postId: id,
          mediaType: 'image',
        },
      });

      if (existingMedia) {
        // Update existing media URL
        await prisma.blogMedia.update({
          where: { id: existingMedia.id },
          data: { url: featuredImageUrl },
        });
      } else {
        // Check if media exists but not linked
        const unlinkedMedia = await prisma.blogMedia.findFirst({
          where: {
            url: featuredImageUrl,
            postId: null,
          },
        });

        if (unlinkedMedia) {
          // Link existing media to post
          await prisma.blogMedia.update({
            where: { id: unlinkedMedia.id },
            data: { postId: id },
          });
        } else {
          // Create new media entry
          await prisma.blogMedia.create({
            data: {
              postId: id,
              mediaType: 'image',
              url: featuredImageUrl,
            },
          });
        }
      }
    }

    return NextResponse.json({
      id: post.id,
      slug: post.slug,
      status: post.status,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/blog/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
