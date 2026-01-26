
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StaticPageInput } from '@/types/static-page';
import { LanguageCode } from '@prisma/client';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json() as StaticPageInput;
        const { systemName, translations } = body; // systemName usually shouldn't change, but allowing update if needed

        // If systemName changes, check unique
        const existing = await prisma.staticPage.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        if (systemName && systemName !== existing.systemName) {
            const conflict = await prisma.staticPage.findUnique({
                where: { systemName }
            });
            if (conflict) {
                return NextResponse.json({ error: 'System Name already exists' }, { status: 400 });
            }
        }

        // Transaction to update page and sync translations
        const updatedPage = await prisma.$transaction(async (tx) => {
            // 1. Update main page
            await tx.staticPage.update({
                where: { id },
                data: { systemName }
            });

            // 2. Handle Translations
            // Simplest approach: Delete all and recreate. Or update existing.
            // Given it's a small set (3 langs), deleteMany + create is often cleaner unless we need to preserve IDs.
            // Preserving IDs is better for consistent logs or refs, but here minimal refs.
            // Let's use deleteMany + create for simplicity of "syncing".

            await tx.staticPageTranslation.deleteMany({
                where: { staticPageId: id }
            });

            await tx.staticPageTranslation.createMany({
                data: translations.map(t => ({
                    staticPageId: id,
                    language: t.language as LanguageCode,
                    slug: t.slug,
                    h1: t.h1,
                    description: t.description,
                    metaTitle: t.metaTitle,
                    metaDesc: t.metaDesc,
                    keywords: t.keywords,
                    ogImage: t.ogImage,
                    canonical: t.canonical
                }))
            });

            return tx.staticPage.findUnique({
                where: { id },
                include: { translations: true }
            });
        });

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

        await prisma.staticPage.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting static page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
