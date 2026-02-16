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
  pageRange: Array<number | 'ellipsis'>;
  onPageChange: (page: number) => void;
}) {
  const { currentPage, totalPages, pageRange, onPageChange } = props;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/30 px-6 py-4">
      <Pagination className="justify-center">
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
              className="rounded-full border-slate-200"
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
              className="rounded-full border-slate-200"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
