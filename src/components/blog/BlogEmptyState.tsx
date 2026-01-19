'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BlogEmptyStateProps {
  title: string;
  description: string;
  showClearButton?: boolean;
  clearButtonText?: string;
  onClear?: () => void;
}

export function BlogEmptyState({
  title,
  description,
  showClearButton = false,
  clearButtonText,
  onClear,
}: BlogEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-16 text-center shadow-sm">
      <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <BookOpen className="h-10 w-10 text-[#606C38]" />
      </div>
      <h3 className="text-xl font-playfair font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 max-w-sm mx-auto mb-8">{description}</p>
      {showClearButton && onClear && clearButtonText && (
        <Button 
          variant="outline" 
          onClick={onClear}
          className="rounded-full border-[#BC6C25] text-[#BC6C25] hover:bg-[#BC6C25] hover:text-white"
        >
          {clearButtonText}
        </Button>
      )}
    </div>
  );
}
