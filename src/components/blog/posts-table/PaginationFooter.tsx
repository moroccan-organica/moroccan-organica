'use client';

import React, { MouseEvent } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function PaginationFooter(props: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageRange: Array<number | 'ellipsis'>;
  onPageChange: (page: number) => void;
}) {
  const { currentPage, totalPages, totalItems, pageSize, onPageSizeChange, pageRange, onPageChange } = props;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/30 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 whitespace-nowrap">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
          >
            {[5, 10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-slate-500">
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          {totalItems === 0 ? '' : `-${Math.min(currentPage * pageSize, totalItems)}`}
          {' '}of {totalItems} results
        </p>
      </div>

      <Pagination className="justify-center md:justify-end border-none bg-transparent p-0 shadow-none">
        <PaginationContent className="flex flex-wrap items-center justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50 rounded-full border-slate-200' : 'rounded-full border-slate-200'}
            />
          </PaginationItem>

          {pageRange.map((page, idx) => (
            <PaginationItem key={`${page}-${idx}`}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  size="default"
                  onClick={(e: MouseEvent) => {
                    e.preventDefault();
                    onPageChange(page as number);
                  }}
                  className={page === currentPage ? 'bg-[#606C38] text-white hover:bg-[#4a542b] border-none rounded-full' : 'rounded-full border-slate-200'}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50 rounded-full border-slate-200' : 'rounded-full border-slate-200'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
