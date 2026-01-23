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
  if (!position || !editor) return null;

  const handleButtonClick = (command: string, value?: string) => {
    // Ensure editor has focus before executing command
    if (editor && !editor.isFocused) {
      editor.chain().focus().run();
    }
    // Small delay to ensure focus is set
    setTimeout(() => {
      onCommand(command, value);
    }, 0);
  };

  const handleLinkClick = () => {
    if (editor && !editor.isFocused) {
      editor.chain().focus().run();
    }
    setTimeout(() => {
      onLink();
    }, 0);
  };

  return (
    <div
      className="absolute z-30 flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ToolbarButton
        onClick={() => handleButtonClick('bold')}
        icon={Bold}
        title="Bold"
        active={!!editor?.isActive('bold')}
      />
      <ToolbarButton
        onClick={() => handleButtonClick('italic')}
        icon={Italic}
        title="Italic"
        active={!!editor?.isActive('italic')}
      />
      <div className="h-5 w-px bg-slate-200 mx-1" />
      {['P', 'H1', 'H2', 'H3'].map((tag) => {
        const isActive = tag === 'P' 
          ? editor?.isActive('paragraph')
          : editor?.isActive('heading', { level: parseInt(tag.slice(1)) as 1 | 2 | 3 });
        
        return (
          <button
            key={tag}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleButtonClick('formatBlock', tag);
            }}
            className={cn(
              "h-7 px-2 rounded text-xs font-semibold transition-colors",
              isActive
                ? "bg-slate-200 text-slate-900"
                : "text-slate-700 hover:bg-slate-100"
            )}
            title={tag === 'P' ? 'Paragraph' : `Heading ${tag.slice(1)}`}
          >
            {tag}
          </button>
        );
      })}
      <div className="h-5 w-px bg-slate-200 mx-1" />
      <ToolbarButton
        onClick={() => handleButtonClick('formatBlock', 'blockquote')}
        icon={Quote}
        title="Blockquote"
        active={!!editor?.isActive('blockquote')}
      />
      <ToolbarButton 
        onClick={handleLinkClick} 
        icon={LinkIcon} 
        title="Link" 
        active={!!editor?.isActive('link')} 
      />
    </div>
  );
}
