import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StaticPageInput } from '@/types/static-page';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: pages, error } = await supabase
            .from('StaticPage')
            .select(`
                *,
                translations:StaticPageTranslation(*)
            `)
            .order('systemName', { ascending: true });

        if (error) throw error;

        return NextResponse.json(pages);
    } catch (error) {
        console.error('Error fetching static pages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json() as StaticPageInput;
        const { systemName, translations } = body;

        if (!systemName) {
            return NextResponse.json({ error: 'System Name is required' }, { status: 400 });
        }

        // Check unique systemName
        const { data: existing } = await supabase
            .from('StaticPage')
            .select('id')
            .eq('systemName', systemName)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Page with this System Name already exists' }, { status: 400 });
        }

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

        // Fetch the complete page with translations
        const { data: completePage, error: fetchError } = await supabase
            .from('StaticPage')
            .select('*, translations:StaticPageTranslation(*)')
            .eq('id', newPage.id)
            .single();

        if (fetchError) throw fetchError;

        return NextResponse.json(completePage, { status: 201 });
    } catch (error) {
        console.error('Error creating static page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
