'use client';

import React, { useEffect, useRef } from 'react';
import { JSONContent, generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TiptapYoutube from '@tiptap/extension-youtube';
import { Video as CustomVideo } from '@/lib/tiptap-video';
import { BlogImage } from '@/lib/tiptap-image';

type BlogContent = JSONContent | string | null;

interface BlogPostContentProps {
  content: BlogContent;
  contentUnavailableText: string;
}

export function BlogPostContent({ content, contentUnavailableText }: BlogPostContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Attach a single click handler for all links inside the content,
  // so nothing higher in the DOM tree can swallow the click.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      // Let middle-click / modifier clicks behave normally
      if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      event.preventDefault();
      const href = anchor.href;

      // External links → open in new tab, internal links → same tab
      if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, []);

  if (!content) {
    return <p className="text-slate-500 italic">{contentUnavailableText}</p>;
  }

  // Normalize to an HTML string (either existing HTML or generated from TipTap JSON)
  let html: string;

  if (typeof content === 'string') {
    html = content;
  } else {
    html = generateHTML(content as JSONContent, [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapLink.configure({ openOnClick: true }),
      BlogImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TiptapYoutube.configure({ controls: false, nocookie: true }),
      CustomVideo,
    ]);
  }

  return (
    <div
      ref={containerRef}
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
