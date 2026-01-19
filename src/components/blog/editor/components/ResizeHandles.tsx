'use client';

import React from 'react';
import { SelectedNode } from '../types/types';

export interface ResizeHandlesProps {
  selectedImage: SelectedNode | null;
  selectedVideo: SelectedNode | null;
  isResizing: boolean;
  imageSize: { width: number; height: number } | null;
  onResizeStart: (e: React.MouseEvent, corner: string) => void;
  containerRect: DOMRect;
  selectedRect: DOMRect;
}

export function ResizeHandles({
  selectedImage,
  selectedVideo,
  isResizing,
  imageSize,
  onResizeStart,
  containerRect,
  selectedRect,
}: ResizeHandlesProps) {
  if (!selectedImage && !selectedVideo) return null;

  const top = selectedRect.top - containerRect.top;
  const left = selectedRect.left - containerRect.left;
  const width = isResizing && imageSize ? imageSize.width : selectedRect.width;
  const height = isResizing && imageSize ? imageSize.height : selectedRect.height;

  if (!Number.isFinite(top) || !Number.isFinite(left) || !Number.isFinite(width) || !Number.isFinite(height)) {
    return null;
  }

  return (
    <>
      <div
        className="absolute z-20 w-3 h-3 bg-[#606C38] border-2 border-white rounded-sm cursor-nw-resize shadow-sm"
        style={{ top: top - 6, left: left - 6 }}
        onMouseDown={(e) => onResizeStart(e, 'nw')}
      />
      <div
        className="absolute z-20 w-3 h-3 bg-[#606C38] border-2 border-white rounded-sm cursor-ne-resize shadow-sm"
        style={{ top: top - 6, left: left + width - 6 }}
        onMouseDown={(e) => onResizeStart(e, 'ne')}
      />
      <div
        className="absolute z-20 w-3 h-3 bg-[#606C38] border-2 border-white rounded-sm cursor-sw-resize shadow-sm"
        style={{ top: top + height - 6, left: left - 6 }}
        onMouseDown={(e) => onResizeStart(e, 'sw')}
      />
      <div
        className="absolute z-20 w-3 h-3 bg-[#606C38] border-2 border-white rounded-sm cursor-se-resize shadow-sm"
        style={{ top: top + height - 6, left: left + width - 6 }}
        onMouseDown={(e) => onResizeStart(e, 'se')}
      />
    </>
  );
}
