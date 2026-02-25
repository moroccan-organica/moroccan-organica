import React from 'react';
import { JSONContent } from '@tiptap/core';
import Image from 'next/image';

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

  // Render inline content with marks (bold, italic, link, etc.)
  const renderInlineContent = (content: JSONContent[], parentIndex: number): React.ReactNode[] => {
    return content.map((node, idx) => {
      const key = `${parentIndex}-${idx}`;

      if (node.type === 'text') {
        let textNode: React.ReactNode = node.text || '';

        const marks = Array.isArray(node.marks) ? node.marks : [];
        const linkMark = marks.find((mark) => mark.type === 'link' && mark.attrs?.href);
        const otherMarks = marks.filter((mark) => mark.type !== 'link');

        otherMarks.forEach((mark) => {
          if (mark.type === 'bold') {
            textNode = <strong key={`strong-${key}`}>{textNode}</strong>;
          } else if (mark.type === 'italic') {
            textNode = <em key={`em-${key}`}>{textNode}</em>;
          }
        });

        if (linkMark && linkMark.attrs?.href) {
          const href = linkMark.attrs.href;
          const target = linkMark.attrs.target || '_self';
          textNode = (
            <a
              key={`link-${key}`}
              href={href}
              className="text-[#BC6C25] underline decoration-1 hover:decoration-2"
              target={target}
              rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {textNode}
            </a>
          );
        }

        return <React.Fragment key={key}>{textNode}</React.Fragment>;
      }

      if (node.type === 'hardBreak') {
        return <br key={`br-${key}`} />;
      }

      // Handle nested inline nodes (like link with bold inside)
      if (node.type === 'link' && node.attrs?.href) {
        const linkContent = node.content ? renderInlineContent(node.content, Number(key)) : [];
        const href = node.attrs.href as string;
        const target = (node.attrs.target as string) || '_self';
        return (
          <a
            key={`link-node-${key}`}
            href={href}
            className="text-[#BC6C25] underline decoration-1 hover:decoration-2"
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          >
            {linkContent}
          </a>
        );
      }

      // Recursively render other inline nodes
      if (node.content && Array.isArray(node.content)) {
        return (
          <React.Fragment key={key}>
            {renderInlineContent(node.content, Number(key))}
          </React.Fragment>
        );
      }

      return null;
    });
  };

  const renderNode = (node: JSONContent, index: number): React.ReactNode => {
    if (node.type === 'heading' && node.attrs?.level) {
      const tag = `h${node.attrs.level}` as keyof HTMLElementTagNameMap;
      const text = extractText(node);
      const id = nextId(text);
      const headingContent = node.content ? renderInlineContent(node.content, index) : text;

      return React.createElement(
        tag,
        {
          key: `${id}-${index}`,
          id,
          className: 'scroll-mt-32',
        },
        headingContent,
      );
    }

    if (node.type === 'paragraph') {
      // Check if paragraph has content (text or inline nodes)
      if (node.content && Array.isArray(node.content) && node.content.length > 0) {
        // Render paragraph with inline content
        return (
          <p key={`p-${index}`}>
            {renderInlineContent(node.content, index)}
          </p>
        );
      }
      // Empty paragraph
      return (
        <p key={`p-${index}`} className="mb-4 leading-relaxed">
          &nbsp;
        </p>
      );
    }

    if (node.type === 'image' && node.attrs?.src) {
      const src = node.attrs.src as string;
      const alt = (node.attrs.alt as string) || '';
      const title = (node.attrs.title as string) || '';
      const width = node.attrs.width ? Number(node.attrs.width) : undefined;
      const height = node.attrs.height ? Number(node.attrs.height) : undefined;
      const style = node.attrs.style as string | undefined;

      // Parse inline styles
      const parsedStyle: React.CSSProperties & Record<string, string | number | undefined> = { maxWidth: '100%', height: 'auto' };
      if (style) {
        style.split(';').forEach(rule => {
          const [key, value] = rule.split(':').map(s => s.trim());
          if (key && value) {
            const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            parsedStyle[camelKey] = value;
          }
        });
      }

      // Handle blob URLs and data URLs with regular img tag
      if (src.startsWith('blob:') || src.startsWith('data:')) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`img-${index}`}
            src={src}
            alt={alt}
            title={title}
            width={width}
            height={height}
            style={parsedStyle}
            className="my-8 rounded-2xl w-full h-auto"
          />
        );
      }

      // For local paths (starting with /), use regular img tag for better compatibility
      // For external URLs, use Next.js Image
      if (src.startsWith('/')) {
        return (
          <div key={`img-wrapper-${index}`} className="my-8 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              title={title}
              width={width}
              height={height}
              style={parsedStyle}
              className="rounded-2xl w-full h-auto"
            />
            {title && (
              <p className="text-sm text-slate-500 text-center mt-2 italic">{title}</p>
            )}
          </div>
        );
      }

      // Use Next.js Image for external URLs
      return (
        <div key={`img-wrapper-${index}`} className="my-8 w-full">
          <div className="relative w-full" style={{ aspectRatio: width && height ? `${width}/${height}` : undefined, minHeight: '200px' }}>
            <Image
              src={src}
              alt={alt}
              fill={!width || !height}
              width={width}
              height={height}
              className="rounded-2xl object-contain"
              style={parsedStyle}
              unoptimized={src.startsWith('http://localhost')}
            />
          </div>
          {title && (
            <p className="text-sm text-slate-500 text-center mt-2 italic">{title}</p>
          )}
        </div>
      );
    }

    if (node.type === 'bulletList' || node.type === 'orderedList') {
      const Tag = node.type === 'orderedList' ? 'ol' : 'ul';
      const className = node.type === 'orderedList'
        ? 'list-decimal list-inside mb-4 space-y-2 ml-4'
        : 'list-disc list-inside mb-4 space-y-2 ml-4';

      return (
        <Tag key={`${node.type}-${index}`} className={className}>
          {node.content?.map((child, childIdx) => renderNode(child, Number(`${index}${childIdx}`)))}
        </Tag>
      );
    }

    if (node.type === 'listItem') {
      return (
        <li key={`li-${index}`} className="mb-2">
          {node.content?.map((child, childIdx) => {
            // List items can contain paragraphs or direct inline content
            if (child.type === 'paragraph' && child.content) {
              return (
                <React.Fragment key={`li-p-${index}-${childIdx}`}>
                  {renderInlineContent(child.content, Number(`${index}${childIdx}`))}
                </React.Fragment>
              );
            }
            return renderNode(child, Number(`${index}${childIdx}`));
          })}
        </li>
      );
    }

    if (node.type === 'blockquote') {
      return (
        <blockquote key={`blockquote-${index}`} className="border-l-4 border-[#606C38] pl-6 py-2 my-6 italic text-slate-600">
          {node.content?.map((child, childIdx) => {
            // Blockquotes can contain paragraphs with formatted content
            if (child.type === 'paragraph' && child.content) {
              return (
                <p key={`bq-p-${index}-${childIdx}`} className="mb-2">
                  {renderInlineContent(child.content, Number(`${index}${childIdx}`))}
                </p>
              );
            }
            return renderNode(child, Number(`${index}${childIdx}`));
          })}
        </blockquote>
      );
    }

    if (node.content && Array.isArray(node.content)) {
      return (
        <React.Fragment key={`fragment-${index}`}>
          {node.content.map((child, childIdx) => renderNode(child, Number(`${index}${childIdx}`)))}
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <div className="rich-text-content">
      {/* Fallback rendering for mock content with anchorable headings */}
      {content.content?.map((node, idx) => renderNode(node, idx))}
    </div>
  );
}
