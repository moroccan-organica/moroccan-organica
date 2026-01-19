'use client';

import React from 'react';
import { X, Pencil, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectedNode } from '../types/types';

export interface MediaNodeToolbarProps {
  selectedImage: SelectedNode | null;
  selectedVideo: SelectedNode | null;
  onImageAlign: (align: 'left' | 'center' | 'right') => void;
  onImageReplace: () => void;
  onImageDelete: () => void;
  position?: { top: number; left: number };
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  className?: string;
}

function ToolbarButton({ onClick, icon: Icon, title, className }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 text-slate-600",
        className
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function MediaNodeToolbar({
  selectedImage,
  selectedVideo,
  onImageAlign,
  onImageReplace,
  onImageDelete,
  position,
}: MediaNodeToolbarProps) {
  if (!selectedImage && !selectedVideo) return null;

  return (
    <div
      className="absolute z-20 flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
      style={{
        ...(position && {
          top: `${position.top}px`,
          left: `${position.left}px`,
        }),
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {(selectedImage || selectedVideo) && (
        <>
          <ToolbarButton
            onClick={() => onImageAlign('left')}
            icon={AlignLeft}
            title={selectedVideo ? 'Align video left' : "Align left"}
          />
          <ToolbarButton
            onClick={() => onImageAlign('center')}
            icon={AlignCenter}
            title={selectedVideo ? 'Center video' : "Center"}
          />
          <ToolbarButton
            onClick={() => onImageAlign('right')}
            icon={AlignRight}
            title={selectedVideo ? 'Align video right' : "Align right"}
          />
          <div className="h-5 w-px bg-slate-200 mx-1" />
        </>
      )}
      <ToolbarButton
        onClick={onImageReplace}
        icon={Pencil}
        title={selectedVideo ? 'Replace video' : "Replace image"}
      />
      <ToolbarButton
        onClick={onImageDelete}
        icon={X}
        title={selectedVideo ? 'Delete video' : "Delete image"}
        className="hover:bg-red-100 text-red-600"
      />
    </div>
  );
}
