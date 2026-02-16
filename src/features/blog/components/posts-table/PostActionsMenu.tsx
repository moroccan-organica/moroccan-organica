'use client';

import React from 'react';
import { Archive, Edit3, Eye, FileText, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types/blog';

type MenuPlacement = 'top' | 'bottom';

export function PostActionsMenu(props: {
  post: BlogPost;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  menuPlacement?: MenuPlacement;
  t: (key: string) => string;
  onView: () => void;
  onEdit?: () => void;
  onAction?: (action: 'archive' | 'publish') => void;
}) {
  const { post, isOpen, onToggle, onClose, menuPlacement = 'bottom', t, onView, onEdit, onAction } = props;

  return (
    <div className="relative inline-block text-left action-menu-container">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-[#606C38]"
        onClick={onToggle}
        aria-label={t('table.actions')}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 z-50 w-48 rounded-xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden',
            menuPlacement === 'bottom'
              ? 'bottom-full mb-2 origin-bottom-right'
              : 'top-full mt-2 origin-top-right'
          )}
        >
          <div className="py-1">
            <button
              className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => {
                onView();
                onClose();
              }}
            >
              <FileText className="mr-3 h-4 w-4 text-slate-400" /> {t('actions.view')}
            </button>
            <button
              className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => {
                onEdit?.();
                onClose();
              }}
            >
              <Edit3 className="mr-3 h-4 w-4 text-slate-400" /> {t('actions.edit')}
            </button>
            {post.status !== 'published' && (
              <button
                className="flex w-full items-center px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                onClick={() => {
                  onAction?.('publish');
                  onClose();
                }}
              >
                <Eye className="mr-3 h-4 w-4" /> {t('actions.publish')}
              </button>
            )}
            <button
              className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => {
                onAction?.('archive');
                onClose();
              }}
            >
              <Archive className="mr-3 h-4 w-4" /> {t('actions.archive')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
