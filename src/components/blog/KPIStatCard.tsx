"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/use-media-query";

interface KPIStatCardProps {
  title: string;
  value: string | React.ReactNode;
  delta?: string;
  footerBarColor?: string;
  description?: string;
  percentage?: number;
}

export function KPIStatCard({ title, value, delta, footerBarColor = "bg-[#606C38]", description, percentage }: KPIStatCardProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const infoIcon = (
    <Info className="size-4 text-[#606C38]/70" aria-hidden />
  );

  const infoComponent = description ? (
    isDesktop ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" aria-label="More information">
            {infoIcon}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" aria-label="More information">
            {infoIcon}
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">{description}</p>
        </PopoverContent>
      </Popover>
    )
  ) : (
    infoIcon
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate leading-snug">{title}</p>
          </div>
          <div className="shrink-0 flex items-center">
            {infoComponent}
          </div>
        </div>
        <div className="mt-3">
          {typeof value === 'string' ? (
            <div className="text-3xl font-playfair font-bold text-slate-900">{value}</div>
          ) : (
            value
          )}
        </div>
        {delta ? (
          <div className="mt-1 text-xs font-medium text-emerald-600">{delta}</div>
        ) : null}
        <div className="mt-5 h-1.5 w-full rounded-full overflow-hidden bg-slate-50">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${footerBarColor}`}
            style={{ width: percentage !== undefined ? `${Math.min(Math.max(percentage, 0), 100)}%` : '100%' }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
