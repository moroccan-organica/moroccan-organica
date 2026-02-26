import { getDictionary } from "@/lib/dictionaries";
import { getProducts } from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";
import { ShopPageClient } from "./ShopPageClient";
import { shopProducts, shopCategories } from "@/data/shop-products";
import { ShopProductDB, CategoryDB } from "@/types/product";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import { Metadata } from "next";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('SHOP', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "Shop | MoroccanOrganica";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || "Browse our collection of premium organic Moroccan products.";
    const keywords = page?.translation?.keywords || globalSeo?.translation?.defaultKeywords || "";

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com/${lang}/shop`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com/${lang}/shop`,
        }
    };
}

export default async function ShopPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'shop');

    // Try to fetch from database first, fallback to static data
    let products: ShopProductDB[] = [];
    let categories: CategoryDB[] = [];

    try {
        const [productsResult, categoriesResult] = await Promise.all([
            getProducts({ isAvailable: true, placement: 'shop' }),
            getCategories(),
        ]);

        products = productsResult.products;
        categories = categoriesResult;
    } catch (error) {
        console.error('Error fetching from database, using static data:', error);
    }

    // If no products from DB, use static data as fallback
    if (products.length === 0) {
        products = shopProducts.map(p => ({
            id: p.id,
            slug: p.slug,
            category: p.category,
            categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
            image: p.image,
            gallery: p.gallery || [],
            badge: p.badge,
            volume: p.volume,
            name: p.name,
            nameAr: p.nameAr,
            nameFr: p.name,
            description: p.description,
            descriptionAr: p.descriptionAr,
            descriptionFr: p.description,
            h1: p.name,
            h1Ar: p.nameAr,
            h1Fr: p.name,
            details: '',
            detailsAr: '',
            detailsFr: '',
            notes: p.notes,
            price: p.price,
            stock: p.stockQuantity || 100,
            isAvailable: true,
            isFeatured: p.badge === 'bestseller',
            isTopSale: false,
            placement: 'shop' as const,
            sku: p.id,
            variants: [],
            metaTitle: '',
            metaDesc: '',
            keywords: '',
        }));

        categories = shopCategories.map(c => ({
            id: c.id,
            image: null,
            name: c.name,
            nameAr: c.name,
            nameFr: c.name,
            slug: c.slug,
            slugAr: c.slug,
            slugFr: c.slug,
        }));
    }

    return (
        <ShopPageClient
            lang={lang}
            initialProducts={products}
            categories={categories}
            dict={dict as Record<string, unknown>}
        />
    );
}
