'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
