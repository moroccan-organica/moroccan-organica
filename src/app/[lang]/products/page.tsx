import { getDictionary } from "@/lib/dictionaries";
import { Metadata } from "next";
import { ProductsContent } from "@/features/shop/components/ProductsContent";
import { getStaticPageBySystemName } from "@/features/static-pages/actions";
import { getGlobalSeoSettings } from "@/features/seo/actions";
import { getProducts } from "@/features/shop/actions";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('PRODUCTS', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "Moroccan cosmetic wholesale | MoroccanOrganica";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || "Explore our collection of premium organic Moroccan beauty and wellness products.";
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

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const [dict, page, productsResult] = await Promise.all([
        getDictionary(lang, 'products'),
        getStaticPageBySystemName('PRODUCTS', lang),
        getProducts({ isTopSale: true })
    ]);

    const topProducts = productsResult.products.map(p => ({
        image: p.image,
        title: p.name,
        description: p.description,
        badge: "Top Seller",
        slug: p.slug
    }));

    return (
        <ProductsContent
            pageData={page}
            topProducts={topProducts}
            dict={dict}
            lang={lang}
        />
    );
}
