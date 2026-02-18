'use client';

import React from 'react';
import { CardContent } from '@/components/ui/card';
import type { BlogCategory, BlogPost } from '@/types/blog';
import { StatusBadge } from './StatusBadge';
import { PostActionsMenu } from './PostActionsMenu';
import { getValidImageUrl } from '@/lib/utils';

export function PostsTableView(props: {
  posts: BlogPost[];
  categoryById: Map<string, BlogCategory>;
  t: (key: string) => string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onViewPost: (post: BlogPost) => void;
  onEdit?: (post: BlogPost) => void;
  onAction?: (post: BlogPost, action: 'archive' | 'publish') => void;
}) {
  const { posts, categoryById, t, openMenuId, setOpenMenuId, onViewPost, onEdit, onAction } = props;

  return (
    <div className="overflow-x-auto w-full max-w-full">
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">{t('table.title')}</th>
            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">{t('table.status')}</th>
            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">{t('table.category')}</th>
            <th className="px-6 py-4 text-right font-bold text-slate-600 uppercase tracking-wider text-[10px]">{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {posts.map((post, index) => {
            const category = post.category_id ? categoryById.get(post.category_id) : undefined;
            const isLast = index >= posts.length - 2 && posts.length > 2;

            return (
              <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onViewPost(post)}
                    className="text-left hover:underline focus:outline-none block"
                  >
                    <span className="font-playfair font-bold text-slate-900 block text-base">{post.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5 block">
                      Updated {new Date(post.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={post.status} t={t} />
                </td>
                <td className="px-6 py-4">
                  {category && (
                    <span className="inline-flex items-center rounded-full bg-[#606C38]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#606C38]">
                      {category.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <PostActionsMenu
                    post={post}
                    isOpen={openMenuId === post.id}
                    onToggle={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                    onClose={() => setOpenMenuId(null)}
                    menuPlacement={isLast ? 'bottom' : 'top'}
                    t={t}
                    onView={() => onViewPost(post)}
                    onEdit={onEdit ? () => onEdit(post) : undefined}
                    onAction={onAction ? (action) => onAction(post, action) : undefined}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function PostsGridView(props: {
  posts: BlogPost[];
  categoryById: Map<string, BlogCategory>;
  t: (key: string) => string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onViewPost: (post: BlogPost) => void;
  onEdit?: (post: BlogPost) => void;
  onAction?: (post: BlogPost, action: 'archive' | 'publish') => void;
}) {
  const { posts, categoryById, t, openMenuId, setOpenMenuId, onViewPost, onEdit, onAction } = props;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const category = post.category_id ? categoryById.get(post.category_id) : undefined;

        return (
          <div
            key={post.id}
            className="group relative rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={getValidImageUrl(post.featured_image_url)}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }}
              />
              <div className="absolute top-3 left-3">
                <StatusBadge status={post.status} t={t} />
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onViewPost(post)}
                  className="text-left flex-1 focus:outline-none"
                >
                  <div className="font-playfair font-bold text-slate-900 leading-snug line-clamp-2 text-lg">{post.title}</div>
                  <div className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {new Date(post.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </button>

                <div className="relative action-menu-container">
                  <PostActionsMenu
                    post={post}
                    isOpen={openMenuId === post.id}
                    onToggle={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                    onClose={() => setOpenMenuId(null)}
                    t={t}
                    onView={() => onViewPost(post)}
                    onEdit={onEdit ? () => onEdit(post) : undefined}
                    onAction={onAction ? (action) => onAction(post, action) : undefined}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                {category && (
                  <span className="inline-flex items-center rounded-full bg-[#606C38]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#606C38]">
                    {category.name}
                  </span>
                )}
                <span className="text-[10px] font-bold text-[#BC6C25] uppercase tracking-wider">{post.view_count} Views</span>
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
}
