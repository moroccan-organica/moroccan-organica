'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X, Upload, Search, Play, Check, Image as ImageIcon, Film, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogPostMedia } from '@/types/blog';
import Image from 'next/image';

type MediaFilter = 'all' | 'image' | 'video';
type DialogTab = 'upload' | 'library';

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: BlogPostMedia) => void;
  mediaItems: BlogPostMedia[];
  onUpload?: (file: File) => Promise<BlogPostMedia | null>;
  initialTab?: DialogTab;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function MediaLibraryDialog({
  open,
  onClose,
  onSelect,
  mediaItems,
  onUpload,
  initialTab,
}: MediaLibraryDialogProps) {
  const [activeTab, setActiveTab] = useState<DialogTab>(initialTab ?? 'library');
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<BlogPostMedia | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab ?? 'library');
  }, [open, initialTab]);

  const filteredMedia = mediaItems.filter((item) => {
    const matchesFilter = filter === 'all' || item.media_type === filter;
    const matchesSearch =
      !searchQuery ||
      item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const imageCount = mediaItems.filter((i) => i.media_type === 'image').length;
  const videoCount = mediaItems.filter((i) => i.media_type === 'video').length;

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !onUpload) return;

      setIsUploading(true);
      try {
        const file = files[0];
        const uploaded = await onUpload(file);
        if (uploaded) {
          setSelectedMedia(uploaded);
          setActiveTab('library');
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const handleInsert = () => {
    if (selectedMedia) {
      onSelect(selectedMedia);
      onClose();
      setSelectedMedia(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[85vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-slate-50/50">
          <h2 className="text-xl font-playfair font-bold text-slate-900">Add Media</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-slate-600 transition-all shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-100 bg-white">
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              'px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px',
              activeTab === 'upload'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            )}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={cn(
              'px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px',
              activeTab === 'library'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            )}
          >
            Media Library
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {activeTab === 'upload' ? (
            <div className="flex flex-1 items-center justify-center p-12">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex h-full w-full max-w-3xl cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all duration-500 group',
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 bg-slate-50/50 hover:border-primary hover:bg-primary/5'
                )}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 rounded-full bg-white p-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <Upload className="h-10 w-10 text-slate-400 group-hover:text-inherit" />
                    </div>
                    <p className="mb-2 text-xl font-playfair font-bold text-slate-900">
                      Drag & drop your files here
                    </p>
                    <p className="mb-6 text-sm text-slate-500 font-medium">or</p>
                    <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8 shadow-lg shadow-primary/20">
                      Select Files
                    </Button>
                    <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Max size: 10MB. Formats: JPG, PNG, GIF, WEBP, MP4
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 bg-white px-8 py-4">
                <div className="flex items-center gap-1 rounded-xl bg-slate-50 border border-slate-100 p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all',
                      filter === 'all'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    All ({mediaItems.length})
                  </button>
                  <button
                    onClick={() => setFilter('image')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all',
                      filter === 'image'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Images ({imageCount})
                  </button>
                  <button
                    onClick={() => setFilter('video')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all',
                      filter === 'video'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    <Film className="h-3.5 w-3.5" />
                    Videos ({videoCount})
                  </button>
                </div>

                <div className="relative flex-1 max-w-sm ml-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search media..."
                    className="pl-10 h-10 rounded-xl border-slate-100 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                {filteredMedia.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400">
                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <ImageIcon className="h-10 w-10 text-slate-100" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">No media found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                    {filteredMedia.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedMedia(item)}
                        className={cn(
                          'group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300',
                          selectedMedia?.id === item.id
                            ? 'border-primary ring-4 ring-primary/10'
                            : 'border-transparent hover:border-primary/30 shadow-sm hover:shadow-lg'
                        )}
                      >
                        {item.media_type === 'video' ? (
                          <div className="relative h-full w-full bg-slate-900">
                            {item.thumbnail_url ? (
                              <Image
                                src={item.thumbnail_url}
                                alt={item.alt_text || 'Video'}
                                fill
                                className="object-cover opacity-80"
                              />
                            ) : (
                              <video
                                src={item.url}
                                className="h-full w-full object-cover opacity-80"
                                muted
                                playsInline
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-xl">
                                <Play className="h-5 w-5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={item.url}
                            alt={item.alt_text || 'Media'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}

                        {selectedMedia?.id === item.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-xl scale-110 animate-in zoom-in-50 duration-300">
                              <Check className="h-5 w-5" />
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'library' && selectedMedia && (
            <div className="w-80 border-l border-slate-100 bg-white p-6 overflow-y-auto">
              <h3 className="mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                File Details
              </h3>

              <div className="mb-6 aspect-video overflow-hidden rounded-xl border border-slate-100 bg-slate-50 relative shadow-sm">
                {selectedMedia.media_type === 'video' ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={selectedMedia.thumbnail_url || selectedMedia.url}
                      alt="Video"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.alt_text || 'Selected'}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title</label>
                  <p className="text-sm font-bold text-slate-900 line-clamp-2">{selectedMedia.alt_text || "Untitled"}</p>
                </div>
                {selectedMedia.caption && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Caption</label>
                    <p className="text-sm text-slate-600 italic leading-relaxed">{selectedMedia.caption}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Type</label>
                    <p className="text-sm font-bold text-primary uppercase tracking-tighter">{selectedMedia.media_type}</p>
                  </div>
                  {selectedMedia.duration_seconds && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Duration</label>
                      <p className="text-sm font-bold text-slate-900">{formatDuration(selectedMedia.duration_seconds)}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Added on</label>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(selectedMedia.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50/50 px-8 py-5">
          <Button variant="ghost" onClick={onClose} className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white font-bold">
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!selectedMedia}
            className="bg-primary hover:bg-primary/90 rounded-xl px-10 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Insert into Article
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MediaLibraryDialog;
