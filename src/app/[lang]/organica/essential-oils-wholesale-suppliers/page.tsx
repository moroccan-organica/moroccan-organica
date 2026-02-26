import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName, getGlobalSeoSettings, getCatalogueProducts } from "@/lib/queries";
import { Metadata } from "next";
import CatalogueClient from "../CatalogueClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('ORGANICA', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const defaultTitle = lang === 'en' ? "Wholesale suppliers | Organic Essential Oils" :
        (page?.translation?.metaTitle || "Organic Essential Oils Wholesale Suppliers | MoroccanOrganica");

    const defaultDesc = lang === 'en' ? "Made safe for skin in a plant-oil base.100% naturally derived. bergamot oil,lavender fleurs oil,eucalyptus oil,patchouli oil,tangerine oil,peppermint oil,vanilla absolute oil" :
        (page?.translation?.metaDesc || "Explore our premium organic Moroccan essential oils for wholesale, 100% pure and natural.");

    const defaultKeywords = lang === 'en' ? "wholesale essential oils,lavender fleurs oil,eucalyptus oil,patchouli oil,tangerine oil,peppermint oil,vanilla absolute oil" :
        (page?.translation?.keywords || globalSeo?.translation?.defaultKeywords || "");

    const title = page?.translation?.metaTitle || defaultTitle;
    const description = page?.translation?.metaDesc || defaultDesc;
    const keywords = page?.translation?.keywords || defaultKeywords;

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com/${lang}/organica/essential-oils-wholesale-suppliers`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com/${lang}/organica/essential-oils-wholesale-suppliers`,
        }
    };
}

export default async function CataloguePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'products');
    const page = await getStaticPageBySystemName('ORGANICA', lang);
    const products = await getCatalogueProducts(lang);

    return (
        <CatalogueClient
            pageData={page}
            products={products}
            dict={dict}
            lang={lang}
        />
    );
}
