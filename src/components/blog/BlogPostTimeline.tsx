'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { JSONContent } from '@tiptap/core';

export interface TimelineItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPostTimelineProps {
  content: JSONContent | null;
  className?: string;
  recommendedTitle?: string;
}

function extractHeadings(content: JSONContent | null): TimelineItem[] {
  if (!content) return [];

  const headings: TimelineItem[] = [];
  const idCounts: Record<string, number> = {};

  function traverse(node: JSONContent) {
    if (node.type === 'heading' && node.attrs?.level) {
      const level = node.attrs.level as number;
      const text = extractText(node);
      if (text) {
        const baseId = generateId(text);
        idCounts[baseId] = (idCounts[baseId] || 0) + 1;
        const id = idCounts[baseId] === 1 ? baseId : `${baseId}-${idCounts[baseId]}`;
        headings.push({ id, text, level });
      }
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  traverse(content);
  return headings;
}

function extractText(node: JSONContent): string {
  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractText).join('');
  }

  return '';
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function BlogPostTimeline({ 
  content, 
  className,
  recommendedTitle 
}: BlogPostTimelineProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const setupObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (intersecting.length > 0) {
            setActiveId(intersecting[0].target.id);
          }
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        }
      );

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    };

    const timeout = setTimeout(setupObserver, 500);
    return () => clearTimeout(timeout);
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  const mainHeadings = headings.filter((h) => h.level <= 3);

  return (
    <aside
      className={cn(
        'hidden xl:block w-64 shrink-0 sticky top-32 self-start',
        className
      )}
    >
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Table of Contents
        </h3>

        <div className="space-y-4">
          {mainHeadings.map((heading, idx) => {
            const isActive = activeId === heading.id;
            const number = String(idx + 1).padStart(2, '0');

            return (
              <button
                key={heading.id}
                onClick={() => scrollToSection(heading.id)}
                className="w-full text-left group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={cn(
                      'text-[10px] font-bold transition-colors duration-300',
                      isActive ? 'text-[#BC6C25]' : 'text-slate-300'
                    )}
                  >
                    {number}
                  </span>
                  <div
                    className={cn(
                      'flex-1 h-px transition-all duration-300',
                      isActive ? 'bg-[#BC6C25]' : 'bg-slate-100 group-hover:bg-slate-200'
                    )}
                  />
                </div>

                <span
                  className={cn(
                    'text-xs font-medium transition-all duration-300 line-clamp-2',
                    isActive
                      ? 'text-[#606C38] translate-x-1'
                      : 'text-slate-500 group-hover:text-slate-900'
                  )}
                >
                  {heading.text}
                </span>
              </button>
            );
          })}
        </div>

        {recommendedTitle && (
          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recommended
            </p>
            <p className="text-sm font-bold text-[#BC6C25] leading-tight">
              {recommendedTitle}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
