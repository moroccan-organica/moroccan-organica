'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDictionary } from "@/lib/dictionaries";
import { benefitsData } from "@/data/benefits";
import { BenefitsContent } from "@/components/benefits/BenefitsContent";
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function BenefitPostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = React.use(params);
    const [blogDict, setBlogDict] = useState<Record<string, unknown> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Find post
    const post = benefitsData.find(p => p.slug === slug);

    useEffect(() => {
        getDictionary(lang, 'blog').then(setBlogDict);
        setIsLoading(false);
    }, [lang]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#606C38]" />
            </main>
        );
    }

    if (!post) {
        return notFound();
    }

    if (!blogDict) return null;

    const isArabic = lang === 'ar';
    const title = isArabic && post.title_ar ? post.title_ar : post.title;
    const content = isArabic && post.content_ar ? post.content_ar : post.content;

    return (
        <main className="min-h-screen bg-white">
            {/* Post Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full">
                <Image
                    src={post.image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end pb-20">
                    <div className="container mx-auto px-4">
                        <div className={`max-w-4xl ${isArabic ? 'text-right mr-auto ml-0' : ''}`}>
                            <Link
                                href={`/${lang}/benefits`}
                                className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ${isArabic ? 'flex-row-reverse' : ''}`}
                            >
                                <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                                {isArabic ? "عودة" : "Back to Benefits"}
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4 leading-tight" dir={isArabic ? 'rtl' : 'ltr'}>
                                {title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col gap-16 justify-center items-center">
                    {/* Main Content */}
                    <article className={`max-w-3xl w-full ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                        <BenefitsContent content={content} />
                    </article>
                </div>
            </div>
        </main>
    );
}
