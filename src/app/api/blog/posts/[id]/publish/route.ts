import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    const { data: post, error } = await supabase
      .from('BlogPost')
      .update({
        status: 'published',
        publishedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: post.id,
      status: post.status,
      publishedAt: post.publishedAt,
    });
  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
