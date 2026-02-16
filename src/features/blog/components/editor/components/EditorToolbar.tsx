'use client';

import React from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockType } from '../types/types';

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({ onClick, icon: Icon, title, active, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded transition-colors',
        active
          ? 'bg-slate-200 text-slate-900'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-600'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

const BLOCK_OPTIONS: { value: BlockType; label: string }[] = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' },
  { value: 'pre', label: 'Preformatted' },
];

export interface EditorToolbarProps {
  blockType: BlockType;
  onBlockChange: (block: BlockType) => void;
  onCommand: (command: string, value?: string) => void;
  onLink: () => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
  editor: any;
}

export function EditorToolbar({
  blockType,
  onBlockChange,
  onCommand,
  onLink,
  onFullscreenToggle,
  isFullscreen,
  editor,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-2 py-1.5">
      <select
        value={blockType}
        onChange={(e) => onBlockChange(e.target.value as BlockType)}
        className="h-7 rounded border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#606C38]"
      >
        {BLOCK_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="h-5 w-px bg-slate-300 mx-1" />

      <ToolbarButton onClick={() => onCommand('bold')} icon={Bold} title="Bold (Ctrl+B)" active={editor?.isActive('bold')} />
      <ToolbarButton onClick={() => onCommand('italic')} icon={Italic} title="Italic (Ctrl+I)" active={editor?.isActive('italic')} />

      <div className="h-5 w-px bg-slate-300 mx-1" />

      <ToolbarButton onClick={() => onCommand('insertUnorderedList')} icon={List} title="Bullet List" active={editor?.isActive('bulletList')} />
      <ToolbarButton onClick={() => onCommand('insertOrderedList')} icon={ListOrdered} title="Ordered List" active={editor?.isActive('orderedList')} />

      <div className="h-5 w-px bg-slate-300 mx-1" />

      <ToolbarButton onClick={() => onCommand('formatBlock', 'blockquote')} icon={Quote} title="Blockquote" active={editor?.isActive('blockquote')} />

      <div className="h-5 w-px bg-slate-300 mx-1" />

      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        icon={AlignLeft}
        title="Align Left"
        active={!!editor?.isActive({ textAlign: 'left' })}
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        icon={AlignCenter}
        title="Center"
        active={!!editor?.isActive({ textAlign: 'center' })}
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        icon={AlignRight}
        title="Align Right"
        active={!!editor?.isActive({ textAlign: 'right' })}
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
        icon={AlignJustify}
        title="Justify"
        active={!!editor?.isActive({ textAlign: 'justify' })}
      />

      <div className="h-5 w-px bg-slate-300 mx-1" />

      <ToolbarButton onClick={onLink} icon={LinkIcon} title="Insert Link" active={editor?.isActive('link')} />

      <div className="ml-auto">
        <ToolbarButton
          onClick={onFullscreenToggle}
          icon={Maximize2}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        />
      </div>
    </div>
  );
}
