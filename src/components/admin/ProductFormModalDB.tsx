'use client';

import React, { useState, useMemo, useRef, useTransition } from 'react';
import { SafeImage } from '@/components/ui/safe-image';
import { X, Upload, Plus, Trash2, Loader2, Star, ImagePlus, Wand2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ShopProductDB, CategoryDB, CreateProductInput, UpdateProductInput, ProductPlacement } from '@/types/product';
import { createProduct, updateProduct, isSlugUnique } from '@/actions/product.actions';
import { uploadProductImage } from '@/actions/media.actions';
import { cn } from '@/lib/utils';
import { SimpleTiptapEditor } from './SimpleTiptapEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductFormModalDBProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopProductDB | null;
  categories: CategoryDB[];
  onSave?: (product: ShopProductDB) => void;
  defaultPlacement?: ProductPlacement;
}

const getInitialFormData = (product: ShopProductDB | null, categories: CategoryDB[], defaultPlacement: ProductPlacement = 'shop') => {
  const category = categories.find(c => c.name === product?.category);

  // Create unified image list
  const initialImages: { url: string; isPrimary: boolean }[] = [];
  if (product?.image) {
    initialImages.push({ url: product.image, isPrimary: true });
  }
  if (product?.gallery) {
    product.gallery.forEach(url => {
      if (url !== product.image) {
        initialImages.push({ url, isPrimary: false });
      }
    });
  }

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
    images: initialImages,
    notes: product?.notes || [],
    isAvailable: product?.isAvailable ?? true,
    isFeatured: product?.isFeatured ?? false,
    isTopSale: product?.isTopSale ?? false,
    placement: (product?.placement || defaultPlacement) as ProductPlacement,
    sku: product?.sku || '',
    metaTitle: product?.metaTitle || '',
    metaTitleAr: product?.metaTitleAr || '',
    metaTitleFr: product?.metaTitleFr || '',
    metaDesc: product?.metaDesc || '',
    metaDescAr: product?.metaDescAr || '',
    metaDescFr: product?.metaDescFr || '',
    keywords: product?.keywords || '',
    keywordsAr: product?.keywordsAr || '',
    keywordsFr: product?.keywordsFr || '',
    details: product?.details || '',
    detailsAr: product?.detailsAr || '',
    detailsFr: product?.detailsFr || '',
  };
};


