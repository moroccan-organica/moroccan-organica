'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CodeModePanelProps {
  isFullscreen: boolean;
  codeHtml: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function CodeModePanel({ isFullscreen, codeHtml, onChange }: CodeModePanelProps) {
  return (
    <textarea
      value={codeHtml}
      onChange={onChange}
      className={cn(
        'w-full h-full p-4 font-mono text-sm bg-slate-50 border-none outline-none resize-none',
        isFullscreen ? 'min-h-[calc(100vh-200px)]' : 'min-h-[350px]'
      )}
      placeholder="Paste your HTML code here..."
      spellCheck={false}
    />
  );
}
