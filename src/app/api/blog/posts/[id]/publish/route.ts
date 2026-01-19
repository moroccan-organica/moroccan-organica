import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/blog/posts/[id]/publish - Publish a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: post.id,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString(),
    });
  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