export function ProductFormModalDB({ isOpen, onClose, product, categories, onSave, defaultPlacement = 'shop' }: ProductFormModalDBProps) {
  const initialData = useMemo(() => getInitialFormData(product, categories, defaultPlacement), [product, categories, defaultPlacement]);
  const [formData, setFormData] = useState(initialData);
  const [newNote, setNewNote] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const data = getInitialFormData(product, categories, defaultPlacement);
      setFormData(data);
      setNewNote('');
      setError(null);
      setSlugStatus(product ? 'valid' : 'idle');
    }
  }, [isOpen, product, categories, defaultPlacement]);

  const handleSlugCheck = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugStatus('idle');
      return;
    }
    setSlugStatus('checking');
    const isUnique = await isSlugUnique(slug, product?.id);
    setSlugStatus(isUnique ? 'valid' : 'invalid');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugStatus === 'invalid') {
      setError('The product slug is already in use. Please choose a unique slug.');
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        if (product) {
          // Update existing product
          const isShop = formData.placement === 'shop';
          const updateInput: UpdateProductInput = {
            categoryId: formData.categoryId,
            basePrice: isShop ? formData.price : 0,
            sku: formData.sku,
            stock: isShop ? formData.stock : 0,
            isAvailable: formData.isAvailable,
            isFeatured: formData.isFeatured,
            isTopSale: formData.isTopSale,
            placement: formData.placement,
            translations: [
              {
                language: 'en',
                name: formData.name,
                description: formData.description,
                details: formData.details,
                slug: formData.slug,
                metaTitle: formData.metaTitle || undefined,
                metaDesc: formData.metaDesc || undefined,
                keywords: formData.keywords || undefined,
              },
              {
                language: 'ar',
                name: formData.nameAr,
                description: formData.descriptionAr,
                details: formData.detailsAr,
                slug: formData.slug + '-ar',
                metaTitle: formData.metaTitleAr || undefined,
                metaDesc: formData.metaDescAr || undefined,
                keywords: formData.keywordsAr || undefined,
              },
              {
                language: 'fr',
                name: formData.nameFr,
                description: formData.descriptionFr,
                details: formData.detailsFr,
                slug: formData.slug + '-fr',
                metaTitle: formData.metaTitleFr || undefined,
                metaDesc: formData.metaDescFr || undefined,
                keywords: formData.keywordsFr || undefined,
              },
            ],
            images: formData.images.map(img => ({
              url: img.url,
              isPrimary: img.isPrimary
            })),

            variants: isShop && formData.volume ? [
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
          const isShop = formData.placement === 'shop';
          const createInput: CreateProductInput = {
            categoryId: formData.categoryId,
            basePrice: isShop ? formData.price : 0,
            sku: formData.sku || `SKU-${Date.now()}`,
            stock: isShop ? formData.stock : 0,
            isAvailable: formData.isAvailable,
            isFeatured: formData.isFeatured,
            isTopSale: formData.isTopSale,
            placement: formData.placement,
            translations: [
              {
                language: 'en',
                name: formData.name,
                description: formData.description,
                details: formData.details,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                metaTitle: formData.metaTitle || undefined,
                metaDesc: formData.metaDesc || undefined,
                keywords: formData.keywords || undefined,
              },
              {
                language: 'ar',
                name: formData.nameAr || formData.name,
                description: formData.descriptionAr || formData.description,
                details: formData.detailsAr || formData.details,
                slug: (formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')) + '-ar',
                metaTitle: formData.metaTitleAr || undefined,
                metaDesc: formData.metaDescAr || undefined,
                keywords: formData.keywordsAr || undefined,
              },
              {
                language: 'fr',
                name: formData.nameFr || formData.name,
                description: formData.descriptionFr || formData.description,
                details: formData.detailsFr || formData.details,
                slug: (formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')) + '-fr',
                metaTitle: formData.metaTitleFr || undefined,
                metaDesc: formData.metaDescFr || undefined,
                keywords: formData.keywordsFr || undefined,
              },
            ],
            images: formData.images.map(img => ({
              url: img.url,
              isPrimary: img.isPrimary
            })),

            variants: isShop && formData.volume ? [
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

  const handleAddImageFile = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const result = await uploadProductImage(uploadFormData);

      if (!result.success) {
        setError(result.error || 'Failed to upload image');
        return;
      }

      setFormData(prev => {
        const hasPrimary = prev.images.some(img => img.isPrimary);
        return {
          ...prev,
          images: [...prev.images, { url: result.url!, isPrimary: !hasPrimary }]
        };
      });
      setError(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If we removed the primary, set the first one as primary
      if (prev.images[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
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

            {/* 1. Global Administrative & Global Info */}
            <fieldset className="border-2 border-[#606C38] rounded-xl p-6 bg-white shadow-sm">
              <legend className="text-lg font-bold text-[#606C38] px-3 bg-white ml-2 rounded-full border border-[#606C38] text-sm uppercase tracking-wide">
                Settings & Logistics
              </legend>

              {/* Placement Selector */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Product Type / Placement
                </label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-inner">
                  {([
                    { value: 'shop', label: '🛒 Shop', desc: 'Main Store' },
                    { value: 'topsale', label: '🔥 Top Sale', desc: 'Best Seller' },
                    { value: 'featured', label: '⭐ Featured', desc: 'Hero Slide' },
                    { value: 'catalogue', label: '📖 Organica', desc: 'Full Collection' },
                  ] as { value: ProductPlacement; label: string; desc: string }[]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, placement: opt.value }))}
                      className={cn(
                        'flex-1 flex flex-col items-center py-2.5 px-2 text-xs font-semibold transition-all border-r last:border-r-0 border-slate-200',
                        formData.placement === opt.value
                          ? 'bg-[#606C38] text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <span>{opt.label}</span>
                      <span className={cn('text-[9px] font-normal mt-0.5 opacity-70')}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#606C38] outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {formData.placement === 'shop' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Price (USD)</label>
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
                      <label className="block text-sm font-bold text-slate-700 mb-2">Stock Inventory</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-50">
                {formData.placement === 'shop' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Volume/Size</label>
                    <Input
                      value={formData.volume}
                      onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                      placeholder="e.g., 5 L"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Visual Badge</label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g., New"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-lg border border-slate-100">
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                />
                <label htmlFor="isAvailable" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Product is Available for Purchase
                </label>
              </div>
            </fieldset>

            {/* 2. Unified Content Tabs */}
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-slate-200" />
              <div className="relative flex justify-center">
                <span className="bg-[#f8f9fa] px-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                  Localized Product Content
                </span>
              </div>
            </div>

            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-slate-200 p-1 h-14 rounded-xl shadow-sm">
                <TabsTrigger value="en" className="text-sm font-bold data-[state=active]:bg-[#606C38] data-[state=active]:text-white transition-all rounded-lg">
                  🇬🇧 English
                </TabsTrigger>
                <TabsTrigger value="ar" className="text-sm font-bold data-[state=active]:bg-[#606C38] data-[state=active]:text-white transition-all rounded-lg">
                  🇲🇦 Arabic / العربية
                </TabsTrigger>
                <TabsTrigger value="fr" className="text-sm font-bold data-[state=active]:bg-[#606C38] data-[state=active]:text-white transition-all rounded-lg">
                  🇫🇷 French / Français
                </TabsTrigger>
              </TabsList>

              {/* English Content */}
              <TabsContent value="en" className="space-y-6">
                <fieldset className="border-2 border-[#606C38] rounded-xl p-6 bg-white space-y-6 shadow-sm">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Display name in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug (URL identifier)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={formData.slug}
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            setFormData(prev => ({ ...prev, slug: val }));
                            handleSlugCheck(val);
                          }}
                          placeholder="product-unique-identifier"
                          className={cn(
                            "pr-10",
                            slugStatus === 'valid' && "border-green-500 focus:ring-green-500",
                            slugStatus === 'invalid' && "border-red-500 focus:ring-red-500"
                          )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {slugStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                          {slugStatus === 'valid' && <Check className="h-4 w-4 text-green-500" />}
                          {slugStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newSlug = generateSlug(formData.name);
                          setFormData(prev => ({ ...prev, slug: newSlug }));
                          handleSlugCheck(newSlug);
                        }}
                        className="shrink-0 border-[#606C38] text-[#606C38] hover:bg-[#606C38] hover:text-white"
                        title="Generate from name"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                    {slugStatus === 'invalid' && (
                      <p className="mt-1 text-xs text-red-500 font-medium italic">This slug is already taken. Please try another one.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Short Preview Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-20 px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#606C38] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rich-Text Content & Story</label>
                    <SimpleTiptapEditor
                      content={formData.details}
                      onChange={(html) => setFormData(prev => ({ ...prev, details: html }))}
                    />
                  </div>
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-black uppercase text-[#D4A373] tracking-wider">SEO Metadata (English)</h4>
                    <div className="grid gap-4">
                      <Input
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="SEO Meta Title"
                      />
                      <textarea
                        value={formData.metaDesc}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDesc: e.target.value }))}
                        placeholder="SEO Meta Description"
                        className="w-full h-16 px-4 py-2 rounded-lg border border-slate-200 text-xs outline-none"
                      />
                      <Input
                        value={formData.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="Keywords (e.g. argan, organic, morocco)"
                      />
                    </div>
                  </div>
                </fieldset>
              </TabsContent>

              {/* Arabic Content */}
              <TabsContent value="ar" className="space-y-6">
                <fieldset className="border-2 border-[#606C38] rounded-xl p-6 bg-white space-y-6 shadow-sm" dir="rtl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 text-right">اسم المنتج</label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder="الاسم باللغة العربية"
                      className="text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 text-right">وصف قصير</label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                      className="w-full h-20 px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#606C38] outline-none text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 text-right">محتوى غني وقصة المنتج</label>
                    <SimpleTiptapEditor
                      content={formData.detailsAr}
                      onChange={(html) => setFormData(prev => ({ ...prev, detailsAr: html }))}
                      dir="rtl"
                    />
                  </div>
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-black uppercase text-[#D4A373] tracking-wider text-right">بيانات تحسين محركات البحث SEO (العربية)</h4>
                    <div className="grid gap-4">
                      <Input
                        value={formData.metaTitleAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitleAr: e.target.value }))}
                        placeholder="عنوان SEO"
                        className="text-right"
                      />
                      <textarea
                        value={formData.metaDescAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescAr: e.target.value }))}
                        placeholder="وصف SEO"
                        className="w-full h-16 px-4 py-2 rounded-lg border border-slate-200 text-xs outline-none text-right"
                      />
                      <Input
                        value={formData.keywordsAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywordsAr: e.target.value }))}
                        placeholder="الكلمات المفتاحية"
                        className="text-right"
                      />
                    </div>
                  </div>
                </fieldset>
              </TabsContent>

              {/* French Content */}
              <TabsContent value="fr" className="space-y-6">
                <fieldset className="border-2 border-[#606C38] rounded-xl p-6 bg-white space-y-6 shadow-sm">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom du produit</label>
                    <Input
                      value={formData.nameFr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameFr: e.target.value }))}
                      placeholder="Nom en français"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description courte</label>
                    <textarea
                      value={formData.descriptionFr}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionFr: e.target.value }))}
                      className="w-full h-20 px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#606C38] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contenu riche et histoire du produit</label>
                    <SimpleTiptapEditor
                      content={formData.detailsFr}
                      onChange={(html) => setFormData(prev => ({ ...prev, detailsFr: html }))}
                    />
                  </div>
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-black uppercase text-[#D4A373] tracking-wider">Métadonnées SEO (Français)</h4>
                    <div className="grid gap-4">
                      <Input
                        value={formData.metaTitleFr}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitleFr: e.target.value }))}
                        placeholder="Titre SEO Meta"
                      />
                      <textarea
                        value={formData.metaDescFr}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescFr: e.target.value }))}
                        placeholder="Description SEO Meta"
                        className="w-full h-16 px-4 py-2 rounded-lg border border-slate-200 text-xs outline-none"
                      />
                      <Input
                        value={formData.keywordsFr}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywordsFr: e.target.value }))}
                        placeholder="Mots-clés"
                      />
                    </div>
                  </div>
                </fieldset>
              </TabsContent>
            </Tabs>

            {/* Media Gallery */}
            <fieldset className="border-2 border-[#606C38] rounded-xl p-6 bg-white shadow-sm">
              <legend className="text-lg font-bold text-[#606C38] px-3 bg-white ml-2 rounded-full border border-[#606C38] text-sm">Media Gallery</legend>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Upload Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#606C38] hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="p-2 rounded-full bg-slate-50 group-hover:bg-[#606C38]/10 transition-colors">
                    <ImagePlus className="h-6 w-6 text-slate-400 group-hover:text-[#606C38]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#606C38] uppercase">Add Media</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => handleAddImageFile(e.target.files)}
                  />
                </button>

                {/* Image List */}
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all group",
                      img.isPrimary ? "border-[#606C38] shadow-md shadow-[#606C38]/10" : "border-slate-100"
                    )}
                  >
                    <SafeImage
                      src={img.url}
                      alt={`Product ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          img.isPrimary ? "bg-[#606C38] text-white" : "bg-white text-slate-400 hover:text-[#D4A373]"
                        )}
                        title={img.isPrimary ? "Primary Image" : "Set as Primary"}
                      >
                        <Star className={cn("h-4 w-4", img.isPrimary && "fill-current")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {img.isPrimary && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#606C38] text-white text-[8px] font-bold uppercase rounded-sm flex items-center gap-1 shadow-sm">
                        <Star className="h-2 w-2 fill-current" />
                        Main
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
