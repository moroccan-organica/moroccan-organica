'use client';

import React from 'react';
import { Bold, Italic, Quote, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectionBubbleProps {
  position: { top: number; left: number } | null;
  onCommand: (command: string, value?: string) => void;
  onLink: () => void;
  editor: any;
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  active?: boolean;
}

function ToolbarButton({ onClick, icon: Icon, title, active }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded transition-colors',
        active
          ? 'bg-slate-200 text-slate-900'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function SelectionBubble({ position, onCommand, onLink, editor }: SelectionBubbleProps) {
  if (!position) return null;

  return (
    <div
      className="absolute z-30 flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ToolbarButton
        onClick={() => onCommand('bold')}
        icon={Bold}
        title="Bold"
        active={!!editor?.isActive('bold')}
      />
      <ToolbarButton
        onClick={() => onCommand('italic')}
        icon={Italic}
        title="Italic"
        active={!!editor?.isActive('italic')}
      />
      <div className="h-5 w-px bg-slate-200 mx-1" />
      {['P', 'H1', 'H2', 'H3'].map((tag) => (
        <button
          key={tag}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => onCommand('formatBlock', tag)}
          className={cn(
            "h-7 px-2 rounded text-xs font-semibold transition-colors",
            editor?.isActive('heading', { level: parseInt(tag.slice(1)) }) || (tag === 'P' && editor?.isActive('paragraph'))
              ? "bg-slate-200 text-slate-900"
              : "text-slate-700 hover:bg-slate-100"
          )}
          title={tag === 'P' ? 'Paragraph' : `Heading ${tag.slice(1)}`}
        >
          {tag}
        </button>
      ))}
      <div className="h-5 w-px bg-slate-200 mx-1" />
      <ToolbarButton
        onClick={() => onCommand('formatBlock', 'blockquote')}
        icon={Quote}
        title="Blockquote"
        active={!!editor?.isActive('blockquote')}
      />
      <ToolbarButton onClick={onLink} icon={LinkIcon} title="Link" active={!!editor?.isActive('link')} />
    </div>
  );
}
