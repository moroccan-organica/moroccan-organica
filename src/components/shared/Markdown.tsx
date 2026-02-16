
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownProps {
    content: string;
    className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
    return (
        <div className={cn('prose prose-slate max-w-none', className)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
