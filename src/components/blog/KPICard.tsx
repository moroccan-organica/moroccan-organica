'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogKPI } from '@/types/blog';

interface KPICardProps {
  data: BlogKPI;
  isLoading?: boolean;
}

export function KPICard({ data, isLoading }: KPICardProps) {
  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  return (
    <Card className="relative overflow-hidden border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{data.title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className="text-3xl font-playfair font-bold text-slate-900">{data.value}</h3>
          {data.delta && (
            <span
              className={cn(
                'text-xs font-semibold',
                data.deltaType === 'positive' && 'text-emerald-600',
                data.deltaType === 'negative' && 'text-red-500',
                data.deltaType === 'neutral' && 'text-slate-500'
              )}
            >
              {data.delta}
            </span>
          )}
        </div>
      </CardContent>
      {data.colorGradient && (
        <div
          className={cn('absolute bottom-0 left-0 h-1.5 w-full bg-linear-to-r', data.colorGradient)}
        />
      )}
    </Card>
  );
}

interface KPICardsGridProps {
  kpis: BlogKPI[];
  isLoading?: boolean;
}

export function KPICardsGrid({ kpis, isLoading }: KPICardsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} data={kpi} />
      ))}
    </div>
  );
}

export default KPICard;
