'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { CategoryDB, LanguageCode } from '@/types/product';

// Helper to transform DB category to shop format
function transformToShopCategory(category: any, preferredLang: LanguageCode = 'en'): CategoryDB {
  const translations = category.translations || [];
  const preferredTranslation =
    translations.find((t: any) => t.language === preferredLang) ||
    translations.find((t: any) => t.language === 'en') ||
    translations[0];

  const arTranslation = translations.find((t: any) => t.language === 'ar');
  const frTranslation = translations.find((t: any) => t.language === 'fr');

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
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*, translations:CategoryTranslation(*)')
      .order('createdAt', { ascending: true });

    if (error) throw error;

    return (categories || []).map((category) => transformToShopCategory(category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// GET CATEGORY BY SLUG
export async function getCategoryBySlug(slug: string, lang: LanguageCode = 'en'): Promise<CategoryDB | null> {
  try {
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*, translations:CategoryTranslation(*)')
      .eq('translations.slug', slug);

    if (error || !categories || categories.length === 0) return null;

    return transformToShopCategory(categories[0], lang);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

// GET CATEGORY BY ID
export async function getCategoryById(id: string): Promise<CategoryDB | null> {
  try {
    const { data: category, error } = await supabase
      .from('Category')
      .select('*, translations:CategoryTranslation(*)')
      .eq('id', id)
      .single();

    if (error || !category) return null;

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
    const { data: category, error: categoryError } = await supabase
      .from('Category')
      .insert({ image: input.image || null })
      .select()
      .single();

    if (categoryError) throw categoryError;

    if (input.translations && input.translations.length > 0) {
      const { error: transError } = await supabase
        .from('CategoryTranslation')
        .insert(input.translations.map(t => ({
          categoryId: category.id,
          language: t.language,
          name: t.name,
          slug: t.slug,
          metaTitle: t.metaTitle || null,
          metaDesc: t.metaDesc || null,
          keywords: t.keywords || null,
          ogImage: t.ogImage || null,
          canonical: t.canonical || null,
        })));
      if (transError) throw transError;
    }

    const completeCategory = await getCategoryById(category.id);

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/categories');

    return { success: true, category: completeCategory || undefined };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

// DELETE CATEGORY
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('Category').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/[lang]/shop');
    revalidatePath('/[lang]/admin/categories');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}
