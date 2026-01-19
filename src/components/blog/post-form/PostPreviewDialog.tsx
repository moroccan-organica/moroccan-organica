'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BlogPostContent } from '../BlogPostContent';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface PostPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  excerpt: string;
  featuredImagePreview: string | null;
  categoryLabel: string;
  tags: string[];
  contentJson: any;
}

export function PostPreviewDialog({
  open,
  onOpenChange,
  title,
  excerpt,
  featuredImagePreview,
  categoryLabel,
  tags,
  contentJson,
}: PostPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl">
        <div className="bg-white min-h-full pb-20">
          {/* Hero Preview */}
          <div className="relative h-[400px] w-full">
            {featuredImagePreview ? (
              <Image
                src={featuredImagePreview}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                <p className="text-slate-400 font-medium">No cover image</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-end pb-12">
              <div className="container mx-auto px-8">
                <div className="max-w-3xl">
                  <Badge className="bg-[#BC6C25] text-white hover:bg-[#BC6C25] border-none mb-4">
                    {categoryLabel}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
                    {title || 'Untitled Article'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Preview Author</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="container mx-auto px-8 py-16">
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-slate-600 font-medium mb-12 border-l-4 border-[#606C38] pl-6 italic">
                {excerpt || 'No excerpt provided.'}
              </p>

              <BlogPostContent 
                content={contentJson} 
                contentUnavailableText="No content available to preview." 
              />

              {tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
