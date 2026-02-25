'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Archive,
  Plus,
  RotateCw,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { FilterCheckbox, FilterSection } from './posts-table/filters';
import { PostsGridView, PostsTableView } from './posts-table/views';
import { PaginationFooter } from './posts-table/PaginationFooter';

interface PostsTableProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  onEdit?: (post: BlogPost) => void;
  onView?: (post: BlogPost) => void;
  onCreatePost?: () => void;
  onAction?: (post: BlogPost, action: 'archive' | 'publish') => void;
  onRefresh?: () => void | Promise<void>;
  isRefreshing?: boolean;
  viewMode?: 'full' | 'compact';
  onViewAll?: () => void;
  onViewArchives?: () => void;
  translations: {
    allPosts: string;
    recentPosts: string;
    searchPlaceholder: string;
    refresh: string;
    gridView: string;
    tableView: string;
    archives: string;
    addPost: string;
    filterTitle: string;
    clearAll: string;
    status: string;
    category: string;
    noPostsFound: string;
    noPostsMatchFilter: string;
    clearFilters: string;
    viewAll: string;
    table: {
      title: string;
      status: string;
      category: string;
      actions: string;
    };
    actions: {
      view: string;
      edit: string;
      publish: string;
      archive: string;
      delete: string;
    };
    statusLabels: Record<string, string>;
  };
}

