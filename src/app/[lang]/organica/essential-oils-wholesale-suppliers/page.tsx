import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName, getGlobalSeoSettings, getCatalogueProducts } from "@/lib/queries";
import { Metadata } from "next";
import CatalogueClient from "../CatalogueClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('ORGANICA', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const meta = {
        en: {
            title: "Wholesale suppliers | Organic Essential Oils",
            description: "Made safe for skin in a plant-oil base.100% naturally derived. bergamot oil,lavender fleurs oil,eucalyptus oil,patchouli oil,tangerine oil,peppermint oil,vanilla absolute oil",
            keywords: "wholesale essential oils,lavender fleurs oil,eucalyptus oil,patchouli oil,tangerine oil,peppermint oil,vanilla absolute oil"
        },
        ar: {
            title: "زيوت عطرية اصلية بالجملة",
            description: "الزيوت العطرية هي مركبات طبيعية مستخلصة من نباتات مختلفة، وتتميز بروائح ومذاقات مركزة مثل ، زيت البرغموت ، زيت اللافندر ، زيت الأوكالبتوس ، زيت الباتشولي ، زيت اليوسفي ، زيت النعناع ، زيت الفانيليا",
            keywords: "زيوت عطرية, زيت عطري, الزيوت العطرية, زيوت عطرية بالجملة, زيوت عطرية خام, زيوت عطريه خام, زيوت عطرية للجسم,  زيوت عطريه خام"
        },
        fr: {
            title: "Fournisseurs en gros | Huiles essentielles biologiques",
            description: "Conçu pour être sans danger pour la peau dans une base d'huile végétale. Dérivé à 100% naturellement. huile de bergamote, huile de lavande fleurs, huile d'eucalyptus, huile de patchouli, huile de mandarine, huile de menthe poivrée, huile d'absolue de vanille",
            keywords: "huiles essentielles en gros, huile de lavande fleurs, huile d'eucalyptus, huile de patchouli, huile de mandarine, huile de menthe poivrée, huile d'absolue de vanille"
        }
    };

    const currentMeta = meta[lang as keyof typeof meta] || meta.en;

    const title = page?.translation?.metaTitle || currentMeta.title;
    const description = page?.translation?.metaDesc || currentMeta.description;
    const keywords = page?.translation?.keywords || currentMeta.keywords;

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
    const dict = await getDictionary(lang, 'products') as any;
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
