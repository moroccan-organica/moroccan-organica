import { getDictionary } from "@/lib/dictionaries";
import { getProducts, getCategories } from "@/features/shop/actions";
import { ShopContent } from "@/features/shop/components/ShopContent";
import { ShopProductDB, CategoryDB } from "@/types/product";
import { getStaticPageBySystemName } from "@/features/static-pages/actions";
import { getGlobalSeoSettings } from "@/features/seo/actions";
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
        },
        alternates: {
            canonical: page?.translation?.canonical || undefined,
        }
    };
}

export default async function ShopPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'shop');

    let products: ShopProductDB[] = [];
    let categories: CategoryDB[] = [];

    try {
        const [productsResult, categoriesResult] = await Promise.all([
            getProducts({ isAvailable: true }),
            getCategories(),
        ]);

        products = productsResult.products;
        categories = categoriesResult;
    } catch (error) {
        console.error('Error fetching from database:', error);
    }

    return (
        <ShopContent
            lang={lang}
            initialProducts={products}
            categories={categories}
            dict={dict as Record<string, unknown>}
        />
    );
}
