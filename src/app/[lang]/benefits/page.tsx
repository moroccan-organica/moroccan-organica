'use client';

import React, { useState, useEffect } from 'react';
import { getDictionary } from "@/lib/dictionaries";
import { benefitsData } from "@/data/benefits";
import { BenefitsCard } from "@/components/benefits/BenefitsCard";
import { BlogHero } from "@/features/blog/components/BlogHero";

export default function BenefitsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [dict, setDict] = useState<Record<string, unknown> | null>(null);
    const [blogDict, setBlogDict] = useState<Record<string, unknown> | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getDictionary(lang, 'common').then(setDict);
        getDictionary(lang, 'blog').then(setBlogDict);
    }, [lang]);

    if (!dict || !blogDict) return null;

    const isArabic = lang === 'ar';

    // Fallbacks if specific keys are missing
    const pageTitle = isArabic ? "فوائد منتجاتنا" : "Our Product Benefits";
    const pageSubtitle = isArabic
        ? "اكتشف الفوائد المذهلة لمكونات التجميل الطبيعية المغربية"
        : "Discover the amazing benefits of Moroccan natural beauty ingredients";
    const searchPlaceholder = blogDict.searchPlaceholder as string || (isArabic ? "بحث..." : "Search...");

    // Filter Logic
    const filteredBenefits = benefitsData.filter(post => {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query) || (post.title_ar && post.title_ar.toLowerCase().includes(query));
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query) || (post.excerpt_ar && post.excerpt_ar.toLowerCase().includes(query));
        return matchesTitle || matchesExcerpt;
    });

    return (
        <main className="min-h-screen bg-slate-50/50">
            <BlogHero
                title={pageTitle}
                subtitle={pageSubtitle}
                searchPlaceholder={searchPlaceholder}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className="container mx-auto px-4 py-12">
                {filteredBenefits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredBenefits.map((post) => (
                            <BenefitsCard
                                key={post.slug}
                                post={post}
                                lang={lang}
                                translations={{
                                    readMore: blogDict.readMore as string || (isArabic ? "اقرأ المزيد" : "Read More"),
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            {isArabic ? "لا توجد نتائج بحث" : "No results found filtering for"} "{searchQuery}"
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
