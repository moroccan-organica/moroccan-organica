'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Check, Search, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogCategory } from '@/types/blog';
import { PriceRangeSlider } from './PriceRangeSlider';

export interface FilterSidebarProps {
  categories: BlogCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  // New props for search and price
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  translations: {
    title: string;
    category: string;
    allCategories: string;
    clearFilters: string;
    search?: string;
    price?: string;
    minPrice?: string;
    maxPrice?: string;
    from?: string;
    to?: string;
  };
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  isMobile = false,
  onClose,
  searchValue = '',
  onSearchChange,
  minPrice,
  maxPrice,
  onPriceChange,
  translations,
}: FilterSidebarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice ?? 0);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice ?? 1000);
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (minPrice !== undefined) setLocalMinPrice(minPrice);
    if (maxPrice !== undefined) setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  const handlePriceChange = () => {
    onPriceChange?.(localMinPrice, localMaxPrice);
  };

  const hasActiveFilters = selectedCategory || localSearch || (localMinPrice > 0) || (localMaxPrice < 1000);

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

      {/* Search */}
      {onSearchChange && (
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={translations.search || "Search products..."}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-10 rounded-lg border-slate-200 focus:ring-[#606C38] focus:border-[#606C38]"
            />
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex w-full items-center justify-between text-sm font-bold text-slate-900 mb-3"
        >
          {translations.category}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-slate-400 transition-transform duration-300',
              isCategoryOpen && 'rotate-180'
            )}
          />
        </button>

        {isCategoryOpen && (
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

      {/* Price Filter */}
      {onPriceChange && (
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="flex w-full items-center justify-between text-sm font-bold text-slate-900 mb-3"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#606C38]" />
              {translations.price || "Price"}
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-slate-400 transition-transform duration-300',
                isPriceOpen && 'rotate-180'
              )}
            />
          </button>

          {isPriceOpen && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
              {/* Price Range Display */}
              <div className="text-sm font-semibold text-slate-900 mb-4">
                {translations.from || "From"} ${localMinPrice} {translations.to || "to"} ${localMaxPrice}+
              </div>

              {/* Range Slider */}
              <PriceRangeSlider
                min={0}
                max={maxPrice || 1000}
                minValue={localMinPrice}
                maxValue={localMaxPrice}
                onMinChange={(value) => setLocalMinPrice(value)}
                onMaxChange={(value) => setLocalMaxPrice(value)}
              />

              {/* Go Button */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handlePriceChange}
                  className="px-6 py-2 h-9 bg-slate-100 hover:bg-[#606C38] hover:text-white text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {translations.go || "Go"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="px-4 pb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClearFilters();
              if (onSearchChange) {
                handleSearchChange('');
              }
              if (onPriceChange) {
                setLocalMinPrice(0);
                setLocalMaxPrice(1000);
                onPriceChange(0, 1000);
              }
            }}
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
