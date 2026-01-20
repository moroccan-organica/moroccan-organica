'use client';

import React, { useMemo, useState } from 'react';
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopCard } from "@/components/shop/ShopCard";
import { FilterSidebar } from "@/components/blog/FilterSidebar";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogEmptyState } from "@/components/blog/BlogEmptyState";
import { ShopProductDB, CategoryDB } from '@/types/product';

interface ShopPageClientProps {
    lang: string;
    initialProducts: ShopProductDB[];
    categories: CategoryDB[];
    dict: Record<string, unknown>;
}

export function ShopPageClient({ 
    lang, 
    initialProducts, 
    categories,
    dict 
}: ShopPageClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const localizedName = lang === 'ar' ? product.nameAr : product.name;
            const localizedDesc = lang === 'ar' ? product.descriptionAr : product.description;
            const matchesSearch = localizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                localizedDesc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || product.id === selectedCategory || 
                categories.find(c => c.id === selectedCategory)?.name === product.category;
            return matchesSearch && matchesCategory;
        });
    }, [initialProducts, searchTerm, selectedCategory, lang, categories]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const categoriesForFilter = categories.map(cat => ({
        id: cat.id,
        name: lang === 'ar' ? cat.nameAr : cat.name,
        slug: cat.slug,
        color: '#606C38',
    }));

    // Convert ShopProductDB to ShopProduct format for ShopCard
    const convertToShopProduct = (product: ShopProductDB) => ({
        id: product.id,
        slug: product.slug,
        category: product.category,
        image: product.image,
        gallery: product.gallery,
        badge: product.badge,
        volume: product.volume,
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        notes: product.notes,
        price: product.price,
        stockQuantity: product.stock,
    });

    return (
        <main className="min-h-screen bg-slate-50/50">
            <ShopHero 
                title={dict.title as string}
                subtitle={dict.subtitle as string}
                searchPlaceholder={dict.searchPlaceholder as string || "Search products..."}
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
                            categories={categoriesForFilter}
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
                                title: dict.filtersLabel as string || "Filters",
                                category: dict.categoryLabel as string || "Category",
                                allCategories: dict.allCategories as string || "All Products",
                                clearFilters: dict.clearFilters as string || "Clear Filters",
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-3/4 xl:w-4/5">
                        {paginatedProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {paginatedProducts.map((product) => (
                                        <ShopCard 
                                            key={product.id} 
                                            product={convertToShopProduct(product)} 
                                            lang={lang}
                                            translations={{
                                                viewDetails: dict.viewDetails as string,
                                                priceLabel: dict.priceLabel as string,
                                            }}
                                        />
                                    ))}
                                </div>
                                {filteredProducts.length > productsPerPage && (
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
                                title={dict.noResults as string || "No products found"}
                                description={dict.subtitle as string}
                                showClearButton={!!selectedCategory || !!searchTerm}
                                clearButtonText={dict.clearFilters as string || "Clear Filters"}
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
