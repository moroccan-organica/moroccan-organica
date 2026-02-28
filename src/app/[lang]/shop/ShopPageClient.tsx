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

    // Calculate max price from products
    const calculatedMaxPrice = useMemo(() => {
        if (initialProducts.length === 0) return 1000;
        return Math.ceil(Math.max(...initialProducts.map(p => p.price || 0)));
    }, [initialProducts]);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);

    // Update max price when products change
    React.useEffect(() => {
        setMaxPrice(calculatedMaxPrice);
    }, [calculatedMaxPrice]);

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return initialProducts.filter(product => {
            // Smart search: check all languages and SKU
            const matchesSearch = !term ||
                (product.name || '').toLowerCase().includes(term) ||
                (product.description || '').toLowerCase().includes(term) ||
                (product.nameAr || '').toLowerCase().includes(term) ||
                (product.descriptionAr || '').toLowerCase().includes(term) ||
                (product.nameFr || '').toLowerCase().includes(term) ||
                (product.descriptionFr || '').toLowerCase().includes(term) ||
                (product.sku || '').toLowerCase().includes(term);

            const matchesCategory = !selectedCategory || product.id === selectedCategory ||
                categories.find(c => c.id === selectedCategory)?.name === product.category;
            const productPrice = product.price || 0;
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [initialProducts, searchTerm, selectedCategory, minPrice, maxPrice, categories]);

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
        name: lang === 'ar' ? (cat.nameAr || cat.name) : lang === 'fr' ? (cat.nameFr || cat.name) : cat.name,
        slug: cat.slug,
        color: 'var(--primary)',
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
                                setMinPrice(0);
                                setMaxPrice(calculatedMaxPrice);
                                setCurrentPage(1);
                            }}
                            searchValue={searchTerm}
                            onSearchChange={(val) => {
                                setSearchTerm(val);
                                setCurrentPage(1);
                            }}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onPriceChange={(min, max) => {
                                setMinPrice(min);
                                setMaxPrice(max);
                                setCurrentPage(1);
                            }}
                            translations={{
                                title: dict.filtersLabel as string || "Filters",
                                category: dict.categoryLabel as string || "Category",
                                allCategories: dict.allCategories as string || "All Products",
                                clearFilters: dict.clearFilters as string || "Clear Filters",
                                search: dict.searchPlaceholder as string || "Search products...",
                                price: dict.priceLabel as string || "Price",
                                minPrice: dict.minPrice as string || "Min Price",
                                maxPrice: dict.maxPrice as string || "Max Price",
                                from: dict.from as string || "From",
                                to: dict.to as string || "to",
                                go: dict.go as string || "Go",
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
