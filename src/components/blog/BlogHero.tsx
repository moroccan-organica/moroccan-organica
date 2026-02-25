import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface BlogHeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  banner?: {
    title: string;
    subtitle: string;
    button: string;
  };
  lang: string;
}

export function BlogHero({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  banner,
  lang,
}: BlogHeroProps) {
  return (
    <section className="bg-primary text-white py-20 md:py-32 pt-36 md:pt-48 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight uppercase tracking-tight text-white">
            {banner?.title || title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            {banner?.subtitle || subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              href={`/${lang}/organica`}
              className="btn-accent py-4 px-10 rounded-xl text-lg font-bold uppercase tracking-wide"
            >
              {banner?.button || "Shop Now"}
            </Link>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:text-accent transition-colors" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-14 pr-6 h-14 text-base rounded-full bg-white text-slate-900 border-0 shadow-xl focus-visible:ring-2 focus-visible:ring-accent placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
