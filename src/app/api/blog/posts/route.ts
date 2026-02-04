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

// GET /api/blog/posts - List all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const formattedPosts = posts.map((post) => ({
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
    }));

    return NextResponse.json({
      data: formattedPosts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/blog/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, titleAr, content, contentAr, excerpt, excerptAr, categoryId, tags, featuredImageUrl, status, metaTitle, metaDescription } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = generateSlug(title);

    // Ensure unique slug
    let counter = 1;
    let uniqueSlug = slug;
    while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await prisma.blogPost.create({
      data: {
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
        authorId: session.user.id,
        publishedAt: status === 'published' ? new Date() : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        readTimeMinutes: Math.max(1, Math.ceil((content?.content?.length || 0) / 200)),
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
        media: true,
      },
    });

    // If featured image URL is provided, link it to the post in BlogMedia
    if (featuredImageUrl && !featuredImageUrl.startsWith('data:') && !featuredImageUrl.startsWith('blob:')) {
      // Check if media already exists (from upload API)
      const existingMedia = await prisma.blogMedia.findFirst({
        where: {
          url: featuredImageUrl,
          postId: null, // Not linked yet
        },
      });

      if (existingMedia) {
        // Link existing media to post
        await prisma.blogMedia.update({
          where: { id: existingMedia.id },
          data: { postId: post.id },
        });
      } else {
        // Create new media entry
        await prisma.blogMedia.create({
          data: {
            postId: post.id,
            mediaType: 'image',
            url: featuredImageUrl,
          },
        });
      }
    }

    return NextResponse.json({ id: post.id, slug: post.slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
