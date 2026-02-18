'use server';

import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Supabase Storage Buckets
const PRODUCT_BUCKET = 'products';
const BLOG_BUCKET = 'blog';

/**
 * Helper to delete a file from Supabase Storage using its public URL
 */
export async function deleteFileFromStorage(url: string) {
    if (!url || (!url.includes('supabase.co') && !url.includes('storage.supabase.com'))) return;

    try {
        const bucket = url.includes(`/public/${BLOG_BUCKET}/`) ? BLOG_BUCKET :
            url.includes(`/public/${PRODUCT_BUCKET}/`) ? PRODUCT_BUCKET : null;

        if (!bucket) return;

        // Extract filename from URL
        // Format: .../public/bucket/filename
        const parts = url.split(`/public/${bucket}/`);
        if (parts.length < 2) return;

        const filepath = parts[1];

        const { error } = await supabaseAdmin.storage
            .from(bucket)
            .remove([filepath]);

        if (error) {
            console.error(`Error deleting file from storage (${bucket}):`, error);
        }
    } catch (err) {
        console.error('Failed to parse storage URL for deletion:', err);
    }
}


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

interface BlogMediaRow {
    id: string;
    postId?: string;
    mediaType: string;
    url: string;
    storagePath?: string;
    altText?: string;
    caption?: string;
    fileSizeBytes?: number;
    mimeType?: string;
    createdAt: string;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message: unknown }).message);
    }
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
}

/**
 * Upload a blog image to Supabase Storage
 */
export async function uploadBlogImage(formData: FormData) {
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

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const ext = originalName.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomStr}.${ext}`;
        const filepath = `${filename}`; // Storage path inside bucket

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(BLOG_BUCKET)
            .upload(filepath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(BLOG_BUCKET)
            .getPublicUrl(filepath);

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
    } catch (error: unknown) {
        console.error('Upload error:', error);
        return { success: false, error: getErrorMessage(error) };
    }
}

/**
 * Get blog media list
 */
export async function getBlogMedia(filters: { postId?: string; mediaType?: string } = {}) {
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

        return (media || []).map((item: BlogMediaRow) => ({
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
    try {
        // First get the media to know the storage path
        const { data: media, error: getError } = await supabase
            .from('BlogMedia')
            .select('storagePath')
            .eq('id', id)
            .single();

        if (!getError && media?.storagePath) {
            // Try to delete from storage as well
            await supabaseAdmin.storage
                .from(BLOG_BUCKET)
                .remove([media.storagePath]);
        }

        const { error } = await supabase.from('BlogMedia').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: unknown) {
        console.error('Delete media error:', error);
        return { success: false, error: getErrorMessage(error) };
    }
}

/**
 * Upload a product image to Supabase Storage
 */
export async function uploadProductImage(formData: FormData) {
    try {
        const file = formData.get('file') as File | null;
        if (!file) throw new Error('No file provided');

        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Invalid file type');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error('File size exceeds 5MB limit');
        }

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const ext = originalName.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomStr}.${ext}`;
        const filepath = `${filename}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(PRODUCT_BUCKET)
            .upload(filepath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(PRODUCT_BUCKET)
            .getPublicUrl(filepath);

        return {
            success: true,
            url: publicUrl
        };
    } catch (error: unknown) {
        console.error('Product upload error:', error);
        return { success: false, error: getErrorMessage(error) };
    }
}
