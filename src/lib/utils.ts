import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const SUPABASE_STORAGE_PATH = '/storage/v1/object/public/';

/**
 * Rewrites Supabase Storage URLs from a migrated/old project host to the
 * current NEXT_PUBLIC_SUPABASE_URL host while preserving bucket + file path.
 */
export function resolveStorageUrl(url: string): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
    if (!supabaseUrl || !url.includes('.supabase.co') || !url.includes(SUPABASE_STORAGE_PATH)) {
        return url;
    }

    try {
        const currentHost = new URL(supabaseUrl).host;
        const parsed = new URL(url);
        if (parsed.host === currentHost) return url;

        const storageIndex = parsed.pathname.indexOf(SUPABASE_STORAGE_PATH);
        if (storageIndex === -1) return url;

        const storagePath = parsed.pathname.slice(storageIndex + SUPABASE_STORAGE_PATH.length);
        return `${supabaseUrl}${SUPABASE_STORAGE_PATH}${storagePath}`;
    } catch {
        return url;
    }
}

export function getValidImageUrl(url: string | null | undefined, fallback: string = '/images/placeholder.svg'): string {
    if (!url || typeof url !== 'string' || url.trim() === '') return fallback;

    const trimmedUrl = resolveStorageUrl(url.trim());

    // Valid patterns for next/image
    if (
        trimmedUrl.startsWith('http') ||
        trimmedUrl.startsWith('/') ||
        trimmedUrl.startsWith('blob:') ||
        trimmedUrl.startsWith('data:')
    ) {
        return trimmedUrl;
    }

    // If it's a relative path without leading slash (like "uploads/..."), 
    // we prepend a slash to make it a valid path for Next.js Image
    return `/${trimmedUrl}`;
}

export function getLocalizedHref(path: string, lang: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (lang === 'en') return cleanPath;
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}
