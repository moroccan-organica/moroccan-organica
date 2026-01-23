'use client';

import React, { useState, useMemo, useRef, useTransition } from 'react';
import { SafeImage } from '@/components/ui/safe-image';
import { X, Upload, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShopProductDB, CategoryDB, CreateProductInput, UpdateProductInput } from '@/types/product';
import { createProduct, updateProduct } from '@/actions/product.actions';

interface ProductFormModalDBProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopProductDB | null;
  categories: CategoryDB[];
  onSave?: (product: ShopProductDB) => void;
}

const getInitialFormData = (product: ShopProductDB | null, categories: CategoryDB[]) => {
  const category = categories.find(c => c.name === product?.category);
  return {
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    nameFr: product?.nameFr || '',
    slug: product?.slug || '',
    categoryId: category?.id || '',
    description: product?.description || '',
    descriptionAr: product?.descriptionAr || '',
    descriptionFr: product?.descriptionFr || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    volume: product?.volume || '',
    badge: product?.badge || '',
    image: product?.image || '',
    gallery: product?.gallery || [],
    notes: product?.notes || [],
    isAvailable: product?.isAvailable ?? true,
    isFeatured: product?.isFeatured ?? false,
    isTopSale: product?.isTopSale ?? false,
    sku: product?.sku || '',
  };
};

