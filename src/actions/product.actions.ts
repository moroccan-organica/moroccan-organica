'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { 
  ShopProductDB, 
  CreateProductInput, 
  UpdateProductInput,
  LanguageCode 
} from '@/types/product';

// Helper to transform DB product to shop format
function transformToShopProduct(product: any): ShopProductDB {
  const enTranslation = product.translations.find((t: any) => t.language === 'en') || product.translations[0];
  const arTranslation = product.translations.find((t: any) => t.language === 'ar');
  const frTranslation = product.translations.find((t: any) => t.language === 'fr');
  
  const enCategoryTranslation = product.category?.translations?.find((t: any) => t.language === 'en') || product.category?.translations?.[0];
  
  const primaryImage = product.images.find((img: any) => img.isPrimary);
  const mainImage = primaryImage?.url || product.images[0]?.url || '/images/placeholder.svg';
  const gallery = product.images.map((img: any) => img.url);

  // Get first variant for volume/size display
  const firstVariant = product.variants[0];

  return {
    id: product.id,
    slug: enTranslation?.slug || product.sku,
    category: enCategoryTranslation?.name || 'Uncategorized',
    categorySlug: enCategoryTranslation?.slug || 'uncategorized',
    image: mainImage,
    gallery,
    badge: product.isFeatured ? 'featured' : product.isTopSale ? 'bestseller' : undefined,
    volume: firstVariant?.sizeName || '',
    name: enTranslation?.name || '',
    nameAr: arTranslation?.name || enTranslation?.name || '',
    nameFr: frTranslation?.name || enTranslation?.name || '',
    description: enTranslation?.description || '',
    descriptionAr: arTranslation?.description || enTranslation?.description || '',
    descriptionFr: frTranslation?.description || enTranslation?.description || '',
    notes: [],
    price: Number(product.basePrice),
    stock: product.stock,
    isAvailable: product.isAvailable,
    isFeatured: product.isFeatured,
    isTopSale: product.isTopSale,
    sku: product.sku,
    variants: product.variants.map((v: any) => ({
      id: v.id,
      sku: v.sku,
      sizeName: v.sizeName,
      price: Number(v.price),
      stock: v.stock,
    })),
  };
}

// GET ALL PRODUCTS
export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ products: ShopProductDB[]; total: number }> {
  try {
    const { categoryId, search, isAvailable, isFeatured, page = 1, limit = 50 } = options || {};
    
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (typeof isAvailable === 'boolean') {
      where.isAvailable = isAvailable;
    }
    
    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured;
    }
    
    if (search) {
      where.OR = [
        { sku: { contains: search } },
        { translations: { some: { name: { contains: search } } } },
        { translations: { some: { description: { contains: search } } } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            include: {
              translations: true,
            },
          },
          translations: true,
          images: true,
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(transformToShopProduct),
      total,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

// GET SINGLE PRODUCT BY SLUG
export async function getProductBySlug(slug: string, lang: LanguageCode = 'en'): Promise<ShopProductDB | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        translations: {
          some: {
            slug: slug,
          },
        },
      },
      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        images: true,
        variants: true,
      },
    });

    if (!product) return null;

    return transformToShopProduct(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// GET SINGLE PRODUCT BY ID
export async function getProductById(id: string): Promise<ShopProductDB | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        images: true,
        variants: true,
      },
    });

    if (!product) return null;

    return transformToShopProduct(product);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

// CREATE PRODUCT
export async function createProduct(input: CreateProductInput): Promise<{ success: boolean; product?: ShopProductDB; error?: string }> {
  try {
    const product = await prisma.product.create({
      data: {
        categoryId: input.categoryId,
        basePrice: input.basePrice,
        sku: input.sku,
        stock: input.stock || 0,
        isAvailable: input.isAvailable ?? true,
        isFeatured: input.isFeatured ?? false,
        isTopSale: input.isTopSale ?? false,
        translations: {
          create: input.translations.map((t) => ({
            language: t.language as any,
            name: t.name,
            description: t.description || null,
            slug: t.slug,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
            keywords: t.keywords || null,
            ogImage: t.ogImage || null,
            canonical: t.canonical || null,
          })),
        },
        images: input.images ? {
          create: input.images.map((img, index) => ({
            url: img.url,
            isPrimary: img.isPrimary ?? index === 0,
          })),
        } : undefined,
        variants: input.variants ? {
          create: input.variants.map((v) => ({
            sku: v.sku,
            sizeName: v.sizeName,
            price: v.price,
            stock: v.stock || 0,
          })),
        } : undefined,
      },
      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        images: true,
        variants: true,
      },
    });

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/products');

    return { success: true, product: transformToShopProduct(product) };
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
    // Update main product data
    const updateData: any = {};
    
    if (input.categoryId) updateData.categoryId = input.categoryId;
    if (input.basePrice !== undefined) updateData.basePrice = input.basePrice;
    if (input.sku) updateData.sku = input.sku;
    if (input.stock !== undefined) updateData.stock = input.stock;
    if (input.isAvailable !== undefined) updateData.isAvailable = input.isAvailable;
    if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;
    if (input.isTopSale !== undefined) updateData.isTopSale = input.isTopSale;

    // Update product
    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // Update translations if provided
    if (input.translations) {
      for (const t of input.translations) {
        await prisma.productTranslation.upsert({
          where: {
            productId_language: {
              productId: id,
              language: t.language as any,
            },
          },
          create: {
            productId: id,
            language: t.language as any,
            name: t.name,
            description: t.description || null,
            slug: t.slug,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
            keywords: t.keywords || null,
            ogImage: t.ogImage || null,
            canonical: t.canonical || null,
          },
          update: {
            name: t.name,
            description: t.description || null,
            slug: t.slug,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
            keywords: t.keywords || null,
            ogImage: t.ogImage || null,
            canonical: t.canonical || null,
          },
        });
      }
    }

    // Update images if provided
    if (input.images) {
      // Delete existing images
      await prisma.productImage.deleteMany({ where: { productId: id } });
      // Create new images
      await prisma.productImage.createMany({
        data: input.images.map((img, index) => ({
          productId: id,
          url: img.url,
          isPrimary: img.isPrimary ?? index === 0,
        })),
      });
    }

    // Update variants if provided
    if (input.variants) {
      // Delete existing variants
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      // Create new variants
      await prisma.productVariant.createMany({
        data: input.variants.map((v) => ({
          productId: id,
          sku: v.sku,
          sizeName: v.sizeName,
          price: v.price,
          stock: v.stock || 0,
        })),
      });
    }

    // Fetch updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        images: true,
        variants: true,
      },
    });

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/products');

    return { success: true, product: updatedProduct ? transformToShopProduct(updatedProduct) : undefined };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

// DELETE PRODUCT
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.product.delete({
      where: { id },
    });

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
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        isAvailable: true,
      },
      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        images: true,
        variants: true,
      },
      take: limit,
    });

    return products.map(transformToShopProduct);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// GET FEATURED PRODUCTS
export async function getFeaturedProducts(limit: number = 8): Promise<ShopProductDB[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        isFeatured: true,
      },
      include: {
        category: {
          include: {
            translations: true,
          },
        },
        translations: true,
        images: true,
        variants: true,
      },
      take: limit,
    });

    return products.map(transformToShopProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
