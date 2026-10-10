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
    <div className="space-y-4 flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <div className="relative rounded-3xl border border-emerald-100/70 bg-white shadow-sm overflow-hidden p-2 sm:p-4 w-fit max-w-full flex items-center justify-center">
          <SafeImage
            src={activeImage}
            alt={alt}
            width={750}
            height={750}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 750px"
            className="w-auto h-auto max-h-[560px] max-w-full object-contain block rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
            priority
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto pb-1 max-w-full" aria-label="Product gallery thumbnails">
          {images.map((img, index) => (
            <button
              key={img + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-white p-1 transition ${index === activeIndex
                  ? 'border-emerald-600 ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:border-emerald-400'
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
