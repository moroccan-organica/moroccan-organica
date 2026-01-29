'use server';

import { prisma } from '@/lib/prisma';
import { Prisma, $Enums } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import {
  ShopProductDB,
  CreateProductInput,
  UpdateProductInput,
  LanguageCode
} from '@/types/product';

type DbProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: { include: { translations: true } };
    translations: true;
    images: true;
    variants: true;
  };
}>;

// Helper to transform DB product to shop format
function transformToShopProduct(product: DbProductWithRelations, preferredLang: LanguageCode = 'en'): ShopProductDB {
  const translation =
    product.translations.find((t) => t.language === preferredLang) ||
    product.translations.find((t) => t.language === 'en') ||
    product.translations[0];

  const arTranslation = product.translations.find((t) => t.language === 'ar');
  const frTranslation = product.translations.find((t) => t.language === 'fr');

  const categoryTranslation =
    product.category?.translations?.find((t) => t.language === preferredLang) ||
    product.category?.translations?.find((t) => t.language === 'en') ||
    product.category?.translations?.[0];

  const primaryImage = product.images.find((img) => img.isPrimary);
  // Filter out base64 and blob URLs - they're temporary and won't work after page reload
  const validImages = product.images.filter(img =>
    img.url &&
    !img.url.startsWith('data:') &&
    !img.url.startsWith('blob:')
  );
  const mainImage = validImages.length > 0
    ? (primaryImage && !primaryImage.url.startsWith('data:') && !primaryImage.url.startsWith('blob:')
      ? primaryImage.url
      : validImages[0]?.url)
    : '/images/placeholder.svg';
  const gallery = validImages.map((img) => img.url);

  const firstVariant = product.variants[0];

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
    variants: product.variants.map((v) => ({
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
  page?: number;
  limit?: number;
}): Promise<{ products: ShopProductDB[]; total: number }> {
  try {
    const { categoryId, search, isAvailable, isFeatured, page = 1, limit = 50 } = options || {};

    const where: Prisma.ProductWhereInput = {};

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
      products: products.map((product) => transformToShopProduct(product)),
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

    return transformToShopProduct(product, lang);
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
    // Validate required fields
    if (!input.categoryId || input.categoryId.trim() === '') {
      return { success: false, error: 'Category is required' };
    }

    if (!input.sku || input.sku.trim() === '') {
      return { success: false, error: 'SKU is required' };
    }

    if (!input.translations || input.translations.length === 0) {
      return { success: false, error: 'At least one translation is required' };
    }

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!categoryExists) {
      return { success: false, error: 'Selected category does not exist' };
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku: input.sku },
    });

    if (existingSku) {
      return { success: false, error: `SKU "${input.sku}" already exists` };
    }

    // Filter out data URLs from images (too large for DB)
    const validImages = input.images?.filter(img => !img.url.startsWith('data:')) || [];

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
            language: t.language as $Enums.LanguageCode,
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
        images: validImages.length > 0 ? {
          create: validImages.map((img, index) => ({
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    console.error('Error creating product:', error);
    return { success: false, error: message };
  }
}

// UPDATE PRODUCT
export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<{ success: boolean; product?: ShopProductDB; error?: string }> {
  try {
    // Update main product data
    const updateData: Prisma.ProductUpdateInput = {};

    if (input.categoryId) {
      updateData.category = { connect: { id: input.categoryId } };
    }
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
              language: t.language as $Enums.LanguageCode,
            },
          },
          create: {
            productId: id,
            language: t.language as $Enums.LanguageCode,
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
      // Filter out data URLs and blob URLs (they're temporary)
      const validImages = input.images.filter(img =>
        img.url &&
        !img.url.startsWith('data:') &&
        !img.url.startsWith('blob:')
      );

      // Delete existing images
      await prisma.productImage.deleteMany({ where: { productId: id } });

      // Create new images only if we have valid URLs
      if (validImages.length > 0) {
        await prisma.productImage.createMany({
          data: validImages.map((img, index) => ({
            productId: id,
            url: img.url,
            isPrimary: img.isPrimary ?? index === 0,
          })),
        });
      }
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    console.error('Error updating product:', error);
    return { success: false, error: message };
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    console.error('Error deleting product:', error);
    return { success: false, error: message };
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

    return products.map((product) => transformToShopProduct(product));
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

    return products.map((product) => transformToShopProduct(product));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
