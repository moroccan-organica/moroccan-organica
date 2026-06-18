import 'server-only';

import { supabaseAdmin } from '@/lib/supabase-admin';

const PRODUCT_BUCKET = 'products';
const BLOG_BUCKET = 'blog';

export async function deleteFileFromStorage(url: string) {
    if (!url || (!url.includes('supabase.co') && !url.includes('storage.supabase.com'))) return;

    try {
        const bucket = url.includes(`/public/${BLOG_BUCKET}/`) ? BLOG_BUCKET :
            url.includes(`/public/${PRODUCT_BUCKET}/`) ? PRODUCT_BUCKET : null;

        if (!bucket) return;

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
