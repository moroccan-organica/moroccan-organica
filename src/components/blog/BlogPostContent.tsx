import React from 'react';
import { JSONContent } from '@tiptap/core';

interface BlogPostContentProps {
  content: JSONContent | null;
  contentUnavailableText: string;
}

export function BlogPostContent({ content, contentUnavailableText }: BlogPostContentProps) {
  // Simple mock implementation for now until Tiptap is set up
  // In a real scenario, we'd use generateHTML or a custom renderer
  
  if (!content) {
    return <p className="text-slate-500 italic">{contentUnavailableText}</p>;
  }

  const counts: Record<string, number> = {};

  const extractText = (node: JSONContent): string => {
    if (node.type === 'text') return node.text || '';
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('');
    }
    return '';
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const nextId = (text: string) => {
    const base = slugify(text);
    counts[base] = (counts[base] || 0) + 1;
    return counts[base] === 1 ? base : `${base}-${counts[base]}`;
  };

  const renderNode = (node: JSONContent, index: number): React.ReactNode => {
    if (node.type === 'heading' && node.attrs?.level) {
      const tag = `h${node.attrs.level}` as keyof HTMLElementTagNameMap;
      const text = extractText(node);
      const id = nextId(text);
      return React.createElement(
        tag,
        {
          key: `${id}-${index}`,
          id,
          className: 'mt-8 mb-4 scroll-mt-32',
        },
        text,
      );
    }

    if (node.type === 'paragraph') {
      const text = extractText(node);
      return (
        <p key={`p-${index}`} className="mb-4 leading-relaxed">
          {text}
        </p>
      );
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map((child, childIdx) => renderNode(child, Number(`${index}${childIdx}`)));
    }

    return null;
  };

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-p:text-slate-700 prose-a:text-[#BC6C25] prose-img:rounded-2xl">
      {/* Fallback rendering for mock content with anchorable headings */}
      {content.content?.map((node, idx) => renderNode(node, idx))}
    </div>
  );
}
