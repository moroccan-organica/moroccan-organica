'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Pencil,
  Trash2,
  Eye,
  Filter
} from 'lucide-react';
import { shopCategories, ShopProduct } from '@/data/shop-products';
import { cn } from '@/lib/utils';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { useProducts } from '@/contexts/ProductsContext';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleEdit = (product: ShopProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleSaveProduct = (productData: Partial<ShopProduct>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData as Omit<ShopProduct, 'id'>);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <AdminHeader title="Products" subtitle="Manage your product catalog" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
            >
              <option value="">All Categories</option>
              {shopCategories.map((cat) => (
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

        {/* Products Display */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${shopCategories.find(c => c.name === product.category)?.color}20`,
                          color: shopCategories.find(c => c.name === product.category)?.color
                        }}
                      >
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.volume}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#606C38]">${product.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/en/shop/${product.slug}`, '_blank')}
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
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900">
                      {product.badge}
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-white rounded-lg shadow hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Badge 
                    variant="secondary"
                    className="mb-2"
                    style={{ 
                      backgroundColor: `${shopCategories.find(c => c.name === product.category)?.color}20`,
                      color: shopCategories.find(c => c.name === product.category)?.color
                    }}
                  >
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#606C38]">${product.price}</span>
                    <span className="text-sm text-slate-400">{product.volume}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
