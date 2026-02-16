'use client';

import React from 'react';
import {
  FilePlus,
  FolderPlus,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  onClick?: () => void;
}

function QuickAction({ icon: Icon, title, description, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-[#606C38] hover:bg-[#606C38]/5 hover:shadow-md active:scale-95 h-full w-full group"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-[#606C38] group-hover:bg-[#606C38] group-hover:text-white transition-colors duration-300">
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-playfair font-bold text-slate-900 text-base">{title}</span>
        {description && (
          <span className="text-xs text-slate-500 leading-tight px-2">{description}</span>
        )}
      </div>
    </button>
  );
}

interface QuickActionsGridProps {
  translations: {
    title: string;
    newPost: string;
    newPostDescription: string;
    categories: string;
    categoriesDescription: string;
    mediaLibrary: string;
    mediaLibraryDescription: string;
    viewBlog: string;
    viewBlogDescription: string;
  };
  onCreatePost?: () => void;
  onManageCategories?: () => void;
  onOpenMediaLibrary?: () => void;
  onViewLiveBlog?: () => void;
}

export function QuickActionsGrid({
  translations,
  onCreatePost,
  onManageCategories,
  onOpenMediaLibrary,
  onViewLiveBlog,
}: QuickActionsGridProps) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">{translations.title}</h3>
      <div className="grid grid-cols-2 gap-6">
        <QuickAction
          icon={FilePlus}
          title={translations.newPost}
          description={translations.newPostDescription}
          onClick={onCreatePost}
        />
        <QuickAction
          icon={FolderPlus}
          title={translations.categories}
          description={translations.categoriesDescription}
          onClick={onManageCategories}
        />
        <QuickAction
          icon={ImageIcon}
          title={translations.mediaLibrary}
          description={translations.mediaLibraryDescription}
          onClick={onOpenMediaLibrary}
        />
        <QuickAction
          icon={ExternalLink}
          title={translations.viewBlog}
          description={translations.viewBlogDescription}
          onClick={onViewLiveBlog}
        />
      </div>
    </div>
  );
}

export default QuickActionsGrid;
