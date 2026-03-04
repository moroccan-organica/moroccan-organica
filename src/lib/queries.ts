import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';
import { CACHE_TAGS } from './cache-tags';
import { getLocalizedHref } from './utils';

// ─────────────────────────────────────────────────────────────────────────────
// STATIC PAGES
// ─────────────────────────────────────────────────────────────────────────────

async function _getStaticPageBySystemName(systemName: string, lang: string) {
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

export const getStaticPageBySystemName = async (systemName: string, lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getStaticPageBySystemName(systemName, lang),
        [CACHE_TAGS.STATIC_PAGE(systemName), lang],
        { tags: [CACHE_TAGS.STATIC_PAGES, CACHE_TAGS.STATIC_PAGE(systemName)] }
    )();

    if (cachedResult) return cachedResult;
    return await _getStaticPageBySystemName(systemName, lang);
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL SEO
// ─────────────────────────────────────────────────────────────────────────────

async function _getGlobalSeoSettings(lang: string) {
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

export const getGlobalSeoSettings = async (lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getGlobalSeoSettings(lang),
        [CACHE_TAGS.STATIC_PAGES, `global-seo-${lang}`],
        { tags: [CACHE_TAGS.STATIC_PAGES] }
    )();

    if (cachedResult) return cachedResult;
    return await _getGlobalSeoSettings(lang);
};

// ─────────────────────────────────────────────────────────────────────────────
// STATIC PAGE BY SLUG
// ─────────────────────────────────────────────────────────────────────────────

async function _getStaticPageBySlug(slug: string, lang: string) {
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

export const getStaticPageBySlug = async (slug: string, lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getStaticPageBySlug(slug, lang),
        [CACHE_TAGS.STATIC_PAGES, `static-slug-${slug}-${lang}`],
        { tags: [CACHE_TAGS.STATIC_PAGES] }
    )();

    if (cachedResult) return cachedResult;
    return await _getStaticPageBySlug(slug, lang);
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED PRODUCTS (home page categories section)
// ─────────────────────────────────────────────────────────────────────────────

async function _getFeaturedProducts(lang: string) {
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
            .order('createdAt', { ascending: false })
            .limit(30);

        if (error || !products) return [];

        return products.map((p: any) => {
            const trans = p.translations?.find((t: any) => t.language === lang) || p.translations?.[0] || {};
            const transEn = p.translations?.find((t: any) => t.language === 'en') || p.translations?.[0] || {};
            const catTrans = p.category?.translations?.find((t: any) => t.language === lang) || p.category?.translations?.[0] || {};
            const image = p.images?.[0]?.url || p.category?.image || "/images/placeholder.svg";

            return {
                title: trans.name || "Untitled Product",
                subtitle: catTrans.name || "Category",
                image: image,
                slug: trans.slug || transEn.slug || p.id
            };
        });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}

export const getFeaturedProducts = async (lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getFeaturedProducts(lang),
        [CACHE_TAGS.PRODUCTS, `featured-${lang}`],
        { tags: [CACHE_TAGS.PRODUCTS] }
    )();

    if (cachedResult && cachedResult.length > 0) return cachedResult;
    return await _getFeaturedProducts(lang);
};

// ─────────────────────────────────────────────────────────────────────────────
// TOP SALE PRODUCTS (home page products section)
// ─────────────────────────────────────────────────────────────────────────────

async function _getTopSaleProducts(lang: string) {
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
                slug: trans.slug || transEn.slug || p.id,
                category: catTrans.name || "Category",
                price: variant ? Number(variant.price) : Number(p.basePrice),
                volume: variant ? variant.sizeName : "Standard",
                name: transEn.name || trans.name || "Product",
                nameAr: transAr.name || trans.name || "Product",
                descriptionEn: transEn.description || "",
                descriptionAr: transAr.description || "",
                gallery: [image],
                notes: [],
            };
        });
    } catch (error) {
        console.error("Error fetching top sale products:", error);
        return [];
    }
}

export const getTopSaleProducts = async (lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getTopSaleProducts(lang),
        [CACHE_TAGS.PRODUCTS, `topsale-${lang}`],
        { tags: [CACHE_TAGS.PRODUCTS] }
    )();

    if (cachedResult && cachedResult.length > 0) return cachedResult;
    return await _getTopSaleProducts(lang);
};

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

async function _getCatalogueProducts(lang: string) {
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
                slug: trans.slug || transEn.slug || p.id,
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

export const getCatalogueProducts = async (lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getCatalogueProducts(lang),
        [CACHE_TAGS.PRODUCTS, `catalogue-${lang}`],
        { tags: [CACHE_TAGS.PRODUCTS] }
    )();

    if (cachedResult && cachedResult.length > 0) return cachedResult;
    return await _getCatalogueProducts(lang);
};

// ─────────────────────────────────────────────────────────────────────────────
// ALL CATEGORIES (nav / shop filter)
// ─────────────────────────────────────────────────────────────────────────────

async function _getAllCategories(lang: string) {
    try {
        const { data: categories, error } = await supabase
            .from('Category')
            .select('*, translations:CategoryTranslation(*)')
            .eq('translations.language', lang);

        if (error || !categories) return [];

        return categories.map((c: any) => ({
            name: c.translations?.[0]?.name || "Unknown",
            href: getLocalizedHref(`/shop?category=${c.translations?.[0]?.slug || c.id}`, lang)
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export const getAllCategories = async (lang: string) => {
    const cachedResult = await unstable_cache(
        () => _getAllCategories(lang),
        [CACHE_TAGS.CATEGORIES, `all-categories-${lang}`],
        { tags: [CACHE_TAGS.CATEGORIES] }
    )();

    if (cachedResult && cachedResult.length > 0) return cachedResult;
    return await _getAllCategories(lang);
};
