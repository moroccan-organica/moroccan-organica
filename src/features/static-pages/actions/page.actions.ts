'use server';

import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { StaticPageInput } from '@/types/static-page';

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
    return session;
}

/**
 * Get all static pages (ADMIN ONLY)
 */
export async function getStaticPages() {
    await checkAdmin();

    try {
        const { data: pages, error } = await supabase
            .from('StaticPage')
            .select(`
                *,
                translations:StaticPageTranslation(*)
            `)
            .order('systemName', { ascending: true });

        if (error) throw error;
        return pages;
    } catch (error) {
        console.error('Error fetching static pages:', error);
        throw new Error('Failed to fetch static pages');
    }
}

/**
 * Create a new static page (ADMIN ONLY)
 */
export async function createStaticPage(input: StaticPageInput) {
    await checkAdmin();

    const { systemName, translations } = input;

    try {
        if (!systemName) throw new Error('System Name is required');

        // Check unique systemName
        const { data: existing } = await supabase
            .from('StaticPage')
            .select('id')
            .eq('systemName', systemName)
            .maybeSingle();

        if (existing) throw new Error('Page with this System Name already exists');

        // Create the page
        const { data: newPage, error: pageError } = await supabase
            .from('StaticPage')
            .insert({ systemName })
            .select()
            .single();

        if (pageError) throw pageError;

        // Create translations
        if (translations && translations.length > 0) {
            const { error: transError } = await supabase
                .from('StaticPageTranslation')
                .insert(translations.map(t => ({
                    staticPageId: newPage.id,
                    language: t.language,
                    slug: t.slug,
                    h1: t.h1,
                    description: t.description,
                    metaTitle: t.metaTitle,
                    metaDesc: t.metaDesc,
                    keywords: t.keywords,
                    ogImage: t.ogImage,
                    canonical: t.canonical
                })));

            if (transError) throw transError;
        }

        revalidatePath('/[lang]/admin/static-pages');
        return { success: true, id: newPage.id };
    } catch (error: any) {
        console.error('Error creating static page:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update a static page (ADMIN ONLY)
 */
export async function updateStaticPage(id: string, input: StaticPageInput) {
    await checkAdmin();

    const { systemName, translations } = input;

    try {
        // Update basic info
        const { error: pageError } = await supabase
            .from('StaticPage')
            .update({ systemName })
            .eq('id', id);

        if (pageError) throw pageError;

        // Sync translations
        if (translations && translations.length > 0) {
            // Simple sync: delete existing and re-insert (not ideal but works for now)
            await supabase
                .from('StaticPageTranslation')
                .delete()
                .eq('staticPageId', id);

            const { error: transError } = await supabase
                .from('StaticPageTranslation')
                .insert(translations.map(t => ({
                    staticPageId: id,
                    language: t.language,
                    slug: t.slug,
                    h1: t.h1,
                    description: t.description,
                    metaTitle: t.metaTitle,
                    metaDesc: t.metaDesc,
                    keywords: t.keywords,
                    ogImage: t.ogImage,
                    canonical: t.canonical
                })));

            if (transError) throw transError;
        }

        revalidatePath('/[lang]/admin/static-pages');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating static page:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a static page (ADMIN ONLY)
 */
export async function deleteStaticPage(id: string) {
    await checkAdmin();

    try {
        const { error } = await supabase
            .from('StaticPage')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/[lang]/admin/static-pages');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting static page:', error);
        return { success: false, error: error.message };
    }
}

export async function getStaticPageBySystemName(systemName: string, lang: string) {
    try {
        const { data: page, error } = await supabase
            .from('StaticPage')
            .select('*, translations:StaticPageTranslation(*)')
            .eq('systemName', systemName)
            .eq('translations.language', lang)
            .single();

        if (error || !page) return null;

        const translation = (page.translations?.[0] as any) || null;

        return {
            ...page,
            translation: translation ? {
                id: translation.id,
                language: translation.language,
                h1: translation.h1,
                description: translation.description,
                slug: translation.slug,
                metaTitle: translation.metaTitle,
                metaDesc: translation.metaDesc,
                keywords: translation.keywords,
                ogImage: translation.ogImage,
                canonical: translation.canonical,
            } : null
        };
    } catch (error) {
        console.warn(`Failed to fetch static page ${systemName}:`, error);
        return null;
    }
}

export async function getStaticPageBySlug(slug: string, lang: string) {
    try {
        const { data: page, error } = await supabase
            .from('StaticPage')
            .select('*, translations:StaticPageTranslation(*)')
            .eq('translations.slug', slug)
            .eq('translations.language', lang)
            .limit(1)
            .single();

        if (error || !page) return null;

        const translation = (page.translations?.[0] as any) || null;

        return {
            ...page,
            translation: translation ? {
                id: translation.id,
                language: translation.language,
                h1: translation.h1,
                description: translation.description,
                slug: translation.slug,
                metaTitle: translation.metaTitle,
                metaDesc: translation.metaDesc,
                keywords: translation.keywords,
                ogImage: translation.ogImage,
                canonical: translation.canonical,
            } : null
        };
    } catch (error) {
        console.warn(`Failed to fetch static page by slug ${slug}:`, error);
        return null;
    }
}
