'use client';

import { useEffect } from 'react';
import { incrementPostViewCount } from '@/lib/blog/actions';

interface BlogPostViewTrackerProps {
    postId: string;
    title?: string;
}

export function BlogPostViewTracker({ postId, title }: BlogPostViewTrackerProps) {
    useEffect(() => {
        if (postId) {
            incrementPostViewCount(postId).catch((err) => {
                console.error('Error incrementing post view count:', err);
            });
        }
    }, [postId]);

    useEffect(() => {
        if (title && typeof document !== 'undefined') {
            document.title = title;
        }
    }, [title]);

    return null;
}
