'use client';

import { SafeImage } from '@/components/ui/safe-image';
import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full rounded-3xl border border-emerald-100/80 bg-white shadow-sm overflow-hidden p-3 sm:p-6 flex items-center justify-center group">
        <SafeImage
          src={activeImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
          className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Product gallery thumbnails">
          {images.map((img, index) => (
            <button
              key={img + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 aspect-square shrink-0 overflow-hidden rounded-2xl border p-1 bg-white transition ${index === activeIndex
                  ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
                  : 'border-emerald-100 hover:border-emerald-300'
                }`}
              aria-label={`View image ${index + 1}`}
            >
              <SafeImage
                src={img}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
