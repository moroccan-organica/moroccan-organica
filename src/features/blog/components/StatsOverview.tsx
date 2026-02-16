'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { KPIStatCard } from './KPIStatCard';
import { BlogPost } from '@/types/blog';

interface StatsOverviewProps {
  posts: BlogPost[];
  isLoading?: boolean;
  translations: {
    totalArticles: string;
    totalArticlesDelta: string;
    totalArticlesDescription: string;
    noArticles: string;
    published: string;
    publishedDelta: string;
    publishedDescription: string;
    noPublished: string;
    inReview: string;
    inReviewDelta: string;
    inReviewDescription: string;
    noInReview: string;
    drafts: string;
    draftsDelta: string;
    draftsDescription: string;
    noDrafts: string;
  };
}

export function StatsOverview({ posts, isLoading, translations }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <section className="mb-8 w-full max-w-full overflow-x-hidden">
        <div className="flex overflow-x-auto space-x-6 p-1 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:space-x-0 max-w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] shrink-0 md:min-w-0 md:w-full">
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const total = posts.length;
  const published = posts.filter((p) => p.status === 'published').length;
  const inReview = posts.filter((p) => p.status === 'review').length;
  const draft = posts.filter((p) => p.status === 'draft').length;

  const publishedPercentage = total > 0 ? Math.round((published / total) * 100) : 0;
  const inReviewPercentage = total > 0 ? Math.round((inReview / total) * 100) : 0;
  const draftPercentage = total > 0 ? Math.round((draft / total) * 100) : 0;

  const kpis = [
    {
      title: translations.totalArticles,
      value: total.toString(),
      delta: total > 0 ? translations.totalArticlesDelta.replace('{count}', String(total)) : translations.noArticles,
      footerBarColor: 'bg-gradient-to-r from-[#606C38] to-[#BC6C25]',
      description: translations.totalArticlesDescription,
      percentage: 100,
    },
    {
      title: translations.published,
      value: published.toString(),
      delta: total > 0 
        ? translations.publishedDelta.replace('{percentage}', String(publishedPercentage)).replace('{count}', String(published))
        : translations.noPublished,
      footerBarColor: 'bg-gradient-to-r from-emerald-500 to-[#606C38]',
      description: translations.publishedDescription,
      percentage: publishedPercentage,
    },
    {
      title: translations.inReview,
      value: inReview.toString(),
      delta: total > 0
        ? translations.inReviewDelta.replace('{percentage}', String(inReviewPercentage)).replace('{count}', String(inReview))
        : translations.noInReview,
      footerBarColor: 'bg-gradient-to-r from-amber-500 to-[#BC6C25]',
      description: translations.inReviewDescription,
      percentage: inReviewPercentage,
    },
    {
      title: translations.drafts,
      value: draft.toString(),
      delta: total > 0
        ? translations.draftsDelta.replace('{percentage}', String(draftPercentage)).replace('{count}', String(draft))
        : translations.noDrafts,
      footerBarColor: 'bg-gradient-to-r from-slate-400 to-slate-200',
      description: translations.draftsDescription,
      percentage: draftPercentage,
    },
  ];

  return (
    <section className="mb-8 w-full max-w-full overflow-x-hidden">
      <div className="flex overflow-x-auto space-x-6 p-1 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:space-x-0 max-w-full">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="min-w-[280px] shrink-0 md:min-w-0 md:w-full"
          >
            <KPIStatCard {...kpi} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsOverview;
