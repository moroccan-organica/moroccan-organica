'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShopProduct, ProductDescription, shopCategories } from '@/data/shop-products';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopProduct | null;
  onSave?: (product: Partial<ShopProduct>) => void;
}

const emptyDescription: ProductDescription = {
  label: '',
  labelAr: '',
  description: '',
  descriptionAr: '',
};

const getInitialFormData = (product: ShopProduct | null) => ({
  name: product?.name || '',
  nameAr: product?.nameAr || '',
  slug: product?.slug || '',
  category: product?.category || '',
  description: product?.description || '',
  descriptionAr: product?.descriptionAr || '',
  price: product?.price || 0,
  stockQuantity: product?.stockQuantity || 0,
  volume: product?.volume || '',
  badge: product?.badge || '',
  image: product?.image || '',
  gallery: product?.gallery || [],
  notes: product?.notes || [],
  productDescriptions: product?.productDescriptions || [],
});

export function ProductFormModal({ isOpen, onClose, product, onSave }: ProductFormModalProps) {
  const initialData = useMemo(() => getInitialFormData(product), [product]);
  const [formData, setFormData] = useState(initialData);
  const [newNote, setNewNote] = useState('');
  const [descriptionCount, setDescriptionCount] = useState(product?.productDescriptions?.length || 0);
  const [imageCount, setImageCount] = useState(product?.gallery?.length || 0);
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const data = getInitialFormData(product);
      setFormData(data);
      setNewNote('');
      setDescriptionCount(product?.productDescriptions?.length || 0);
      setImageCount(product?.gallery?.length || 0);
    }
  }, [isOpen, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
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

  const handleDescriptionCountChange = (count: number) => {
    const newCount = Math.max(0, count);
    setDescriptionCount(newCount);
    
    setFormData(prev => {
      const currentDescriptions = [...prev.productDescriptions];
      if (newCount > currentDescriptions.length) {
        for (let i = currentDescriptions.length; i < newCount; i++) {
          currentDescriptions.push({ ...emptyDescription });
        }
      } else {
        currentDescriptions.length = newCount;
      }
      return { ...prev, productDescriptions: currentDescriptions };
    });
  };

  const handleImageCountChange = (count: number) => {
    const newCount = Math.max(0, count);
    setImageCount(newCount);
    
    setFormData(prev => {
      const currentGallery = [...prev.gallery];
      if (newCount > currentGallery.length) {
        for (let i = currentGallery.length; i < newCount; i++) {
          currentGallery.push('');
        }
      } else {
        currentGallery.length = newCount;
      }
      return { ...prev, gallery: currentGallery };
    });
  };

  const updateProductDescription = (index: number, field: keyof ProductDescription, value: string) => {
    setFormData(prev => {
      const newDescriptions = [...prev.productDescriptions];
      newDescriptions[index] = { ...newDescriptions[index], [field]: value };
      return { ...prev, productDescriptions: newDescriptions };
    });
  };

  const updateGalleryImage = (index: number, value: string) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      newGallery[index] = value;
      return { ...prev, gallery: newGallery };
    });
  };

  const fileToDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageFile = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const dataUrl = await fileToDataUrl(file);
    setFormData(prev => ({ ...prev, image: dataUrl }));
  };

  const handleGalleryFile = async (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const dataUrl = await fileToDataUrl(file);
    updateGalleryImage(index, dataUrl);
  };

  const handleClearGalleryImage = (index: number) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      newGallery[index] = '';
      return { ...prev, gallery: newGallery };
    });
    const inputEl = galleryInputRefs.current[index];
    if (inputEl) inputEl.value = '';
  };

  const handleClearMainImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
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
      <div className="relative bg-[#f8f9fa] rounded-2xl shadow-2xl w-[95vw] max-w-6xl h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-[#0d6efd]">
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
        <form onSubmit={handleSubmit} className="overflow-y-auto h-[calc(95vh-140px)]">
          <div className="p-6 space-y-6">
            
            {/* General Product Information */}
            <fieldset className="border-2 border-[#0d6efd] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#0d6efd] px-2">General Product Information</legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Product Name
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
                    اسم المنتج
                  </label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="زيت الأركان المغربي"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="small description for the product card"
                    className="w-full h-24 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6efd] resize-none"
                    required
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    وصف المنتج
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder="وصف صغير لبطاقة المنتج"
                    className="w-full h-24 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6efd] resize-none"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Price
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
                    Stock Quantity
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6efd]"
                    required
                  >
                    <option value="">Select category</option>
                    {shopCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
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
                    required
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
            </fieldset>

            {/* Product Descriptions */}
            <fieldset className="border-2 border-[#0d6efd] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#0d6efd] px-2">Product Descriptions</legend>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Number of Descriptions
                </label>
                <Input
                  type="number"
                  min="0"
                  value={descriptionCount}
                  onChange={(e) => handleDescriptionCountChange(parseInt(e.target.value) || 0)}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-6">
                {Array.from({ length: descriptionCount }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Label {index + 1} (English)
                        </label>
                        <Input
                          value={formData.productDescriptions[index]?.label || ''}
                          onChange={(e) => updateProductDescription(index, 'label', e.target.value)}
                          placeholder="Enter label..."
                          required
                        />
                      </div>
                      <div className="text-right">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          تسمية {index + 1}
                        </label>
                        <Input
                          value={formData.productDescriptions[index]?.labelAr || ''}
                          onChange={(e) => updateProductDescription(index, 'labelAr', e.target.value)}
                          placeholder="أدخل التسمية..."
                          dir="rtl"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Description {index + 1}
                        </label>
                        <textarea
                          value={formData.productDescriptions[index]?.description || ''}
                          onChange={(e) => updateProductDescription(index, 'description', e.target.value)}
                          placeholder="Enter description..."
                          className="w-full h-20 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6efd] resize-none"
                          required
                        />
                      </div>
                      <div className="text-right">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          وصف {index + 1}
                        </label>
                        <textarea
                          value={formData.productDescriptions[index]?.descriptionAr || ''}
                          onChange={(e) => updateProductDescription(index, 'descriptionAr', e.target.value)}
                          placeholder="أدخل الوصف..."
                          className="w-full h-20 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6efd] resize-none"
                          dir="rtl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Product Images */}
            <fieldset className="border-2 border-[#0d6efd] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#0d6efd] px-2">Product Images</legend>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Number of Images
                </label>
                <Input
                  type="number"
                  min="0"
                  value={imageCount}
                  onChange={(e) => handleImageCountChange(parseInt(e.target.value) || 0)}
                  className="max-w-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: imageCount }).map((_, index) => (
                  <div key={index}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Image {index + 1}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={el => { galleryInputRefs.current[index] = el; }}
                      onChange={(e) => handleGalleryFile(index, e.target.files)}
                    />
                    <div className="flex gap-2">
                      <Input
                        value={formData.gallery[index] ? 'Selected file' : ''}
                        placeholder="Choose image file"
                        readOnly
                        className="flex-1 cursor-pointer"
                        onClick={() => galleryInputRefs.current[index]?.click()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => galleryInputRefs.current[index]?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.gallery[index] && (
                      <div className="mt-2 relative inline-block">
                        <Image
                          src={formData.gallery[index]}
                          alt={`Preview ${index + 1}`}
                          width={64}
                          height={64}
                          className="h-16 w-16 object-cover rounded-lg border border-slate-200"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleClearGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Main Image */}
            <fieldset className="border-2 border-[#0d6efd] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#0d6efd] px-2">Main Image</legend>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Main Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={mainImageInputRef}
                  onChange={(e) => handleMainImageFile(e.target.files)}
                />
                <div className="flex gap-3">
                  <Input
                    value={formData.image ? 'Selected file' : ''}
                    placeholder="Choose main image file"
                    readOnly
                    required
                    className="flex-1 cursor-pointer"
                    onClick={() => mainImageInputRef.current?.click()}
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
                    <Image
                      src={formData.image}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded-lg border border-slate-200"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={handleClearMainImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700"
                      aria-label="Remove main image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </fieldset>

            {/* Product Features */}
            <fieldset className="border-2 border-[#0d6efd] rounded-xl p-5 bg-white">
              <legend className="text-lg font-bold text-[#0d6efd] px-2">Product Features</legend>
              
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#198754] hover:bg-[#157347] text-white">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
