'use server';

import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }
    return session;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Upload a blog image (Server Action)
 */
export async function uploadBlogImage(formData: FormData) {
    const session = await checkAuth();

    try {
        const file = formData.get('file') as File | null;
        const postId = formData.get('postId') as string | null;

        if (!file) throw new Error('No file provided');

        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Invalid file type');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('File size exceeds 5MB limit');
        }

        const uploadDir = join(process.cwd(), 'public', 'images', 'blog');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const ext = originalName.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomStr}.${ext}`;
        const filepath = join(uploadDir, filename);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        const publicUrl = `/images/blog/${filename}`;

        const { data: blogMedia, error } = await supabase
            .from('BlogMedia')
            .insert({
                postId: postId || null,
                mediaType: 'image',
                url: publicUrl,
                storagePath: filepath,
                fileSizeBytes: file.size,
                mimeType: file.type,
                altText: originalName.replace(/\.[^/.]+$/, ''),
            })
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            media: {
                id: blogMedia.id,
                url: blogMedia.url,
                media_type: blogMedia.mediaType,
                storage_path: blogMedia.storagePath,
                alt_text: blogMedia.altText,
                caption: blogMedia.caption,
                file_size_bytes: blogMedia.fileSizeBytes,
                mime_type: blogMedia.mimeType,
                created_at: blogMedia.createdAt,
            }
        };
    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get blog media list
 */
export async function getBlogMedia(filters: { postId?: string; mediaType?: string } = {}) {
    await checkAuth();

    try {
        let query = supabase.from('BlogMedia').select('*');

        if (filters.postId) {
            query = query.eq('postId', filters.postId);
        }
        if (filters.mediaType) {
            query = query.eq('mediaType', filters.mediaType);
        }

        const { data: media, error } = await query.order('createdAt', { ascending: false });

        if (error) throw error;

        return (media || []).map((item: any) => ({
            id: item.id,
            post_id: item.postId,
            media_type: item.mediaType,
            url: item.url,
            storage_path: item.storagePath,
            alt_text: item.altText,
            caption: item.caption,
            file_size_bytes: item.fileSizeBytes,
            mime_type: item.mimeType,
            created_at: item.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching media:', error);
        throw new Error('Failed to fetch media');
    }
}

/**
 * Delete blog media
 */
export async function deleteBlogMedia(id: string) {
    await checkAuth();

    try {
        const { error } = await supabase.from('BlogMedia').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Delete media error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Upload a product image (Server Action)
 */
export async function uploadProductImage(formData: FormData) {
    await checkAuth();

    try {
        const file = formData.get('file') as File | null;
        if (!file) throw new Error('No file provided');

        const uploadDir = join(process.cwd(), 'public', 'images', 'products');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const ext = originalName.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomStr}.${ext}`;
        const filepath = join(uploadDir, filename);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        return {
            success: true,
            url: `/images/products/${filename}`
        };
    } catch (error: any) {
        console.error('Product upload error:', error);
        return { success: false, error: error.message };
    }
}
