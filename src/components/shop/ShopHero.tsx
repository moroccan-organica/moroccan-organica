'use client';

import React from 'react';

interface ShopHeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function ShopHero({
  title,
  subtitle,
}: ShopHeroProps) {
  return (
    <section className="bg-primary/85 text-white py-12 md:py-16 pt-20 md:pt-24">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-accent mb-3">
          Organic · Fair Trade · Made in Morocco
        </p>
        <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
