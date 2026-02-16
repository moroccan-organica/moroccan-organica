'use client';

import React from 'react';
import { EditorContent } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { SelectionBubble } from './SelectionBubble';
import { MediaNodeToolbar } from './MediaNodeToolbar';
import { ResizeHandles } from './ResizeHandles';
import type { EditorInstance, ResizeHandlesPosition, SelectedNode } from '../types/types';

export interface EditorCanvasProps {
  editor: EditorInstance;
  isFullscreen: boolean;
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  selectionToolbar: { top: number; left: number } | null;
  selectedImage: SelectedNode | null;
  selectedVideo: SelectedNode | null;
  isResizing: boolean;
  imageSize: { width: number; height: number } | null;
  resizePosition: ResizeHandlesPosition | null;
  handleCommand: (command: string, value?: string) => void;
  handleLink: () => void;
  handleImageAlign: (align: 'left' | 'center' | 'right') => void;
  handleImageReplace: () => void;
  handleImageDelete: () => void;
  handleResizeStart: (e: React.MouseEvent, corner: string) => void;
  getNodeResizePosition: () => ResizeHandlesPosition | null;
}

function MediaToolbar({ 
  editorContainerRef, 
  selectedImage, 
  selectedVideo, 
  isResizing, 
  handleImageAlign, 
  handleImageReplace, 
  handleImageDelete 
}: {
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  selectedImage: SelectedNode | null;
  selectedVideo: SelectedNode | null;
  isResizing: boolean;
  handleImageAlign: (align: 'left' | 'center' | 'right') => void;
  handleImageReplace: () => void;
  handleImageDelete: () => void;
}) {
  const [pos, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if ((selectedImage || selectedVideo) && !isResizing && editorContainerRef.current) {
      const selectedEl = editorContainerRef.current.querySelector('.ProseMirror-selectednode') as HTMLElement;
      if (selectedEl) {
        const containerRect = editorContainerRef.current.getBoundingClientRect();
        const rect = selectedEl.getBoundingClientRect();
        setPosition({
          top: rect.bottom - containerRect.top + 8,
          left: rect.left - containerRect.left + rect.width / 2,
        });
      } else {
        setPosition(null);
      }
    } else {
      setPosition(null);
    }
  }, [selectedImage, selectedVideo, isResizing, editorContainerRef]);

  if (!pos) return null;

  return (
    <MediaNodeToolbar
      selectedImage={selectedImage}
      selectedVideo={selectedVideo}
      onImageAlign={handleImageAlign}
      onImageReplace={handleImageReplace}
      onImageDelete={handleImageDelete}
      position={pos}
    />
  );
}

export function EditorCanvas({
  editor,
  isFullscreen,
  editorContainerRef,
  selectionToolbar,
  selectedImage,
  selectedVideo,
  isResizing,
  imageSize,
  resizePosition,
  handleCommand,
  handleLink,
  handleImageAlign,
  handleImageReplace,
  handleImageDelete,
  handleResizeStart,
  getNodeResizePosition,
}: EditorCanvasProps) {
  return (
    <div
      className={cn(
        'prose prose-slate max-w-none relative',
        isFullscreen ? 'min-h-[calc(100vh-200px)]' : 'min-h-[350px]'
      )}
    >
      <EditorContent editor={editor} />

      {/* Selection Toolbar */}
      <SelectionBubble
        position={selectionToolbar}
        onCommand={handleCommand}
        onLink={handleLink}
        editor={editor}
      />

      {/* Image/Video Toolbar */}
      <MediaToolbar 
        editorContainerRef={editorContainerRef}
        selectedImage={selectedImage}
        selectedVideo={selectedVideo}
        isResizing={isResizing}
        handleImageAlign={handleImageAlign}
        handleImageReplace={handleImageReplace}
        handleImageDelete={handleImageDelete}
      />

      {/* Image Size Display during resize */}
      {isResizing && imageSize && (
        <div className="absolute z-30 top-2 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          {imageSize.width} × {imageSize.height}
        </div>
      )}

      {/* Resize Handles */}
      {(selectedImage || selectedVideo) && resizePosition && (() => {
        const resizeHandlesPos = getNodeResizePosition();
        if (!resizeHandlesPos) return null;

        return (
          <ResizeHandles
            selectedImage={selectedImage}
            selectedVideo={selectedVideo}
            isResizing={isResizing}
            imageSize={imageSize}
            onResizeStart={handleResizeStart}
            containerRect={resizePosition.containerRect}
            selectedRect={resizePosition.selectedRect}
          />
        );
      })()}
    </div>
  );
}
