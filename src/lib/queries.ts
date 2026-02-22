
import { supabase } from './supabase';

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

export async function getFeaturedProducts(lang: string) {
    try {
        const { data: products, error } = await supabase
            .from('Product')
            .select(`
                *,
                category:Category(*, translations:CategoryTranslation(*)),
                translations:ProductTranslation(*),
                images:ProductImage(*)
            `)
            .eq('placement', 'featured')
            .eq('isAvailable', true)
            .eq('category.translations.language', lang)
            .eq('translations.language', lang)
            .order('createdAt', { ascending: false })
            .limit(7);

        if (error || !products) return [];

        return products.map((p: any) => {
            const trans = p.translations?.[0] || {};
            const catTrans = p.category?.translations?.[0] || {};
            // Category image if no product image, or placeholder
            const image = p.images?.[0]?.url || p.category?.image || "/images/placeholder.svg";

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
        const { data: products, error } = await supabase
            .from('Product')
            .select(`
                *,
                category:Category(*, translations:CategoryTranslation(*)),
                translations:ProductTranslation(*),
                images:ProductImage(*),
                variants:ProductVariant(*)
            `)
            .eq('placement', 'topsale')
            .eq('isAvailable', true)
            .order('createdAt', { ascending: false })
            .limit(9);

        if (error || !products) return [];

        return products.map((p: any) => {
            const trans = p.translations?.find((t: any) => t.language === lang) || p.translations?.[0] || {};
            const transEn = p.translations?.find((t: any) => t.language === 'en') || p.translations?.[0] || {};
            const transAr = p.translations?.find((t: any) => t.language === 'ar') || p.translations?.[0] || {};

            const catTrans = p.category?.translations?.find((t: any) => t.language === lang) || p.category?.translations?.[0] || {};

            const image = p.images?.[0]?.url || p.category?.image || "/images/placeholder.svg";
            const variant = p.variants?.[0];

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

export async function getCatalogueProducts(lang: string) {
    try {
        const { data: products, error } = await supabase
            .from('Product')
            .select(`
                *,
                category:Category(*, translations:CategoryTranslation(*)),
                translations:ProductTranslation(*),
                images:ProductImage(*),
                variants:ProductVariant(*)
            `)
            .eq('placement', 'catalogue')
            .eq('isAvailable', true)
            .order('createdAt', { ascending: false });

        if (error || !products) return [];

        return products.map((p: any) => {
            const trans = p.translations?.find((t: any) => t.language === lang) || p.translations?.[0] || {};
            const transEn = p.translations?.find((t: any) => t.language === 'en') || p.translations?.[0] || {};
            const transAr = p.translations?.find((t: any) => t.language === 'ar') || p.translations?.[0] || {};

            const catTrans = p.category?.translations?.find((t: any) => t.language === lang) || p.category?.translations?.[0] || {};

            const image = p.images?.[0]?.url || p.category?.image || "/images/placeholder.svg";
            const variant = p.variants?.[0];

            return {
                id: p.id,
                title: trans.name || "Untitled Product",
                description: trans.description || "",
                badge: "Catalogue",
                image: image,
                slug: transEn.slug || p.id,
                category: catTrans.name || "Category",
                price: variant ? Number(variant.price) : Number(p.basePrice),
                volume: variant ? variant.sizeName : "Standard",
                name: transEn.name || trans.name || "Product",
                nameAr: transAr.name || trans.name || "Product",
                descriptionEn: transEn.description || "",
                descriptionAr: transAr.description || "",
                gallery: p.images?.map((img: any) => img.url) || [image],
                notes: [],
            };
        });
    } catch (error) {
        console.error("Error fetching catalogue products:", error);
        return [];
    }
}

export async function getAllCategories(lang: string) {
    try {
        const { data: categories, error } = await supabase
            .from('Category')
            .select('*, translations:CategoryTranslation(*)')
            .eq('translations.language', lang);

        if (error || !categories) return [];

        return categories.map((c: any) => ({
            name: c.translations?.[0]?.name || "Unknown",
            href: `/${lang}/shop?category=${c.translations?.[0]?.slug || c.id}`
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
