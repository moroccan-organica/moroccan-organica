import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/blog/media - Get all media (optionally filtered by postId)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const mediaType = searchParams.get('mediaType'); // 'image' or 'video'

    let query = supabase.from('BlogMedia').select('*');

    if (postId) {
      query = query.eq('postId', postId);
    }
    if (mediaType) {
      query = query.eq('mediaType', mediaType);
    }

    const { data: media, error } = await query.order('createdAt', { ascending: false });

    if (error) throw error;

    const formattedMedia = (media || []).map((item: any) => ({
      id: item.id,
      blogger_id: session.user.id,
      post_id: item.postId,
      media_type: item.mediaType as 'image' | 'video',
      url: item.url,
      storage_path: item.storagePath,
      alt_text: item.altText,
      caption: item.caption,
      file_size_bytes: item.fileSizeBytes,
      mime_type: item.mimeType,
      created_at: item.createdAt,
    }));

    return NextResponse.json(formattedMedia);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// DELETE /api/blog/media/[id] - Delete a media item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('BlogMedia')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
