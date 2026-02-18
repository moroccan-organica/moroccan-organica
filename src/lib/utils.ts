import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getValidImageUrl(url: string | null | undefined, fallback: string = '/images/placeholder.svg'): string {
    if (!url || typeof url !== 'string' || url.trim() === '') return fallback;

    const trimmedUrl = url.trim();

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
