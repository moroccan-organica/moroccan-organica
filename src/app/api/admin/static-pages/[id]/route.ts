import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StaticPageInput } from '@/types/static-page';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json() as StaticPageInput;
        const { systemName, translations } = body;

        const { data: existing, error: fetchError } = await supabase
            .from('StaticPage')
            .select('systemName')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        if (systemName && systemName !== existing.systemName) {
            const { data: conflict } = await supabase
                .from('StaticPage')
                .select('id')
                .eq('systemName', systemName)
                .neq('id', id)
                .single();
            if (conflict) {
                return NextResponse.json({ error: 'System Name already exists' }, { status: 400 });
            }
        }

        // Update page
        const { error: pageUpdateError } = await supabase
            .from('StaticPage')
            .update({ systemName })
            .eq('id', id);

        if (pageUpdateError) throw pageUpdateError;

        // Sync translations: Delete and Insert
        const { error: deleteError } = await supabase
            .from('StaticPageTranslation')
            .delete()
            .eq('staticPageId', id);

        if (deleteError) throw deleteError;

        if (translations && translations.length > 0) {
            const { error: insertError } = await supabase
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

            if (insertError) throw insertError;
        }

        // Get updated page
        const { data: updatedPage, error: finalError } = await supabase
            .from('StaticPage')
            .select('*, translations:StaticPageTranslation(*)')
            .eq('id', id)
            .single();

        if (finalError) throw finalError;

        return NextResponse.json(updatedPage);

    } catch (error) {
        console.error('Error updating static page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const { error } = await supabase
            .from('StaticPage')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting static page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
