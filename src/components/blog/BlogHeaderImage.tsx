'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BlogHeaderImageProps {
    src: string;
    alt: string;
    defaultImage?: string;
}

export function BlogHeaderImage({
    src,
    alt,
    defaultImage = '/images/placeholder.svg'
}: BlogHeaderImageProps) {
    const [imgSrc, setImgSrc] = useState(src || defaultImage);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            priority
            onError={() => setImgSrc(defaultImage)}
        />
    );
}
