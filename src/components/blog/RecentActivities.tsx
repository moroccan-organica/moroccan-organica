'use client';

import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  RefreshCw,
  PlusCircle,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogActivity } from '@/types/blog';

const activityIcons: Record<BlogActivity['type'], React.ElementType> = {
  publish: FileText,
  media: ImageIcon,
  status: RefreshCw,
  create: PlusCircle,
  edit: Edit,
};

const activityColors: Record<BlogActivity['type'], string> = {
  publish: 'bg-emerald-100 text-emerald-600',
  media: 'bg-blue-100 text-blue-600',
  status: 'bg-amber-100 text-amber-600',
  create: 'bg-[#606C38]/10 text-[#606C38]',
  edit: 'bg-purple-100 text-purple-600',
};

interface RecentActivitiesProps {
  activities: BlogActivity[];
  isLoading?: boolean;
  translations: {
    title: string;
    noActivity: string;
  };
}

export function RecentActivities({ activities, isLoading, translations }: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
        <CardTitle className="text-base font-bold text-slate-900">
          {translations.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex items-start gap-4 group cursor-default">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full shrink-0 transition-transform duration-300 group-hover:scale-110',
                    colorClass
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <RefreshCw className="h-10 w-10 text-slate-200 mb-3 animate-pulse" />
            <p className="text-sm text-slate-400 font-medium">
              {translations.noActivity}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivities;
