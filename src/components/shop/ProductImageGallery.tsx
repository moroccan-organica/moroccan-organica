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
      <div className="relative h-[460px] rounded-3xl border border-emerald-50 bg-white shadow-md overflow-hidden">
        <SafeImage
          src={activeImage}
          alt={alt}
          fill
          className="object-cover"
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
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition ${
                index === activeIndex
                  ? 'border-emerald-500 ring-2 ring-emerald-200'
                  : 'border-emerald-100 hover:border-emerald-300'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <SafeImage
                src={img}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
