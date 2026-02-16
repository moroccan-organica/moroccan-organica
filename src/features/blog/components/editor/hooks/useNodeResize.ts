'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { EditorInstance, SelectedNode } from '../types/types';

function sanitizeStyle(style: unknown): string {
  return typeof style === 'string' ? style : '';
}

function stripCssProps(style: string, props: string[]): string {
  let next = style;
  for (const prop of props) {
    const re = new RegExp(`${prop}\\s*:\\s*[^;]+;?`, 'gi');
    next = next.replace(re, '');
  }
  return next.replace(/;{2,}/g, ';').trim();
}

interface UseNodeResizeProps {
  editor: EditorInstance;
  selectedImage: SelectedNode | null;
  selectedVideo: SelectedNode | null;
  containerRect: DOMRect;
  selectedRect: DOMRect;
}

export function useNodeResize({ 
  editor, 
  selectedImage, 
  selectedVideo, 
  containerRect, 
  selectedRect 
}: UseNodeResizeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const resizeStartRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
    corner: string;
    pos: number;
    nodeType: 'image' | 'video' | 'youtube';
    isImage: boolean;
    existingStyle: string;
  } | null>(null);
  const latestSizeRef = useRef<{ width: number; height: number } | null>(null);

  const handleResizeStart = useCallback((e: ReactMouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedImage && !selectedVideo) return;

    const pos = selectedImage?.pos ?? selectedVideo?.pos;
    if (pos == null) return;

    const nodeType: 'image' | 'video' | 'youtube' = selectedImage
      ? 'image'
      : selectedVideo?.node?.type?.name === 'youtube'
        ? 'youtube'
        : 'video';
    const isImage = nodeType === 'image';
    const existingStyle = sanitizeStyle((selectedImage || selectedVideo)?.node?.attrs?.style);
    
    setIsResizing(true);
    const width = selectedRect.width;
    const height = selectedRect.height;
    
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height,
      corner,
      pos,
      nodeType,
      isImage,
      existingStyle,
    };

    const initialSize = { width: Math.round(width), height: Math.round(height) };
    latestSizeRef.current = initialSize;
    setImageSize(initialSize);
  }, [selectedImage, selectedVideo, selectedRect]);

  useEffect(() => {
    if (!isResizing || !resizeStartRef.current || !editor) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      
      const { x: startX, y: startY, width: startWidth, height: startHeight, corner } = resizeStartRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (corner.includes('e')) {
        newWidth = Math.max(50, startWidth + deltaX);
      } else if (corner.includes('w')) {
        newWidth = Math.max(50, startWidth - deltaX);
      }
      
      if (corner.includes('s')) {
        newHeight = Math.max(50, startHeight + deltaY);
      } else if (corner.includes('n')) {
        newHeight = Math.max(50, startHeight - deltaY);
      }
      
      const next = { width: Math.round(newWidth), height: Math.round(newHeight) };
      latestSizeRef.current = next;
      setImageSize(next);
    };

    const handleMouseUp = () => {
      if (!isResizing || !resizeStartRef.current || !editor) {
        setIsResizing(false);
        return;
      }

      const { width: newWidth, height: newHeight } = latestSizeRef.current || {};
      if (newWidth && newHeight) {
        const { pos, nodeType, isImage, existingStyle } = resizeStartRef.current;
        const baseStyle = stripCssProps(existingStyle, ['width', 'height']);
        const sizeStyle = `width: ${newWidth}px; height: ${newHeight}px;`;
        const mergedStyle = `${sizeStyle} ${baseStyle}`.trim();

        editor.chain().focus().setNodeSelection(pos).updateAttributes(
          nodeType,
          {
            width: newWidth,
            height: newHeight,
            ...(isImage ? { style: mergedStyle } : {}),
          }
        ).run();
      }
      
      setIsResizing(false);
      setImageSize(null);
      resizeStartRef.current = null;
      latestSizeRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, editor]);

  const getResizeHandlesPosition = useCallback(() => {
    if (!containerRect || !selectedRect) return null;
    
    return {
      containerRect,
      selectedRect,
    };
  }, [containerRect, selectedRect]);

  return {
    isResizing,
    imageSize,
    handleResizeStart,
    getResizeHandlesPosition,
  };
}
