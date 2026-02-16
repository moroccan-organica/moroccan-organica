'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Author } from '@/types/blog';
import Image from 'next/image';

export interface BlogPostMetaProps {
  author: Author | null | undefined;
  publishedAt: string | null | undefined;
  createdAt: string;
  readTimeMinutes: number | null | undefined;
  onShare: () => void;
  translations: {
    author: string;
    share: string;
    readTime: string;
  };
}

export function BlogPostMeta({
  author,
  publishedAt,
  createdAt,
  readTimeMinutes,
  onShare,
  translations,
}: BlogPostMetaProps) {
  const displayDate = publishedAt || createdAt;

  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
      {/* Author */}
      {author && (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full bg-[#606C38]/10 flex items-center justify-center overflow-hidden">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.name}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-[#606C38]" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">{author.name}</p>
            <p className="text-xs text-slate-500">{translations.author}</p>
          </div>
        </div>
      )}

      <Separator orientation="vertical" className="h-8 hidden sm:block" />

      {/* Date */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-[#BC6C25]" />
        <span className="font-medium">
          {format(new Date(displayDate), 'dd MMMM yyyy')}
        </span>
      </div>

      {/* Read Time */}
      {readTimeMinutes && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#BC6C25]" />
          <span className="font-medium">{readTimeMinutes} {translations.readTime}</span>
        </div>
      )}

      {/* Share Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        className="ml-auto rounded-full border-slate-200 hover:border-[#BC6C25] hover:text-[#BC6C25]"
      >
        <Share2 className="h-4 w-4 mr-2" />
        {translations.share}
      </Button>
    </div>
  );
}
