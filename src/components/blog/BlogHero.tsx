import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogHeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function BlogHero({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: BlogHeroProps) {
  return (
    <section className="bg-primary/85 text-white py-20 md:py-28 pt-32 md:pt-40">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>

        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 h-14 text-base rounded-full bg-white text-slate-900 border-0 shadow-xl focus-visible:ring-2 focus-visible:ring-accent placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
