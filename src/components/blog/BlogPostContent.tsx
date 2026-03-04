'use client';

import React from 'react';
import { JSONContent, generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TiptapYoutube from '@tiptap/extension-youtube';
import { Video as CustomVideo } from '@/lib/tiptap-video';
import { BlogImage } from '@/lib/tiptap-image';

import { CustomLink } from '@/lib/blog/tiptap-extensions';

import { HtmlContent } from '@/components/common/HtmlContent';

type BlogContent = JSONContent | string | null;

interface BlogPostContentProps {
  content: BlogContent;
  contentUnavailableText: string;
}

export function BlogPostContent({ content, contentUnavailableText }: BlogPostContentProps) {
  if (!content) {
    return <p className="text-slate-500 italic">{contentUnavailableText}</p>;
  }

  // Normalize to an HTML string (either existing HTML or generated from TipTap JSON)
  let html: string;

  if (typeof content === 'string' && !content.trim().startsWith('{')) {
    html = content;
  } else {
    try {
      const json = typeof content === 'string' ? JSON.parse(content) : content;
      html = generateHTML(json as JSONContent, [
        StarterKit,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        CustomLink.configure({
          openOnClick: true,
          validate: href => !!href,
        }),
        BlogImage.configure({
          HTMLAttributes: {
            class: 'editor-image',
          },
        }),
        TiptapYoutube.configure({ controls: false, nocookie: true }),
        CustomVideo,
      ]);
    } catch (e) {
      html = typeof content === 'string' ? content : '';
    }
  }

  return (
    <HtmlContent
      html={html}
      className="rich-text-content"
    />
  );
}
