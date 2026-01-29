import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const UPLOAD_DIR = join(process.cwd(), 'public', 'images', 'blog');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const postId = formData.get('postId') as string | null; // Optional: link to post

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = originalName.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/images/blog/${filename}`;

    // Save to BlogMedia table
    const blogMedia = await prisma.blogMedia.create({
      data: {
        postId: postId || null,
        mediaType: 'image',
        url: publicUrl,
        storagePath: filepath,
        fileSizeBytes: file.size,
        mimeType: file.type,
        altText: originalName.replace(/\.[^/.]+$/, ''), // filename without extension
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      mediaId: blogMedia.id,
      media: {
        id: blogMedia.id,
        url: blogMedia.url,
        media_type: blogMedia.mediaType,
        storage_path: blogMedia.storagePath,
        alt_text: blogMedia.altText,
        caption: blogMedia.caption,
        file_size_bytes: blogMedia.fileSizeBytes,
        mime_type: blogMedia.mimeType,
        created_at: blogMedia.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
