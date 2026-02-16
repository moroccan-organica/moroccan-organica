'use server';

import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { SEOSettings } from '@/types/seo';

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
    return session;
}

/**
 * Get global SEO settings (ADMIN ONLY)
 */
export async function getSEOSettings() {
    await checkAdmin();

    try {
        const { data: settings, error } = await supabase
            .from('GlobalSeoSetting')
            .select('*, translations:GlobalSeoTranslation(*)')
            .limit(1)
            .maybeSingle();

        // Initialize default if not exists
        if (!settings) {
            const { data: newSettings, error: createError } = await supabase
                .from('GlobalSeoSetting')
                .insert({})
                .select()
                .single();

            if (createError) throw createError;

            const languages = ['en', 'fr', 'ar'];
            const { error: transError } = await supabase
                .from('GlobalSeoTranslation')
                .insert(languages.map(lang => ({
                    globalSeoSettingId: newSettings.id,
                    language: lang
                })));

            if (transError) throw transError;

            // Fetch created with translations
            const { data: complete, error: finalError } = await supabase
                .from('GlobalSeoSetting')
                .select('*, translations:GlobalSeoTranslation(*)')
                .eq('id', newSettings.id)
                .single();

            if (finalError) throw finalError;
            return complete;
        }

        return settings;
    } catch (error) {
        console.error('Error fetching global SEO settings:', error);
        throw new Error('Failed to fetch SEO settings');
    }
}

/**
 * Update global SEO settings (ADMIN ONLY)
 */
export async function updateSEOSettings(body: SEOSettings) {
    await checkAdmin();

    try {
        // Find existing to update
        const { data: existing } = await supabase
            .from('GlobalSeoSetting')
            .select('id')
            .limit(1)
            .maybeSingle();

        if (existing) {
            // Update main setting
            const { error: updateError } = await supabase
                .from('GlobalSeoSetting')
                .update({
                    ogImage: body.ogImage,
                    twitterHandle: body.twitterHandle,
                    facebookPage: body.facebookPage,
                })
                .eq('id', existing.id);

            if (updateError) throw updateError;

            // Sync translations: Delete and Insert
            await supabase
                .from('GlobalSeoTranslation')
                .delete()
                .eq('globalSeoSettingId', existing.id);

            if (body.translations && body.translations.length > 0) {
                const { error: insertError } = await supabase
                    .from('GlobalSeoTranslation')
                    .insert(body.translations.map(t => ({
                        globalSeoSettingId: existing.id,
                        language: t.language,
                        siteName: t.siteName,
                        titleSuffix: t.titleSuffix,
                        defaultMetaDesc: t.defaultMetaDesc,
                        defaultKeywords: t.defaultKeywords
                    })));

                if (insertError) throw insertError;
            }

            revalidatePath('/[lang]/admin/seo');
            return { success: true };
        } else {
            // Create fresh
            const { data: created, error: createError } = await supabase
                .from('GlobalSeoSetting')
                .insert({
                    ogImage: body.ogImage,
                    twitterHandle: body.twitterHandle,
                    facebookPage: body.facebookPage,
                })
                .select()
                .single();

            if (createError) throw createError;

            if (body.translations && body.translations.length > 0) {
                const { error: transError } = await supabase
                    .from('GlobalSeoTranslation')
                    .insert(body.translations.map(t => ({
                        globalSeoSettingId: created.id,
                        language: t.language,
                        siteName: t.siteName,
                        titleSuffix: t.titleSuffix,
                        defaultMetaDesc: t.defaultMetaDesc,
                        defaultKeywords: t.defaultKeywords
                    })));

                if (transError) throw transError;
            }

            revalidatePath('/[lang]/admin/seo');
            return { success: true };
        }
    } catch (error: any) {
        console.error('Error saving global SEO settings:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get global SEO for public usage
 */
export async function getGlobalSeoSettings(lang: string) {
    try {
        const { data: settings, error } = await supabase
            .from('GlobalSeoSetting')
            .select('*, translations:GlobalSeoTranslation(*)')
            .eq('translations.language', lang)
            .limit(1)
            .single();

        if (error || !settings) return null;

        return {
            ...settings,
            translation: settings.translations?.[0] || null
        };
    } catch (error) {
        console.warn("Failed to fetch global SEO settings:", error);
        return null;
    }
}
