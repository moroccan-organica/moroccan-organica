'use server';

import { supabase } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';
import {
  ShopProductDB,
  CreateProductInput,
  UpdateProductInput,
  LanguageCode
} from '@/types/product';

// Helper to transform DB product to shop format
function transformToShopProduct(product: any, preferredLang: LanguageCode = 'en'): ShopProductDB {
  const translations = product.translations || [];
  const translation =
    translations.find((t: any) => t.language === preferredLang) ||
    translations.find((t: any) => t.language === 'en') ||
    translations[0];

  const arTranslation = translations.find((t: any) => t.language === 'ar');
  const frTranslation = translations.find((t: any) => t.language === 'fr');

  const category = product.category;
  const categoryTranslations = category?.translations || [];
  const categoryTranslation =
    categoryTranslations.find((t: any) => t.language === preferredLang) ||
    categoryTranslations.find((t: any) => t.language === 'en') ||
    categoryTranslations[0];

  const images = product.images || [];
  const primaryImage = images.find((img: any) => img.isPrimary);
  const validImages = images.filter((img: any) =>
    img.url &&
    !img.url.startsWith('data:') &&
    !img.url.startsWith('blob:')
  );

  const mainImage = validImages.length > 0
    ? (primaryImage && !primaryImage.url.startsWith('data:') && !primaryImage.url.startsWith('blob:')
      ? primaryImage.url
      : validImages[0]?.url)
    : '/images/placeholder.svg';
  const gallery = validImages.map((img: any) => img.url);

  const variants = product.variants || [];
  const firstVariant = variants[0];

  return {
    id: product.id,
    slug: translation?.slug || product.sku,
    category: categoryTranslation?.name || 'Uncategorized',
    categorySlug: categoryTranslation?.slug || 'uncategorized',
    image: mainImage,
    gallery,
    badge: product.isFeatured ? 'featured' : product.isTopSale ? 'bestseller' : undefined,
    volume: firstVariant?.sizeName || '',
    name: translation?.name || '',
    nameAr: arTranslation?.name || translation?.name || '',
    nameFr: frTranslation?.name || translation?.name || '',
    description: translation?.description || '',
    descriptionAr: arTranslation?.description || translation?.description || '',
    descriptionFr: frTranslation?.description || translation?.description || '',
    notes: [],
    price: Number(product.basePrice),
    stock: product.stock,
    isAvailable: product.isAvailable,
    isFeatured: product.isFeatured,
    isTopSale: product.isTopSale,
    sku: product.sku,
    variants: variants.map((v: any) => ({
      id: v.id,
      sku: v.sku,
      sizeName: v.sizeName,
      price: Number(v.price),
      stock: v.stock,
    })),
    metaTitle: translation?.metaTitle || undefined,
    metaDesc: translation?.metaDesc || undefined,
    keywords: translation?.keywords || undefined,
    ogImage: translation?.ogImage || undefined,
    canonical: translation?.canonical || undefined,
  };
}

