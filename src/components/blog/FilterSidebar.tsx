'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BlogCategory } from '@/types/blog';

export interface FilterSidebarProps {
  categories: BlogCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  translations: {
    title: string;
    category: string;
    allCategories: string;
    clearFilters: string;
  };
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  isMobile = false,
  onClose,
  translations,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden max-w-sm',
        isMobile ? 'w-full' : 'sticky top-24'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#606C38]" />
          <h3 className="font-playfair font-bold text-slate-900">{translations.title}</h3>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between text-sm font-bold text-slate-900 mb-3"
        >
          {translations.category}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-slate-400 transition-transform duration-300',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
            <button
              onClick={() => onCategoryChange(null)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all border border-transparent',
                !selectedCategory
                  ? 'bg-[#606C38]/10 text-[#606C38] font-semibold border-[#606C38]/30'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span className={cn(
                'h-4 w-4 rounded border flex items-center justify-center',
                !selectedCategory ? 'border-[#606C38] bg-white' : 'border-slate-300 bg-white'
              )}>
                {!selectedCategory && <Check className="h-3 w-3 text-[#606C38]" />}
              </span>
              <span className="font-semibold">{translations.allCategories}</span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all border border-transparent',
                  selectedCategory === category.id
                    ? 'bg-[#606C38]/10 text-[#606C38] font-semibold border-[#606C38]/30'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <span className={cn(
                  'h-4 w-4 rounded border flex items-center justify-center',
                  selectedCategory === category.id ? 'border-[#606C38] bg-white' : 'border-slate-300 bg-white'
                )}>
                  {selectedCategory === category.id && <Check className="h-3 w-3 text-[#606C38]" />}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: category.color || '#606C38' }}
                />
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {selectedCategory && (
        <div className="px-4 pb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs"
          >
            <X className="mr-2 h-3 w-3" />
            {translations.clearFilters}
          </Button>
        </div>
      )}
    </aside>
  );
}
