'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CodeEditorProps {
  isFullscreen: boolean;
  codeHtml: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function CodeEditor({ isFullscreen, codeHtml, onChange }: CodeEditorProps) {
  return (
    <textarea
      className={cn(
        'w-full p-4 font-mono text-sm text-slate-700 focus:outline-none resize-none',
        isFullscreen ? 'min-h-[calc(100vh-200px)]' : 'min-h-[350px]'
      )}
      onChange={onChange}
      placeholder="<p>Write your HTML here...</p>"
      value={codeHtml}
    />
  );
}
