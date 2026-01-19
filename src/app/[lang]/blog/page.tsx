'use client';

import React, { useMemo, useState } from 'react';
import { getDictionary } from "@/lib/dictionaries";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { mockBlogPosts, mockCategories } from "@/data/mock-blog";

import { FilterSidebar } from "@/components/blog/FilterSidebar";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogEmptyState } from "@/components/blog/BlogEmptyState";

export default function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;
    
    const [dict, setDict] = useState<Record<string, unknown> | null>(null);

    React.useEffect(() => {
        getDictionary(lang, 'blog').then(setDict);
    }, [lang]);

    const filteredPosts = useMemo(() => {
        return mockBlogPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || post.category_id === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));

    // Ensure current page stays within range when filters/search change
    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    if (!dict) return null;

    return (
        <main className="min-h-screen bg-slate-50/50">
            <BlogHero 
                title={dict.title as string}
                subtitle={dict.subtitle as string}
                searchPlaceholder={dict.searchPlaceholder as string}
                searchValue={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1);
                }}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 xl:w-1/5 lg:pr-4 xl:pr-6">
                        <FilterSidebar 
                            categories={mockCategories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={(cat) => {
                                setSelectedCategory(cat);
                                setCurrentPage(1);
                            }}
                            onClearFilters={() => {
                                setSelectedCategory(null);
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            translations={{
                                title: (dict.filtersLabel as string) || (dict.categories as string),
                                category: (dict.categoryLabel as string) || (dict.category as string),
                                allCategories: dict.allCategories as string,
                                clearFilters: dict.clearFilters as string,
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-3/4 xl:w-4/5">
                        {paginatedPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {paginatedPosts.map((post) => (
                                        <BlogCard 
                                            key={post.id} 
                                            post={post} 
                                            lang={lang}
                                            translations={{
                                                readMore: dict.readMore as string,
                                                by: dict.by as string,
                                                minRead: dict.minRead as string
                                            }}
                                        />
                                    ))}
                                </div>
                                {filteredPosts.length > postsPerPage && (
                                    <div className="flex justify-center pt-10">
                                        <BlogPagination 
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <BlogEmptyState 
                                title={dict.noResults as string}
                                description={dict.subtitle as string}
                                showClearButton={!!selectedCategory || !!searchTerm}
                                clearButtonText={dict.clearFilters as string}
                                onClear={() => {
                                    setSelectedCategory(null);
                                    setSearchTerm('');
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
