'use client';

import { useState, useCallback, useEffect } from 'react';
import type { BlogPostMedia } from '@/types/blog';

interface UseBlogMediaManagerProps {
  postId?: string;
  onMediaSelect?: (media: BlogPostMedia) => void;
}

import { getBlogMedia, uploadBlogImage } from '@/features/admin/actions/media.actions';

export function useBlogMediaManager({ postId, onMediaSelect }: UseBlogMediaManagerProps) {
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<BlogPostMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    setMediaLoading(true);
    try {
      const data = await getBlogMedia({ postId: postId || undefined });
      setMediaItems(data as BlogPostMedia[]);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setMediaLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (mediaDialogOpen) {
      fetchMedia();
    }
  }, [mediaDialogOpen, fetchMedia]);

  const handleUploadFile = useCallback(async (file: File): Promise<BlogPostMedia | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (postId) {
        formData.append('postId', postId);
      }

      const result = await uploadBlogImage(formData);

      if (!result.success || !result.media) {
        console.error('Upload failed:', result.error);
        return null;
      }

      const media: BlogPostMedia = result.media as BlogPostMedia;

      // Refresh media list
      await fetchMedia();

      return media;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }, [postId, fetchMedia]);

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
    refetchMedia: fetchMedia,
  };
}
