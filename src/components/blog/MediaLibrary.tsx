'use client';

import React, { useState } from 'react';
import { Upload, Play, Eye, Trash2, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPostMedia } from '@/types/blog';
import Image from 'next/image';

type MediaFilter = 'all' | 'image' | 'video';

interface MediaLibraryProps {
  items: BlogPostMedia[];
  onUpload?: () => void;
  onSelect?: (item: BlogPostMedia) => void;
  onDelete?: (item: BlogPostMedia) => void | Promise<void>;
  isLoading?: boolean;
  translations: {
    title: string;
    all: string;
    images: string;
    videos: string;
    upload: string;
    view: string;
    delete: string;
    deleteTitle: string;
    deleteDescription: string;
    cancel: string;
    noMedia: string;
    untitled: string;
    preview: string;
  };
}

export function MediaLibrary({ items, onUpload, onSelect, onDelete, isLoading, translations }: MediaLibraryProps) {
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<BlogPostMedia | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BlogPostMedia | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = items.filter((i) => filter === 'all' || i.media_type === filter);

  const imageCount = items.filter((i) => i.media_type === 'image').length;
  const videoCount = items.filter((i) => i.media_type === 'video').length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <h2 className="text-xl font-playfair font-bold text-slate-900">
            {translations.title} <span className="text-[#606C38] font-sans text-sm ml-1">({items.length})</span>
          </h2>
          {/* Filter Tabs */}
          <div className="flex items-center rounded-xl bg-slate-50 border border-slate-100 p-1">
            {[
              { id: 'all', label: translations.all, count: items.length },
              { id: 'image', label: translations.images, count: imageCount },
              { id: 'video', label: translations.videos, count: videoCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as MediaFilter)}
                className={cn(
                  'px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300',
                  filter === tab.id
                    ? 'bg-white text-[#606C38] shadow-sm ring-1 ring-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {tab.label} <span className="opacity-50 font-medium ml-1">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={onUpload} className="gap-2 bg-[#606C38] hover:bg-[#4a542b] rounded-xl shadow-lg shadow-[#606C38]/20">
          <Upload className="h-4 w-4" /> {translations.upload}
        </Button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
          >
            {/* Media content */}
            {item.media_type === 'video' ? (
              <div className="absolute inset-0">
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.alt_text || 'Video thumbnail'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <video
                    src={item.url}
                    muted
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white shadow-xl transition-transform duration-500 group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <Image
                src={item.url}
                alt={item.alt_text || 'Media'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}

            {/* Selection Overlay (Hover) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="flex-1 truncate text-xs font-bold text-white uppercase tracking-tight">
                  {item.alt_text || item.caption || translations.untitled}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewItem(item);
                      setPreviewOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-red-500 transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteItem(item);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setPreviewItem(null);
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border-none">
          {previewItem ? (
            <div className="bg-slate-900 aspect-video flex items-center justify-center">
              {previewItem.media_type === 'video' ? (
                <video
                  className="w-full h-full max-h-[80vh]"
                  controls
                  autoPlay
                  playsInline
                  src={previewItem.url}
                />
              ) : (
                <div className="relative w-full h-full min-h-[400px]">
                  <Image
                    src={previewItem.url}
                    alt={previewItem.alt_text || 'Media'}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open: boolean) => {
          if (isDeleting) return;
          setDeleteOpen(open);
          if (!open) setDeleteItem(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair font-bold text-xl">{translations.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              {translations.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl border-slate-100">
              {translations.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!deleteItem || !onDelete || isDeleting}
              className="bg-red-500 text-white hover:bg-red-600 rounded-xl"
              onClick={async (e: React.MouseEvent) => {
                e.preventDefault();
                if (!deleteItem || !onDelete) return;
                setIsDeleting(true);
                try {
                  await onDelete(deleteItem);
                  setDeleteOpen(false);
                  setDeleteItem(null);
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : translations.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
            <BookOpen className="h-10 w-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{translations.noMedia}</p>
        </div>
      )}
    </div>
  );
}

export default MediaLibrary;
