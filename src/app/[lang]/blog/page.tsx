'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getDictionary } from "@/lib/dictionaries";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { FilterSidebar } from "@/components/blog/FilterSidebar";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogEmptyState } from "@/components/blog/BlogEmptyState";
import { getPublishedPosts, getBlogCategories } from "@/lib/blog/actions";
import type { BlogPostFull, BlogCategory } from "@/types/blog";

const POSTS_PER_PAGE = 9;

export default function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [dict, setDict] = useState<Record<string, unknown> | null>(null);
    const [posts, setPosts] = useState<BlogPostFull[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getDictionary(lang, 'blog').then(setDict);
    }, [lang]);

    useEffect(() => {
        getBlogCategories().then(setCategories);
    }, []);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getPublishedPosts({
                page: currentPage,
                pageSize: POSTS_PER_PAGE,
                categoryId: selectedCategory || undefined,
                search: searchTerm || undefined,
            });
            setPosts(result.posts);
            setTotalPages(result.pagination.totalPages || 1);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, selectedCategory, searchTerm]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSearchChange = useCallback((val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    }, []);

    const handleCategoryChange = useCallback((cat: string | null) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSelectedCategory(null);
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    if (!dict) return null;

    return (
        <main className="min-h-screen bg-slate-50/50">
            <BlogHero 
                title={dict.title as string}
                subtitle={dict.subtitle as string}
                searchPlaceholder={dict.searchPlaceholder as string}
                searchValue={searchTerm}
                onSearchChange={handleSearchChange}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 xl:w-1/5 lg:pr-4 xl:pr-6">
                        <FilterSidebar 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                            onClearFilters={handleClearFilters}
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
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <BlogCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {posts.map((post) => (
                                        <BlogCard 
                                            key={post.id} 
                                            post={post} 
                                            lang={lang}
                                            translations={{
                                                readMore: dict.readMore as string,
                                            }}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
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
                                onClear={handleClearFilters}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
