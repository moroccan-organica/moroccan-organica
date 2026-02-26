import { Metadata } from "next";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import ArganOilClient from "./ArganOilClient";

const SLUG = "argan-oil-of-morocco";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName("ARGAN_OIL_OF_MOROCCO", lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const meta = {
        en: {
            title: "leading of the argan oil producer in morocco",
            description: "Argan oil manufacturers in morocco, leading of the argan oil producer Wholesale partner who can supply you bulk argan oil and other organic product.",
            keywords: "argan oil producer morocco,supplier,producer,oil,oils,ecocert,morocco,affrica,supply chain,production,argan manufacturer morocco,argan oil production,argan oil,argan oil supplier,olvea,vegetable oil,organic argan,organic argan oil,argan morocco,leading morocan manufacturer,argan forest,oil morocco,argan oil cosmetic,leading argan producer,argan supplier,wholesale argan oil producer,argan distributor worldwide,arganoil bulk supplier,world leader argan"
        },
        ar: {
            title: "زيت الارجان المغربي الاصلي بالجملة",
            description: "شراء زيت الأرغان المغربي من مجموعة اورجانيكا المغربية بجودة عالية مباشرة من مصدره الاصلي من جنوب المغرب نقي و عضوي طبيعي 100٪ معتمد لدى وزارة الزراعة الأمريكية و ECOCERT - USDA.",
            keywords: "زيت أرغان، زيت الأرغان للجسم شراء زيت أرغان بالجملة، زيت الأرغان الاصلي، زيت الارغان للشعر الاصلي، فوائد زيت الأرغان، زيت الأرغان الأصلي"
        },
        fr: {
            title: "premier producteur d'huile d'argan au maroc",
            description: "Fabricants d'huile d'argan au maroc, premier producteur d'huile d'argan Partenaire de vente au gros qui peut vous fournir de l'huile d'argan en vrac et d'autres produits biologiques.",
            keywords: "producteur d'huile d'argan maroc, fournisseur, fabricant, huile, huiles, ecocert, maroc, afrique, chaîne d'approvisionnement, production, fabricant d'argan maroc, production d'huile d'argan, huile d'argan, fournisseur d'huile d'argan, huile végétale, argan biologique, huile d'argan biologique, argan maroc, premier fabricant marocain, forêt d'arganiers, huile maroc, cosmétique huile d'argan, premier producteur d'argan, fournisseur d'argan, producteur d'huile d'argan en gros, distributeur d'argan mondial, fournisseur d'huile d'argan en vrac, leader mondial argan"
        }
    };

    const currentMeta = meta[lang as keyof typeof meta] || meta.en;

    const title = page?.translation?.metaTitle || currentMeta.title;
    const description = page?.translation?.metaDesc || currentMeta.description;
    const keywords = page?.translation?.keywords || currentMeta.keywords;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: page?.translation?.ogImage
                ? [page.translation.ogImage]
                : globalSeo?.ogImage
                    ? [globalSeo.ogImage]
                    : [],
            url: `https://www.moroccanorganica.com/${lang}/organica/${SLUG}`,
        },
        alternates: {
            canonical:
                page?.translation?.canonical ||
                `https://www.moroccanorganica.com/${lang}/organica/${SLUG}`,
        },
    };
}

export default async function ArganOilOfMoroccoPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const page = await getStaticPageBySystemName("ARGAN_OIL_OF_MOROCCO", lang);

    return (
        <main>
            <ArganOilClient lang={lang} pageData={page} />
        </main>
    );
}
