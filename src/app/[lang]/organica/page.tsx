import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName, getGlobalSeoSettings, getCatalogueProducts, getTopSaleProducts } from "@/lib/queries";
import { Metadata } from "next";
import CatalogueClient from "./CatalogueClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('PRODUCTS', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || "Organica Collection | MoroccanOrganica";
    const description = page?.translation?.metaDesc || "Explore our full Organica collection of premium organic Moroccan beauty and wellness products.";
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

export default async function CataloguePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'products');
    const page = await getStaticPageBySystemName('PRODUCTS', lang);
    const products = await getCatalogueProducts(lang);
    const topProducts = await getTopSaleProducts(lang);

    return (
        <CatalogueClient
            pageData={page}
            products={products}
            topProducts={topProducts}
            dict={dict}
            lang={lang}
        />
    );
}
