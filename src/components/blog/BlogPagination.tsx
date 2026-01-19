'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
      if (totalPages <= 5) return true;
      if (page === 1 || page === totalPages) return true;
      if (Math.abs(page - currentPage) <= 1) return true;
      return false;
    });
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-3 mt-16">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full border-slate-200"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {visiblePages.map((page, idx, arr) => (
        <React.Fragment key={page}>
          {idx > 0 && arr[idx - 1] !== page - 1 && (
            <span className="px-1 text-slate-400">...</span>
          )}
          <Button
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              'h-11 w-11 rounded-full font-semibold transition-all duration-300',
              currentPage === page 
                ? 'bg-[#606C38] hover:bg-[#4a542b] shadow-lg shadow-[#606C38]/20' 
                : 'border-slate-200 text-slate-600 hover:border-[#606C38] hover:text-[#606C38]'
            )}
          >
            {page}
          </Button>
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full border-slate-200"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
