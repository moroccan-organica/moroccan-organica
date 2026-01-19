'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ShopHeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function ShopHero({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: ShopHeroProps) {
  return (
    <section className="bg-[#606C38] text-white py-20 md:py-28 pt-32 md:pt-40">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#D4A373] mb-4">
          Organic · Fair Trade · Made in Morocco
        </p>
        <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>

        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#D4A373]" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 h-14 text-base rounded-full bg-white text-slate-900 border-0 shadow-xl focus-visible:ring-2 focus-visible:ring-[#D4A373] placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
