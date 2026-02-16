'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types/blog';

export function StatusBadge({ status, t }: { status: BlogPost['status']; t: (key: string) => string }) {
  const variants: Record<
    BlogPost['status'],
    { variant: 'default' | 'secondary' | 'destructive' | 'outline'; labelKey: string }
  > = {
    published: { variant: 'default', labelKey: 'status.published' },
    draft: { variant: 'secondary', labelKey: 'status.draft' },
    review: { variant: 'outline', labelKey: 'status.review' },
    archived: { variant: 'secondary', labelKey: 'status.archived' },
  };

  const { variant, labelKey } = variants[status];

  return (
    <Badge
      variant={variant}
      className={cn(
        "font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md",
        status === 'published' && 'bg-emerald-500 hover:bg-emerald-600 text-white border-none',
        status === 'review' && 'border-amber-500 text-amber-600 bg-amber-50',
        status === 'draft' && 'bg-slate-100 text-slate-600 border-none',
        status === 'archived' && 'bg-slate-200 text-slate-500 border-none line-through'
      )}
    >
      {t(labelKey)}
    </Badge>
  );
}