export function PostsTable({
  posts,
  categories,
  onEdit,
  onView,
  onCreatePost,
  onAction,
  onRefresh,
  isRefreshing,
  viewMode = 'full',
  onViewAll,
  onViewArchives,
  translations,
}: PostsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sectionsOpen, setSectionsOpen] = useState({ status: true, category: true });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const COMPACT_PAGE_SIZE = 5;

  const categoryById = useMemo(() => {
    const map = new Map<string, BlogCategory>();
    for (const c of categories) {
      map.set(c.id, c);
    }
    return map;
  }, [categories]);

  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of posts) {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    }
    return counts;
  }, [posts]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      if (!p.category_id) continue;
      counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    }
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const categoryName = p.category_id ? categoryById.get(p.category_id)?.name || '' : '';
      const matchesSearch =
        normalizedSearch.length === 0 ||
        p.title.toLowerCase().includes(normalizedSearch) ||
        categoryName.toLowerCase().includes(normalizedSearch);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(p.status);
      const matchesCategory =
        selectedCategories.length === 0 ||
        (p.category_id && selectedCategories.includes(p.category_id));
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryById, normalizedSearch, posts, selectedCategories, selectedStatuses]);

  const toggleStatus = useCallback((status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSearch('');
  }, []);

  const hasActiveFilters =
    selectedStatuses.length > 0 || selectedCategories.length > 0 || search.length > 0;

  // Reset page when filters change
  const filterKey = `${search}-${selectedStatuses.join(',')}-${selectedCategories.join(',')}`;

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  if (filterKey !== prevFilterKey) {
    setCurrentPage(1);
    setPrevFilterKey(filterKey);
  }

  const currentPageSize = viewMode === 'compact' ? COMPACT_PAGE_SIZE : pageSize;
  const totalPages = Math.max(1, Math.ceil(filtered.length / currentPageSize));

  const paginatedPosts = useMemo(() => {
    return viewMode === 'compact'
      ? filtered.slice(0, COMPACT_PAGE_SIZE)
      : filtered.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize);
  }, [COMPACT_PAGE_SIZE, currentPage, filtered, currentPageSize, viewMode]);

  const pageRange = useMemo(() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages] as (number | 'ellipsis')[];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as (number | 'ellipsis')[];
    }
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages] as (number | 'ellipsis')[];
  }, [currentPage, totalPages]);

  const handleViewPost = useCallback(
    (post: BlogPost) => {
      if (onView) {
        onView(post);
      } else {
        router.push(`/blog/posts/${post.id}`);
      }
    },
    [onView, router]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const statusOptions = [
    { value: 'published', label: translations.statusLabels.published },
    { value: 'draft', label: translations.statusLabels.draft },
    { value: 'review', label: translations.statusLabels.review },
  ];

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

  const t = (key: string) => {
    const keys = key.split('.');
    let result: unknown = translations;
    for (const k of keys) {
      if (isRecord(result) && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }
    return typeof result === 'string' ? result : key;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-x-hidden min-w-0 relative z-0">
      <div className="flex flex-col gap-4 relative z-10 w-full">
        <h2 className="text-xl font-bold text-[#606C38]">
          {viewMode === 'full' ? translations.allPosts : translations.recentPosts}
        </h2>
        {viewMode === 'full' && (
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={translations.searchPlaceholder}
                className="pl-9 bg-white h-11 rounded-xl border-slate-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-slate-100 bg-white p-1">
              {onRefresh && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  disabled={!!isRefreshing}
                  className="h-9 w-9 rounded-lg"
                >
                  <RotateCw className={cn('h-4 w-4', isRefreshing ? 'animate-spin' : '')} />
                </Button>
              )}

              <Button
                type="button"
                variant={displayMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => setDisplayMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant={displayMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => setDisplayMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider delayDuration={300}>
                {onViewArchives && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 bg-white border-slate-100 text-slate-700 hover:bg-slate-50 rounded-xl"
                        onClick={onViewArchives}
                      >
                        <Archive className="h-4 w-4 text-slate-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {translations.archives}
                    </TooltipContent>
                  </Tooltip>
                )}
                {onCreatePost && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onCreatePost}
                        size="icon"
                        className="bg-[#BC6C25] hover:bg-[#a05a1f] h-11 w-11 rounded-xl shadow-lg shadow-[#BC6C25]/20"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {translations.addPost}
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>

      <div className={cn('grid grid-cols-1 gap-6', viewMode === 'full' ? 'lg:grid-cols-4' : '')}>
        {viewMode === 'full' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-28 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-sm">{translations.filterTitle}</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700"
                  >
                    {translations.clearAll}
                  </button>
                )}
              </div>

              <div className="p-5">
                <FilterSection
                  title={translations.status}
                  isOpen={sectionsOpen.status}
                  onToggle={() => setSectionsOpen((prev) => ({ ...prev, status: !prev.status }))}
                  activeCount={selectedStatuses.length}
                >
                  {statusOptions.map((status) => (
                    <FilterCheckbox
                      key={status.value}
                      label={status.label}
                      checked={selectedStatuses.includes(status.value)}
                      onChange={() => toggleStatus(status.value)}
                      count={statusCounts[status.value] ?? 0}
                    />
                  ))}
                </FilterSection>

                <FilterSection
                  title={translations.category}
                  isOpen={sectionsOpen.category}
                  onToggle={() => setSectionsOpen((prev) => ({ ...prev, category: !prev.category }))}
                  activeCount={selectedCategories.length}
                >
                  <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map((cat) => (
                      <FilterCheckbox
                        key={cat.id}
                        label={cat.name}
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        count={categoryCounts.get(cat.id) ?? 0}
                      />
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </div>
        )}

        <div className={cn(viewMode === 'full' ? 'lg:col-span-3' : 'w-full')}>
          <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="rounded-full bg-slate-50 p-6 mb-4">
                    <Filter className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-slate-900">{translations.noPostsFound}</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                    {translations.noPostsMatchFilter}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={clearFilters} className="mt-4 text-[#BC6C25] font-bold">
                      {translations.clearFilters}
                    </Button>
                  )}
                </div>
              ) : displayMode === 'table' ? (
                <PostsTableView
                  posts={paginatedPosts}
                  categoryById={categoryById}
                  t={t}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onViewPost={handleViewPost}
                  onEdit={onEdit}
                  onAction={onAction}
                />
              ) : (
                <PostsGridView
                  posts={paginatedPosts}
                  categoryById={categoryById}
                  t={t}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onViewPost={handleViewPost}
                  onEdit={onEdit}
                  onAction={onAction}
                />
              )}
              {viewMode === 'full' && filtered.length > 0 && (
                <PaginationFooter
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  pageSize={pageSize}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  pageRange={pageRange}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
              {viewMode === 'compact' && onViewAll && (
                <div className="border-t border-slate-50 bg-slate-50/30 px-6 py-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="px-8 rounded-full border-slate-200 hover:border-[#606C38] hover:text-[#606C38]"
                    onClick={onViewAll}
                  >
                    {translations.viewAll}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PostsTable;
