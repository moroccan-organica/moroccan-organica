import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/blog/posts/[id]/archive - Archive a post
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
      .update({ status: 'archived' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: post.id,
      status: post.status,
    });
  } catch (error) {
    console.error('Error archiving post:', error);
    return NextResponse.json({ error: 'Failed to archive post' }, { status: 500 });
  }
}

// DELETE /api/blog/posts/[id]/archive - Unarchive a post (restore to draft)
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

    const { data: post, error } = await supabase
      .from('BlogPost')
      .update({ status: 'draft' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: post.id,
      status: post.status,
    });
  } catch (error) {
    console.error('Error unarchiving post:', error);
    return NextResponse.json({ error: 'Failed to unarchive post' }, { status: 500 });
  }
}