export function ProductFormModalDB({ isOpen, onClose, product, categories, onSave }: ProductFormModalDBProps) {
  const initialData = useMemo(() => getInitialFormData(product, categories), [product, categories]);
  const [formData, setFormData] = useState(initialData);
  const [newNote, setNewNote] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const [galleryImageCount, setGalleryImageCount] = useState(product?.gallery?.length || 2);
  const [galleryImages, setGalleryImages] = useState<string[]>(product?.gallery || []);
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const data = getInitialFormData(product, categories);
      setFormData(data);
      setNewNote('');
      setError(null);
      const galleryLength = product?.gallery?.length || 2;
      setGalleryImageCount(galleryLength);
      setGalleryImages(product?.gallery || Array(galleryLength).fill(''));
      galleryInputRefs.current = Array(galleryLength).fill(null).map(() => null);
    }
  }, [isOpen, product, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (product) {
          // Update existing product
          const updateInput: UpdateProductInput = {
            categoryId: formData.categoryId,
            basePrice: formData.price,
            sku: formData.sku,
            stock: formData.stock,
            isAvailable: formData.isAvailable,
            isFeatured: formData.isFeatured,
            isTopSale: formData.isTopSale,
            translations: [
              {
                language: 'en',
                name: formData.name,
                description: formData.description,
                slug: formData.slug,
              },
              {
                language: 'ar',
                name: formData.nameAr,
                description: formData.descriptionAr,
                slug: formData.slug + '-ar',
              },
              {
                language: 'fr',
                name: formData.nameFr,
                description: formData.descriptionFr,
                slug: formData.slug + '-fr',
              },
            ],
            images: [
              ...(formData.image && !formData.image.startsWith('data:') && !formData.image.startsWith('blob:') 
                ? [{ url: formData.image, isPrimary: true }] 
                : []),
              ...(galleryImages.filter(img => img && !img.startsWith('data:') && !img.startsWith('blob:')).map(url => ({ url, isPrimary: false })))
            ],
            variants: formData.volume ? [
              {
                sku: formData.sku + '-default',
                sizeName: formData.volume,
                price: formData.price,
                stock: formData.stock,
              }
            ] : [],
          };

          const result = await updateProduct(product.id, updateInput);
          if (result.success && result.product) {
            onSave?.(result.product);
          } else {
            setError(result.error || 'Failed to update product');
          }
        } else {
          // Create new product
          const createInput: CreateProductInput = {
            categoryId: formData.categoryId,
            basePrice: formData.price,
            sku: formData.sku || `SKU-${Date.now()}`,
            stock: formData.stock,
            isAvailable: formData.isAvailable,
            isFeatured: formData.isFeatured,
            isTopSale: formData.isTopSale,
            translations: [
              {
                language: 'en',
                name: formData.name,
                description: formData.description,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
              },
              {
                language: 'ar',
                name: formData.nameAr || formData.name,
                description: formData.descriptionAr || formData.description,
                slug: (formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')) + '-ar',
              },
              {
                language: 'fr',
                name: formData.nameFr || formData.name,
                description: formData.descriptionFr || formData.description,
                slug: (formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')) + '-fr',
              },
            ],
            images: [
              ...(formData.image && !formData.image.startsWith('data:') && !formData.image.startsWith('blob:') 
                ? [{ url: formData.image, isPrimary: true }] 
                : []),
              ...(galleryImages.filter(img => img && !img.startsWith('data:') && !img.startsWith('blob:')).map(url => ({ url, isPrimary: false })))
            ],
            variants: formData.volume ? [
              {
                sku: (formData.sku || `SKU-${Date.now()}`) + '-default',
                sizeName: formData.volume,
                price: formData.price,
                stock: formData.stock,
              }
            ] : [],
          };

          const result = await createProduct(createInput);
          if (result.success && result.product) {
            onSave?.(result.product);
          } else {
            setError(result.error || 'Failed to create product');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setFormData(prev => ({
        ...prev,
        notes: [...prev.notes, newNote.trim()]
      }));
      setNewNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleMainImageFile = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      // Upload image to server
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || 'Failed to upload image');
        return;
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
      setError(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    }
  };

  const handleClearMainImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const handleGalleryImageCountChange = (count: number) => {
    const newCount = Math.max(0, Math.min(10, count)); // Limit between 0 and 10
    setGalleryImageCount(newCount);
    
    // Adjust gallery images array
    if (newCount > galleryImages.length) {
      setGalleryImages([...galleryImages, ...Array(newCount - galleryImages.length).fill('')]);
      galleryInputRefs.current = [...galleryInputRefs.current, ...Array(newCount - galleryInputRefs.current.length).fill(null)];
    } else if (newCount < galleryImages.length) {
      setGalleryImages(galleryImages.slice(0, newCount));
      galleryInputRefs.current = galleryInputRefs.current.slice(0, newCount);
    }
  };

  const handleGalleryImageFile = async (fileList: FileList | null, index: number) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      // Upload image to server
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || 'Failed to upload image');
        return;
      }

      const data = await response.json();
      const newGalleryImages = [...galleryImages];
      newGalleryImages[index] = data.url;
      setGalleryImages(newGalleryImages);
      setFormData(prev => ({ ...prev, gallery: newGalleryImages }));
      setError(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    }
  };

  const handleClearGalleryImage = (index: number) => {
    const newGalleryImages = [...galleryImages];
    newGalleryImages[index] = '';
    setGalleryImages(newGalleryImages);
    setFormData(prev => ({ ...prev, gallery: newGalleryImages }));
    if (galleryInputRefs.current[index]) {
      galleryInputRefs.current[index]!.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#f8f9fa] rounded-2xl shadow-2xl w-[95vw] max-w-4xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-[#606C38]">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* General Product Information */}
            <fieldset className="border-2 border-[#606C38] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#606C38] px-2">General Product Information</legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Product Name (English)
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      }));
                    }}
                    placeholder="e.g., Moroccan Argan Oil"
                    required
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    اسم المنتج (Arabic)
                  </label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="زيت الأركان المغربي"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description..."
                    className="w-full h-24 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38] resize-none"
                    required
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الوصف (Arabic)
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder="وصف المنتج..."
                    className="w-full h-24 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38] resize-none"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Price (USD)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Stock
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    SKU
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="e.g., ARG-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#606C38]"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Volume/Size
                  </label>
                  <Input
                    value={formData.volume}
                    onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                    placeholder="e.g., 5 L - 1.32 GAL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Badge
                  </label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g., bestseller"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="w-4 h-4 text-[#606C38] rounded focus:ring-[#606C38]"
                  />
                  <span className="text-sm text-slate-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-[#606C38] rounded focus:ring-[#606C38]"
                  />
                  <span className="text-sm text-slate-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTopSale}
                    onChange={(e) => setFormData(prev => ({ ...prev, isTopSale: e.target.checked }))}
                    className="w-4 h-4 text-[#606C38] rounded focus:ring-[#606C38]"
                  />
                  <span className="text-sm text-slate-700">Top Sale</span>
                </label>
              </div>
            </fieldset>

            {/* Main Image */}
            <fieldset className="border-2 border-[#606C38] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#606C38] px-2">Main Image</legend>
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={mainImageInputRef}
                  onChange={(e) => handleMainImageFile(e.target.files)}
                />
                <div className="flex gap-3">
                  <Input
                    value={formData.image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL or upload file"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => mainImageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                {formData.image && (
                  <div className="mt-3 relative inline-block">
                    <SafeImage
                      src={formData.image}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleClearMainImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </fieldset>

            {/* Product Images */}
            <fieldset className="border-2 border-[#606C38] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#606C38] px-2">Product Images</legend>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Number of Images
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={galleryImageCount}
                    onChange={(e) => handleGalleryImageCountChange(parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: galleryImageCount }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">
                      Image {index + 1}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => {
                        galleryInputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleGalleryImageFile(e.target.files, index)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 justify-start"
                        onClick={() => galleryInputRefs.current[index]?.click()}
                      >
                        {galleryImages[index] ? 'File selected' : 'Choisir un fichier'}
                      </Button>
                      {galleryImages[index] && (
                        <button
                          type="button"
                          onClick={() => handleClearGalleryImage(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {!galleryImages[index] && (
                      <p className="text-xs text-slate-500">Aucun fichier choisi</p>
                    )}
                    {galleryImages[index] && (
                      <div className="mt-2 relative inline-block">
                        <SafeImage
                          src={galleryImages[index]}
                          alt={`Gallery ${index + 1}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Product Features */}
            <fieldset className="border-2 border-[#606C38] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#606C38] px-2">Product Features</legend>
              
              <div className="flex gap-3 mb-3">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a feature..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNote())}
                />
                <Button type="button" variant="outline" onClick={handleAddNote} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.notes.map((note, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(index)}
                      className="hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </fieldset>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#606C38] hover:bg-[#4a5429] text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                product ? 'Update Product' : 'Add Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
