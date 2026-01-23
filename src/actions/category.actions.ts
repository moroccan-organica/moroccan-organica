'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { CategoryDB, LanguageCode } from '@/types/product';

type DbCategoryWithTranslations = Prisma.CategoryGetPayload<{
  include: { translations: true };
}>;

// Helper to transform DB category to shop format
function transformToShopCategory(category: DbCategoryWithTranslations, preferredLang: LanguageCode = 'en'): CategoryDB {
  const preferredTranslation =
    category.translations?.find((t) => t.language === preferredLang) ||
    category.translations?.find((t) => t.language === 'en') ||
    category.translations?.[0];

  const arTranslation = category.translations?.find((t) => t.language === 'ar');
  const frTranslation = category.translations?.find((t) => t.language === 'fr');

  return {
    id: category.id,
    image: category.image,
    name: preferredTranslation?.name || 'Uncategorized',
    nameAr: arTranslation?.name || preferredTranslation?.name || '',
    nameFr: frTranslation?.name || preferredTranslation?.name || '',
    slug: preferredTranslation?.slug || 'uncategorized',
    slugAr: arTranslation?.slug || preferredTranslation?.slug || '',
    slugFr: frTranslation?.slug || preferredTranslation?.slug || '',
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

    return categories.map((category) => transformToShopCategory(category));
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

    return transformToShopCategory(category, lang);
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
            language: t.language,
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
  } catch (error: unknown) {
    console.error('Error creating category:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create category' };
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
  } catch (error: unknown) {
    console.error('Error deleting category:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete category' };
  }
}
