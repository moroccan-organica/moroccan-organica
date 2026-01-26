
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StaticPageInput } from '@/types/static-page';
import { LanguageCode } from '@prisma/client';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pages = await prisma.staticPage.findMany({
            include: {
                translations: true
            },
            orderBy: {
                systemName: 'asc'
            }
        });

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
        const existing = await prisma.staticPage.findUnique({
            where: { systemName }
        });

        if (existing) {
            return NextResponse.json({ error: 'Page with this System Name already exists' }, { status: 400 });
        }

        const newPage = await prisma.staticPage.create({
            data: {
                systemName,
                translations: {
                    create: translations.map(t => ({
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
                }
            },
            include: {
                translations: true
            }
        });

        return NextResponse.json(newPage, { status: 201 });
    } catch (error) {
        console.error('Error creating static page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
