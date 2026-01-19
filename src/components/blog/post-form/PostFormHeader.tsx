'use client';

import React from 'react';
import { Save, Eye, X, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PostFormHeaderProps {
  isEditing: boolean;
  isLoading?: boolean;
  title: string;
  onCancel: () => void;
  onOpenPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function PostFormHeader({
  isEditing,
  isLoading,
  title,
  onCancel,
  onOpenPreview,
  onSaveDraft,
  onPublish,
}: PostFormHeaderProps) {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-10">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onCancel}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="Cancel"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <h1 className="truncate text-lg font-bold text-slate-900 min-w-0">
          {isEditing ? `Edit: ${title || 'Untitled'}` : 'Create New Article'}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenPreview}
          className="h-9 gap-2 rounded-xl text-slate-600 hover:text-[#606C38] hover:bg-[#606C38]/5"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Preview</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          disabled={isLoading}
          className="h-9 gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="hidden sm:inline">Save Draft</span>
        </Button>

        <Button
          size="sm"
          onClick={onPublish}
          disabled={isLoading}
          className="h-9 gap-2 rounded-xl bg-[#606C38] hover:bg-[#4a542b] shadow-lg shadow-[#606C38]/20"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span>{isEditing ? 'Update' : 'Publish'}</span>
        </Button>
      </div>
    </div>
  );
}
