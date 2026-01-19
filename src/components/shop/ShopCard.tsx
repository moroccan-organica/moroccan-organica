'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ShopProduct, ShopCategory, shopCategories } from '@/data/shop-products';

interface ShopCardProps {
  product: ShopProduct;
  lang: string;
  translations: {
    viewDetails: string;
    priceLabel: string;
  };
}

export function ShopCard({ product, lang, translations }: ShopCardProps) {
  const isRTL = lang === 'ar';
  const localizedName = isRTL ? product.nameAr : product.name;
  const localizedDescription = isRTL ? product.descriptionAr : product.description;
  
  const category = shopCategories.find((c: ShopCategory) => c.name === product.category);
  const categoryColor = category?.color || '#606C38';

  const priceFormatter = new Intl.NumberFormat(isRTL ? 'ar-MA' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/${lang}/shop/${product.slug}`} className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={localizedName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <div className="absolute top-4 left-4">
            <Badge 
              className="bg-white/90 text-slate-900 hover:bg-white border-none uppercase text-xs font-semibold"
              style={{ borderLeft: `4px solid ${categoryColor}` }}
            >
              {product.badge}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <Badge className="bg-[#606C38]/90 text-white hover:bg-[#606C38] border-none text-xs">
            {product.volume}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span 
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="uppercase tracking-wider font-medium">{product.category}</span>
        </div>

        <Link href={`/${lang}/shop/${product.slug}`}>
          <h3 className="text-xl font-playfair font-bold text-slate-900 mb-3 group-hover:text-[#BC6C25] transition-colors line-clamp-2">
            {localizedName}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm line-clamp-3 mb-6">
          {localizedDescription}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              {translations.priceLabel}
            </p>
            <p className="text-xl font-bold text-[#606C38]">
              {priceFormatter.format(product.price)}
            </p>
          </div>

          <Link 
            href={`/${lang}/shop/${product.slug}`}
            className="text-[#BC6C25] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            {translations.viewDetails}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
