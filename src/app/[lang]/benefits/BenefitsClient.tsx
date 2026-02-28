'use client';

import { useState, useMemo } from "react";
import { benefitsData } from "@/data/benefits";
import { BenefitsCard } from "@/components/benefits/BenefitsCard";
import { BlogHero } from "@/components/blog/BlogHero";

interface BenefitsClientProps {
    lang: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    readMoreLabel: string;
}

export function BenefitsClient({ lang, heroTitle, heroSubtitle, searchPlaceholder, readMoreLabel }: BenefitsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const isArabic = lang === "ar";

    const filteredBenefits = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return benefitsData.filter((post) => {
            const baseTitle = post.title.toLowerCase();
            const arTitle = post.title_ar?.toLowerCase() || "";
            const frTitle = post.title_fr?.toLowerCase() || "";
            const matchesTitle =
                baseTitle.includes(query) ||
                arTitle.includes(query) ||
                frTitle.includes(query);

            const baseExcerpt = post.excerpt.toLowerCase();
            const arExcerpt = post.excerpt_ar?.toLowerCase() || "";
            const matchesExcerpt =
                baseExcerpt.includes(query) ||
                arExcerpt.includes(query);
            return matchesTitle || matchesExcerpt;
        });
    }, [searchQuery]);

    return (
        <main className="min-h-screen bg-slate-50/50">
            <BlogHero
                title={heroTitle}
                subtitle={heroSubtitle}
                searchPlaceholder={searchPlaceholder}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                lang={lang}
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
                                    readMore: readMoreLabel,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            {isArabic ? "لا توجد نتائج بحث" : "No results found filtering for"} {searchQuery ? `"${searchQuery}"` : ""}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
