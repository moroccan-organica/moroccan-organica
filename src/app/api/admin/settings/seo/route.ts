import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SEOSettings } from '@/types/seo';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
            return NextResponse.json(complete);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching global SEO settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json() as SEOSettings;

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
            const { error: deleteError } = await supabase
                .from('GlobalSeoTranslation')
                .delete()
                .eq('globalSeoSettingId', existing.id);

            if (deleteError) throw deleteError;

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

            // Return updated complete
            const { data: updated, error: finalError } = await supabase
                .from('GlobalSeoSetting')
                .select('*, translations:GlobalSeoTranslation(*)')
                .eq('id', existing.id)
                .single();

            if (finalError) throw finalError;
            return NextResponse.json(updated);
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

            const { data: complete, error: finalError } = await supabase
                .from('GlobalSeoSetting')
                .select('*, translations:GlobalSeoTranslation(*)')
                .eq('id', created.id)
                .single();

            if (finalError) throw finalError;
            return NextResponse.json(complete);
        }

    } catch (error) {
        console.error('Error saving global SEO settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
