'use client';

import { useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type { EditorInstance, SelectedNode } from '../types/types';

interface UseSelectionToolbarProps {
  editor: EditorInstance;
  editorContainerRef: RefObject<HTMLDivElement | null>;
}

export function useSelectionToolbar({ editor, editorContainerRef }: UseSelectionToolbarProps) {
  const [selectionToolbar, setSelectionToolbar] = useState<{ top: number; left: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedNode | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<SelectedNode | null>(null);

  const handleSelectionUpdate = useCallback(() => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const node = editor.state.doc.nodeAt(from);
    
    if (node?.type.name === 'image') {
      setSelectedImage({ node, pos: from });
      setSelectedVideo(null);
      setSelectionToolbar(null);
      return;
    }
    
    if (node?.type.name === 'youtube' || node?.type.name === 'video') {
      setSelectedVideo({ node, pos: from });
      setSelectedImage(null);
      setSelectionToolbar(null);
      return;
    }
    
    setSelectedImage(null);
    setSelectedVideo(null);

    if (from !== to && editorContainerRef.current) {
      try {
        const containerRect = editorContainerRef.current.getBoundingClientRect();
        const start = editor.view.coordsAtPos(from);
        const end = editor.view.coordsAtPos(to);
        const top = Math.max(start.bottom, end.bottom) - containerRect.top + 8;
        const left = (start.left + end.right) / 2 - containerRect.left;
        setSelectionToolbar({ top, left });
      } catch {
        setSelectionToolbar(null);
      }
    } else {
      setSelectionToolbar(null);
    }
  }, [editor, editorContainerRef]);

  const getMediaToolbarPosition = useCallback(() => {
    if (!selectedImage && !selectedVideo || !editorContainerRef.current) return null;
    
    const selectedEl = editorContainerRef.current?.querySelector('.ProseMirror-selectednode') as HTMLElement;
    if (!selectedEl) return null;
    
    const containerRect = editorContainerRef.current?.getBoundingClientRect();
    const rect = selectedEl.getBoundingClientRect();
    if (!containerRect) return null;

    const top = rect.bottom - containerRect.top + 8;
    const left = rect.left - containerRect.left + rect.width / 2;
    
    return { top, left };
  }, [selectedImage, selectedVideo, editorContainerRef]);

  const getResizeHandlesPosition = useCallback(() => {
    if (!selectedImage && !selectedVideo || !editorContainerRef.current) return null;
    
    const selectedEl = editorContainerRef.current?.querySelector('.ProseMirror-selectednode') as HTMLElement;
    if (!selectedEl) return null;
    
    const containerRect = editorContainerRef.current?.getBoundingClientRect();
    const rect = selectedEl.getBoundingClientRect();
    if (!containerRect || !rect) return null;

    return {
      containerRect,
      selectedRect: rect,
    };
  }, [selectedImage, selectedVideo, editorContainerRef]);

  return {
    selectionToolbar,
    selectedImage,
    selectedVideo,
    handleSelectionUpdate,
    getMediaToolbarPosition,
    getResizeHandlesPosition,
  };
}
