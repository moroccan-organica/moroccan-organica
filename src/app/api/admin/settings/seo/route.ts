
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SEOSettings } from '@/types/seo';
import { LanguageCode } from '@prisma/client';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await prisma.globalSeoSetting.findFirst({
            include: {
                translations: true
            }
        });

        // Initialize default if not exists
        if (!settings) {
            const newSettings = await prisma.globalSeoSetting.create({
                data: {
                    translations: {
                        create: [
                            { language: 'en' },
                            { language: 'fr' },
                            { language: 'ar' }
                        ]
                    }
                },
                include: { translations: true }
            });
            return NextResponse.json(newSettings);
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
        const existing = await prisma.globalSeoSetting.findFirst();

        if (existing) {
            // Transaction Update
            const updated = await prisma.$transaction(async (tx) => {
                await tx.globalSeoSetting.update({
                    where: { id: existing.id },
                    data: {
                        ogImage: body.ogImage,
                        twitterHandle: body.twitterHandle,
                        facebookPage: body.facebookPage,
                    }
                });

                // Update translations
                // Delete existing translations and recreate is simplest
                await tx.globalSeoTranslation.deleteMany({
                    where: { globalSeoSettingId: existing.id }
                });

                await tx.globalSeoTranslation.createMany({
                    data: body.translations.map(t => ({
                        globalSeoSettingId: existing.id,
                        language: t.language as LanguageCode,
                        siteName: t.siteName,
                        titleSuffix: t.titleSuffix,
                        defaultMetaDesc: t.defaultMetaDesc,
                        defaultKeywords: t.defaultKeywords
                    }))
                });

                return tx.globalSeoSetting.findUnique({
                    where: { id: existing.id },
                    include: { translations: true }
                });
            });
            return NextResponse.json(updated);
        } else {
            // Create fresh
            const created = await prisma.globalSeoSetting.create({
                data: {
                    ogImage: body.ogImage,
                    twitterHandle: body.twitterHandle,
                    facebookPage: body.facebookPage,
                    translations: {
                        create: body.translations.map(t => ({
                            language: t.language as LanguageCode,
                            siteName: t.siteName,
                            titleSuffix: t.titleSuffix,
                            defaultMetaDesc: t.defaultMetaDesc,
                            defaultKeywords: t.defaultKeywords
                        }))
                    }
                },
                include: { translations: true }
            });
            return NextResponse.json(created);
        }

    } catch (error) {
        console.error('Error saving global SEO settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