// GET ALL PRODUCTS
export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isTopSale?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ products: ShopProductDB[]; total: number }> {
  try {
    const { categoryId, search, isAvailable, isFeatured, page = 1, limit = 50 } = options || {};

    let query = supabase
      .from('Product')
      .select(`
        *,
        category:Category(*, translations:CategoryTranslation(*)),
        translations:ProductTranslation(*),
        images:ProductImage(*),
        variants:ProductVariant(*)
      `, { count: 'exact' });

    if (categoryId) {
      query = query.eq('categoryId', categoryId);
    }

    if (typeof isAvailable === 'boolean') {
      query = query.eq('isAvailable', isAvailable);
    }

    if (typeof isFeatured === 'boolean') {
      query = query.eq('isFeatured', isFeatured);
    }

    if (typeof options?.isTopSale === 'boolean') {
      query = query.eq('isTopSale', options.isTopSale);
    }

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`;
      // Complex OR filter in Supabase/PostgREST can be tricky with relations.
      // This is a simplified version.
      query = query.or(`sku.ilike.${searchPattern}`);
      // Note: Searching in translations via 'or' on a relation is restricted in PostgREST unless using specific syntax.
      // For now, we search in SKU. If we need deeper search, we might need a stored procedure.
    }

    const { data: products, count: total, error } = await query
      .order('createdAt', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return {
      products: (products || []).map((product) => transformToShopProduct(product)),
      total: total || 0,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

// GET SINGLE PRODUCT BY SLUG
export async function getProductBySlug(slug: string, lang: LanguageCode = 'en'): Promise<ShopProductDB | null> {
  try {
    const { data: products, error } = await supabase
      .from('Product')
      .select(`
        *,
        category:Category(*, translations:CategoryTranslation(*)),
        translations:ProductTranslation(*),
        images:ProductImage(*),
        variants:ProductVariant(*)
      `)
      .eq('translations.slug', slug);

    if (error || !products || products.length === 0) return null;

    return transformToShopProduct(products[0], lang);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// GET SINGLE PRODUCT BY ID
export async function getProductById(id: string): Promise<ShopProductDB | null> {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select(`
        *,
        category:Category(*, translations:CategoryTranslation(*)),
        translations:ProductTranslation(*),
        images:ProductImage(*),
        variants:ProductVariant(*)
      `)
      .eq('id', id)
      .single();

    if (error || !product) return null;

    return transformToShopProduct(product);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

// CREATE PRODUCT
export async function createProduct(input: CreateProductInput): Promise<{ success: boolean; product?: ShopProductDB; error?: string }> {
  try {
    // Basic validation
    if (!input.categoryId || !input.sku || !input.translations || input.translations.length === 0) {
      return { success: false, error: 'Missing required fields' };
    }

    // Verify category exists
    const { data: cat } = await supabase.from('Category').select('id').eq('id', input.categoryId).single();
    if (!cat) return { success: false, error: 'Category not found' };

    // Check SKU
    const { data: existingSku } = await supabase.from('Product').select('id').eq('sku', input.sku).maybeSingle();
    if (existingSku) return { success: false, error: `SKU "${input.sku}" already exists` };

    // Insert Product
    const { data: product, error: productError } = await supabase
      .from('Product')
      .insert({
        categoryId: input.categoryId,
        basePrice: input.basePrice,
        sku: input.sku,
        stock: input.stock || 0,
        isAvailable: input.isAvailable ?? true,
        isFeatured: input.isFeatured ?? false,
        isTopSale: input.isTopSale ?? false,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert Translations
    if (input.translations && input.translations.length > 0) {
      const { error: transError } = await supabase
        .from('ProductTranslation')
        .insert(input.translations.map(t => ({
          productId: product.id,
          language: t.language,
          name: t.name,
          description: t.description || null,
          slug: t.slug,
          metaTitle: t.metaTitle || null,
          metaDesc: t.metaDesc || null,
          keywords: t.keywords || null,
          ogImage: t.ogImage || null,
          canonical: t.canonical || null,
        })));
      if (transError) throw transError;
    }

    // Insert Images
    if (input.images && input.images.length > 0) {
      const validImages = input.images.filter(img => !img.url.startsWith('data:'));
      if (validImages.length > 0) {
        const { error: imgError } = await supabase
          .from('ProductImage')
          .insert(validImages.map((img, index) => ({
            productId: product.id,
            url: img.url,
            isPrimary: img.isPrimary ?? index === 0,
          })));
        if (imgError) throw imgError;
      }
    }

    // Insert Variants
    if (input.variants && input.variants.length > 0) {
      const { error: varError } = await supabase
        .from('ProductVariant')
        .insert(input.variants.map(v => ({
          productId: product.id,
          sku: v.sku,
          sizeName: v.sizeName,
          price: v.price,
          stock: v.stock || 0,
        })));
      if (varError) throw varError;
    }

    // Fetch complete
    const completeProduct = await getProductById(product.id);

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/products');

    return { success: true, product: completeProduct || undefined };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

// UPDATE PRODUCT
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<{ success: boolean; product?: ShopProductDB; error?: string }> {
  try {
    // Update main product
    const { error: updateError } = await supabase
      .from('Product')
      .update({
        categoryId: input.categoryId,
        basePrice: input.basePrice,
        sku: input.sku,
        stock: input.stock,
        isAvailable: input.isAvailable,
        isFeatured: input.isFeatured,
        isTopSale: input.isTopSale,
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Update translations: delete and insert for simplicity (sync)
    if (input.translations) {
      const { error: delTransError } = await supabase.from('ProductTranslation').delete().eq('productId', id);
      if (delTransError) throw delTransError;

      const { error: insTransError } = await supabase
        .from('ProductTranslation')
        .insert(input.translations.map(t => ({
          productId: id,
          language: t.language,
          name: t.name,
          description: t.description || null,
          slug: t.slug,
          metaTitle: t.metaTitle || null,
          metaDesc: t.metaDesc || null,
          keywords: t.keywords || null,
          ogImage: t.ogImage || null,
          canonical: t.canonical || null,
        })));
      if (insTransError) throw insTransError;
    }

    // Update images
    if (input.images) {
      const validImages = input.images.filter(img => !img.url.startsWith('data:') && !img.url.startsWith('blob:'));
      await supabase.from('ProductImage').delete().eq('productId', id);
      if (validImages.length > 0) {
        await supabase.from('ProductImage').insert(validImages.map((img, index) => ({
          productId: id,
          url: img.url,
          isPrimary: img.isPrimary ?? index === 0,
        })));
      }
    }

    // Update variants
    if (input.variants) {
      await supabase.from('ProductVariant').delete().eq('productId', id);
      await supabase.from('ProductVariant').insert(input.variants.map(v => ({
        productId: id,
        sku: v.sku,
        sizeName: v.sizeName,
        price: v.price,
        stock: v.stock || 0,
      })));
    }

    const updated = await getProductById(id);

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/products');

    return { success: true, product: updated || undefined };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

// DELETE PRODUCT
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('Product').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/products');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

// GET RELATED PRODUCTS
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
): Promise<ShopProductDB[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product')
      .select(`
        *,
        category:Category(*, translations:CategoryTranslation(*)),
        translations:ProductTranslation(*),
        images:ProductImage(*),
        variants:ProductVariant(*)
      `)
      .eq('categoryId', categoryId)
      .neq('id', productId)
      .eq('isAvailable', true)
      .limit(limit);

    if (error) throw error;

    return (products || []).map((product) => transformToShopProduct(product));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// GET FEATURED PRODUCTS
export async function getFeaturedProducts(limit: number = 8): Promise<ShopProductDB[]> {
  try {
    const { data: products, error } = await supabase
      .from('Product')
      .select(`
        *,
        category:Category(*, translations:CategoryTranslation(*)),
        translations:ProductTranslation(*),
        images:ProductImage(*),
        variants:ProductVariant(*)
      `)
      .eq('isAvailable', true)
      .eq('isFeatured', true)
      .limit(limit);

    if (error) throw error;

    return (products || []).map((product) => transformToShopProduct(product));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
