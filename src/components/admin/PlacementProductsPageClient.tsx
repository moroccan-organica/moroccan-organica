'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { SafeImage } from '@/components/ui/safe-image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Search,
    Grid3X3,
    List,
    Pencil,
    Trash2,
    Eye,
    Filter,
    Loader2,
    X,
    SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from '@/components/ui/pagination';
import { ShopProductDB, CategoryDB, ProductPlacement } from '@/types/product';
import {
    deleteProduct as deleteProductAction,
    toggleProductStatus
} from '@/actions/product.actions';
import { ProductFormModalDB } from '@/components/admin/ProductFormModalDB';

interface PlacementProductsPageClientProps {
    initialProducts: ShopProductDB[];
    categories: CategoryDB[];
    totalProducts: number;
    placement: 'topsale' | 'featured';
}

const PLACEMENT_CONFIG = {
    topsale: {
        title: 'Top Sale Products',
        subtitle: 'Manage your best-selling products',
        badge: { label: '🔥 Top Sale', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
        accentColor: '#f97316',
    },
    featured: {
        title: 'Featured Products',
        subtitle: 'Manage your highlighted & featured products',
        badge: { label: '⭐ Featured', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
        accentColor: '#f59e0b',
    },
} as const;

export function PlacementProductsPageClient({
    initialProducts,
    categories,
    totalProducts,
    placement,
}: PlacementProductsPageClientProps) {
    const params = useParams();
    const lang = (params?.lang as string) || 'en';
    const router = useRouter();
    const config = PLACEMENT_CONFIG[placement];

    // Safety-net: only keep products that actually match this placement.
    // Supabase may silently ignore the placement filter if the column doesn't exist yet (no migration).
    const placementProducts = initialProducts.filter(p => p.placement === placement);
    const [products, setProducts] = useState(placementProducts);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
    const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ShopProductDB | null>(null);
    const [page, setPage] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [pageSize, setPageSize] = useState(8);

    const hasActiveFilters = selectedCategory || filterAvailable !== null || filterStock !== 'all';

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory(null);
        setFilterAvailable(null);
        setFilterStock('all');
        setPage(1);
    };

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return products.filter(product => {
            const matchesSearch = !term ||
                (product.name || '').toLowerCase().includes(term) ||
                (product.sku || '').toLowerCase().includes(term) ||
                (product.nameAr || '').toLowerCase().includes(term);

            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            const matchesAvailable = filterAvailable === null || product.isAvailable === filterAvailable;
            const matchesStock =
                filterStock === 'all' ? true :
                    filterStock === 'out' ? product.stock === 0 :
                        filterStock === 'low' ? product.stock > 0 && product.stock <= 5 : true;

            return matchesSearch && matchesCategory && matchesAvailable && matchesStock;
        });
    }, [products, searchTerm, selectedCategory, filterAvailable, filterStock]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredProducts.slice(start, start + pageSize);
    }, [filteredProducts, currentPage, pageSize]);

    const handleEdit = (product: ShopProductDB) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            startTransition(async () => {
                const result = await deleteProductAction(productId);
                if (result.success) {
                    setProducts(prev => prev.filter(p => p.id !== productId));
                } else {
                    alert(result.error || 'Failed to delete product');
                }
            });
        }
    };

    const handleToggle = async (productId: string, field: 'isAvailable' | 'isFeatured' | 'isTopSale', value: boolean) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: value } : p));
        const result = await toggleProductStatus(productId, field, value);
        if (!result.success) {
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: !value } : p));
            alert(result.error || 'Failed to update status');
        }
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleProductSaved = (savedProduct: ShopProductDB) => {
        // Only keep product in list if it still belongs to this placement
        if (savedProduct.placement === placement) {
            if (editingProduct) {
                setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
            } else {
                setProducts(prev => [savedProduct, ...prev]);
            }
        } else {
            // Product was moved to a different placement — remove from this list
            setProducts(prev => prev.filter(p => p.id !== savedProduct.id));
        }
        closeModal();
        router.refresh();
    };

    return (
        <div>
            <AdminHeader title={config.title} subtitle={config.subtitle} />

            <div className="p-6">
                {/* Placement Badge */}
                <div className="mb-6">
                    <span className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border',
                        config.badge.bg, config.badge.text, config.badge.border
                    )}>
                        {config.badge.label}
                        <span className="bg-white/60 text-xs px-2 py-0.5 rounded-full">
                            {products.length} products
                        </span>
                    </span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* Row 1: Search + Category + View + Add */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                    className="pl-10 bg-white"
                                />
                            </div>

                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => { setSelectedCategory(e.target.value || null); setPage(1); }}
                                className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={cn(
                                        'p-2 transition-colors',
                                        viewMode === 'table' ? 'bg-[#606C38] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                                    )}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        'p-2 transition-colors',
                                        viewMode === 'grid' ? 'bg-[#606C38] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                                    )}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                            </div>

                            <Button
                                onClick={handleAddNew}
                                className="bg-[#606C38] hover:bg-[#4a5429] text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Filter chips */}
                    <div className="flex flex-wrap items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />

                        <button
                            onClick={() => { setFilterAvailable(filterAvailable === true ? null : true); setPage(1); }}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                filterAvailable === true
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                            )}
                        >
                            ✓ Active
                        </button>
                        <button
                            onClick={() => { setFilterAvailable(filterAvailable === false ? null : false); setPage(1); }}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                filterAvailable === false
                                    ? 'bg-slate-700 text-white border-slate-700'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-500 hover:text-slate-700'
                            )}
                        >
                            ✕ Inactive
                        </button>

                        <div className="w-px h-4 bg-slate-200" />

                        <button
                            onClick={() => { setFilterStock(filterStock === 'low' ? 'all' : 'low'); setPage(1); }}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                filterStock === 'low'
                                    ? 'bg-yellow-500 text-white border-yellow-500'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-yellow-400 hover:text-yellow-600'
                            )}
                        >
                            ⚠ Low Stock
                        </button>
                        <button
                            onClick={() => { setFilterStock(filterStock === 'out' ? 'all' : 'out'); setPage(1); }}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                filterStock === 'out'
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-red-400 hover:text-red-500'
                            )}
                        >
                            ✕ Out of Stock
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                            >
                                <X className="h-3 w-3" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Products Display */}
                {viewMode === 'table' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Active</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                                    <SafeImage
                                                        src={product.image || '/images/placeholder.svg'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-slate-900 truncate">{product.name}</p>
                                                        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded leading-none">{product.sku}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                                                {product.category}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <Switch
                                                checked={product.isAvailable}
                                                onCheckedChange={(val) => handleToggle(product.id, 'isAvailable', val)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/${lang}/products/${product.slug}`, '_blank')}
                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={isPending}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <Filter className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500">No products found</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="relative h-48">
                                    <SafeImage
                                        src={product.image || '/images/placeholder.svg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => window.open(`/${lang}/products/${product.slug}`, '_blank')}
                                                className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="h-4 w-4 text-slate-600" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isPending}
                                                className="p-2 bg-white rounded-lg shadow hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <Badge variant="secondary" className="mb-2 bg-emerald-50 text-emerald-700">
                                        {product.category}
                                    </Badge>
                                    <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description}</p>
                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Available</span>
                                        <Switch
                                            className="scale-75"
                                            checked={product.isAvailable}
                                            onCheckedChange={(val) => handleToggle(product.id, 'isAvailable', val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination & Summary */}
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-4 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 whitespace-nowrap">Items per page:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                            >
                                {[8, 12, 24, 48, 100].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-sm text-slate-500">
                            Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                            {filteredProducts.length === 0 ? '' : `-${Math.min(currentPage * pageSize, filteredProducts.length)}`}
                            {' '}of {filteredProducts.length} filtered
                        </p>
                    </div>

                    <Pagination className="justify-center md:justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setPage(Math.max(1, currentPage - 1)); }}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <PaginationItem key={idx}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === idx + 1}
                                        onClick={(e) => { e.preventDefault(); setPage(idx + 1); }}
                                    >
                                        {idx + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setPage(Math.min(totalPages, currentPage + 1)); }}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            {/* Product Form Modal */}
            <ProductFormModalDB
                isOpen={isModalOpen}
                onClose={closeModal}
                product={editingProduct}
                categories={categories}
                onSave={handleProductSaved}
                defaultPlacement={placement}
            />
        </div>
    );
}
