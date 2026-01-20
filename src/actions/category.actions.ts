'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { CategoryDB, LanguageCode } from '@/types/product';

// Helper to transform DB category to shop format
function transformToShopCategory(category: any): CategoryDB {
  const enTranslation = category.translations?.find((t: any) => t.language === 'en') || category.translations?.[0];
  const arTranslation = category.translations?.find((t: any) => t.language === 'ar');
  const frTranslation = category.translations?.find((t: any) => t.language === 'fr');

  return {
    id: category.id,
    image: category.image,
    name: enTranslation?.name || 'Uncategorized',
    nameAr: arTranslation?.name || enTranslation?.name || '',
    nameFr: frTranslation?.name || enTranslation?.name || '',
    slug: enTranslation?.slug || 'uncategorized',
    slugAr: arTranslation?.slug || enTranslation?.slug || '',
    slugFr: frTranslation?.slug || enTranslation?.slug || '',
  };
}

// GET ALL CATEGORIES
export async function getCategories(): Promise<CategoryDB[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        translations: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return categories.map(transformToShopCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// GET CATEGORY BY SLUG
export async function getCategoryBySlug(slug: string, lang: LanguageCode = 'en'): Promise<CategoryDB | null> {
  try {
    const category = await prisma.category.findFirst({
      where: {
        translations: {
          some: {
            slug: slug,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    if (!category) return null;

    return transformToShopCategory(category);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

// GET CATEGORY BY ID
export async function getCategoryById(id: string): Promise<CategoryDB | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!category) return null;

    return transformToShopCategory(category);
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return null;
  }
}

// CREATE CATEGORY
export async function createCategory(input: {
  image?: string;
  translations: {
    language: LanguageCode;
    name: string;
    slug: string;
    metaTitle?: string;
    metaDesc?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
  }[];
}): Promise<{ success: boolean; category?: CategoryDB; error?: string }> {
  try {
    const category = await prisma.category.create({
      data: {
        image: input.image || null,
        translations: {
          create: input.translations.map((t) => ({
            language: t.language as any,
            name: t.name,
            slug: t.slug,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
            keywords: t.keywords || null,
            ogImage: t.ogImage || null,
            canonical: t.canonical || null,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/categories');

    return { success: true, category: transformToShopCategory(category) };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

// DELETE CATEGORY
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}
