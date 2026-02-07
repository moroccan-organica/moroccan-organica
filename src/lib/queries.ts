
import { prisma } from './prisma';
export { prisma };
import { LanguageCode } from '@prisma/client';

export async function getStaticPageBySystemName(systemName: string, lang: string) {
    try {
        const page = await prisma.staticPage.findUnique({
            where: { systemName },
            include: {
                translations: {
                    where: { language: lang as LanguageCode }
                }
            }
        });

        if (!page) return null;

        const translation = (page.translations[0] as any) || null;

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

export async function getGlobalSeoSettings(lang: string) {
    try {
        const settings = await prisma.globalSeoSetting.findFirst({
            include: {
                translations: {
                    where: { language: lang as LanguageCode }
                }
            }
        });

        if (!settings) return null;

        return {
            ...settings,
            translation: settings.translations[0] || null
        };
    } catch (error) {
        console.warn("Failed to fetch global SEO settings:", error);
        return null;
    }
}

export async function getStaticPageBySlug(slug: string, lang: string) {
    try {
        const page = await prisma.staticPage.findFirst({
            where: {
                translations: {
                    some: {
                        slug: slug,
                        language: lang as LanguageCode
                    }
                }
            },
            include: {
                translations: {
                    where: { language: lang as LanguageCode }
                }
            }
        });

        if (!page) return null;

        const translation = (page.translations[0] as any) || null;

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

export async function getFeaturedProducts(lang: string) {
    try {
        const products = await prisma.product.findMany({
            where: { isFeatured: true, isAvailable: true },
            include: {
                category: {
                    include: {
                        translations: {
                            where: { language: lang as LanguageCode }
                        }
                    }
                },
                translations: {
                    where: { language: lang as LanguageCode }
                },
                images: {
                    where: { isPrimary: true }
                }
            },
            take: 10
        });

        return products.map(p => {
            const trans = p.translations[0] || {};
            const catTrans = p.category.translations[0] || {};
            // Category image if no product image, or placeholder
            const image = p.images[0]?.url || p.category.image || "/images/placeholder.svg";

            return {
                title: trans.name || "Untitled Product",
                subtitle: catTrans.name || "Category",
                image: image,
                slug: trans.slug || p.id
            };
        });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}

export async function getTopSaleProducts(lang: string) {
    try {
        const products = await prisma.product.findMany({
            where: { isTopSale: true, isAvailable: true },
            include: {
                category: {
                    include: {
                        translations: true // Fetch all category translations
                    }
                },
                translations: true, // Fetch all product translations
                images: {
                    where: { isPrimary: true }
                },
                variants: {
                    take: 1, // Get at least one variant for price/volume
                    orderBy: { price: 'asc' }
                }
            },
            take: 6
        });

        return products.map(p => {
            const trans = p.translations.find(t => t.language === lang) || p.translations[0] || {};
            const transEn = p.translations.find(t => t.language === 'en') || p.translations[0] || {};
            const transAr = p.translations.find(t => t.language === 'ar') || p.translations[0] || {};

            const catTrans = p.category.translations.find(t => t.language === lang) || p.category.translations[0] || {};

            const image = p.images[0]?.url || p.category.image || "/images/placeholder.svg";
            const variant = p.variants[0];

            return {
                id: p.id,
                title: trans.name || "Untitled Product",
                description: trans.description || "",
                badge: "Top Seller",
                image: image,
                slug: transEn.slug || p.id,
                // Additional fields for ShopProduct
                category: catTrans.name || "Category",
                price: variant ? Number(variant.price) : Number(p.basePrice),
                volume: variant ? variant.sizeName : "Standard",
                name: transEn.name || trans.name || "Product",
                nameAr: transAr.name || trans.name || "Product",
                descriptionEn: transEn.description || "",
                descriptionAr: transAr.description || "",
                gallery: [image], // Fallback
                notes: [],
            };
        });
    } catch (error) {
        console.error("Error fetching top sale products:", error);
        return [];
    }
}

export async function getAllCategories(lang: string) {
    try {
        const categories = await prisma.category.findMany({
            include: {
                translations: {
                    where: { language: lang as LanguageCode }
                }
            }
        });

        return categories.map(c => ({
            name: c.translations[0]?.name || "Unknown",
            href: `/${lang}/shop?category=${c.translations[0]?.slug || c.id}`
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
