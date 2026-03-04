'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface HtmlContentProps {
    html: string;
    className?: string;
    dir?: 'ltr' | 'rtl';
}

export function HtmlContent({ html, className, dir }: HtmlContentProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Process all links to have correct attributes in the DOM
        const anchors = el.getElementsByTagName('a');
        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            const href = anchor.getAttribute('href');
            if (!href) continue;

            try {
                // If it's a full URL, check the origin
                if (href.startsWith('http') || href.startsWith('//')) {
                    const url = new URL(href, window.location.origin);
                    if (url.origin !== window.location.origin) {
                        anchor.target = '_blank';
                        anchor.rel = 'noopener noreferrer nofollow';
                    }
                } else if (href.startsWith('/')) {
                    // Internal link - usually shouldn't have target="_blank"
                    // unless force-poured from editor. We leave it as is 
                    // or force removal if we want to be strict.
                }
            } catch (e) {
                // Ignore invalid URLs
            }
        }

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const anchor = target.closest('a') as HTMLAnchorElement | null;
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Let middle-click / modifier clicks behave normally
            if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey) {
                return;
            }

            try {
                // Determine if it's internal
                const isInternal = !href.startsWith('http') && !href.startsWith('//') ||
                    href.startsWith(window.location.origin);

                if (isInternal) {
                    event.preventDefault();
                    // Extract path from absolute URL if needed
                    const targetUrl = new URL(href, window.location.origin);
                    const relativeHref = targetUrl.pathname + targetUrl.search + targetUrl.hash;
                    router.push(relativeHref);
                }
            } catch (e) {
                // Not a valid URL, ignore
            }
        };

        el.addEventListener('click', handleClick);
        return () => el.removeEventListener('click', handleClick);
    }, [router, html]);

    return (
        <div
            ref={containerRef}
            className={className}
            dir={dir}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
