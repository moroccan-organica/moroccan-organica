'use client';

import React from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EditorHeaderProps {
  onInsertImage: () => void;
  mode: 'visual' | 'code';
  onModeChange: (mode: 'visual' | 'code') => void;
  codeHtml: string;
  editor: any;
}

export function EditorHeader({
  onInsertImage,
  mode,
  onModeChange,
  codeHtml,
  editor,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-[#606C38] border-[#606C38]/30 hover:bg-[#606C38]/10"
          onClick={onInsertImage}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Add Media</span>
        </Button>
      </div>
      <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
        <button
          type="button"
          onClick={() => {
            if (editor && mode === 'code') {
              editor.commands.setContent(codeHtml || '', { emitUpdate: true });
            }
            onModeChange('visual');
          }}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded transition-colors',
            mode === 'visual'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          Visual
        </button>
        <button
          type="button"
          onClick={() => {
            if (editor) onModeChange('code');
          }}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded transition-colors',
            mode === 'code'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          Code
        </button>
      </div>
    </div>
  );
}
