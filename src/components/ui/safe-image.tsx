'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

/**
 * SafeImage component that handles:
 * - Data URLs (base64 images) with native img tag
 * - Broken/404 images with fallback
 * - External URLs with Next.js Image
 */
export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/placeholder.svg',
  fill,
  sizes,
  ...props 
}: SafeImageProps) {
  const [errorKey, setErrorKey] = useState<string | null>(null);

  // Derive the current source - if this src had an error, use fallback
  const currentSrc = useMemo(() => {
    const srcString = typeof src === 'string' ? src : String(src);
    if (errorKey === srcString) {
      return fallbackSrc;
    }
    return src;
  }, [src, errorKey, fallbackSrc]);

  // Check if the source is a data URL (base64) or blob URL
  const isDataUrl = typeof currentSrc === 'string' && currentSrc.startsWith('data:');
  const isBlobUrl = typeof currentSrc === 'string' && currentSrc.startsWith('blob:');

  // Default sizes prop for fill images
  const defaultSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  const handleError = useCallback(() => {
    const srcString = typeof src === 'string' ? src : String(src);
    if (errorKey !== srcString) {
      setErrorKey(srcString);
    }
  }, [src, errorKey]);

  // For data URLs and blob URLs, use native img tag to avoid Next.js optimization issues
  if (isDataUrl || isBlobUrl) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={typeof currentSrc === 'string' ? currentSrc : ''}
          alt={alt}
          onError={handleError}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
            objectFit: 'cover',
          }}
          className={props.className}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof currentSrc === 'string' ? currentSrc : ''}
        alt={alt}
        onError={handleError}
        width={typeof props.width === 'number' ? props.width : undefined}
        height={typeof props.height === 'number' ? props.height : undefined}
        className={props.className}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      fill={fill}
      sizes={fill ? (sizes || defaultSizes) : sizes}
      onError={handleError}
    />
  );
}
