'use client';

import { useState, useCallback } from 'react';
import type { BlogPostMedia } from '@/types/blog';

interface UseBlogMediaManagerProps {
  postId?: string;
  onMediaSelect?: (media: BlogPostMedia) => void;
}

// Mock version for now as we don't have backend hooks yet
export function useBlogMediaManager({ postId, onMediaSelect }: UseBlogMediaManagerProps) {
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  
  const mediaItems: BlogPostMedia[] = [];
  const mediaLoading = false;

  const handleUploadFile = useCallback(async (file: File): Promise<BlogPostMedia | null> => {
    console.log('Mock upload:', file.name);
    return null;
  }, []);

  const handleMediaSelect = useCallback((media: BlogPostMedia) => {
    onMediaSelect?.(media);
    setMediaDialogOpen(false);
  }, [onMediaSelect]);

  const openMediaDialog = useCallback(() => {
    setMediaDialogOpen(true);
  }, []);

  const closeMediaDialog = useCallback(() => {
    setMediaDialogOpen(false);
  }, []);

  return {
    mediaDialogOpen,
    mediaItems,
    mediaLoading,
    handleUploadFile,
    handleMediaSelect,
    openMediaDialog,
    closeMediaDialog,
    refetchMedia: () => {},
  };
}
