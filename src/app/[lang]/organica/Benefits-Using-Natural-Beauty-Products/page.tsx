'use server';

import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import type { Metadata } from "next";
import { BenefitsClient } from "./BenefitsClient";
import { getLocalizedHref } from "@/lib/utils";

/** Arabic SEO defaults when CMS has no BENEFITS translation for `ar`. */
const AR_BENEFITS_META_TITLE = "فوائد منتجات التجميل المغربية الطبيعية للبشرة والشعر";
const AR_BENEFITS_META_DESCRIPTION =
    "اكتشفي فوائد منتجات التجميل المغربية الطبيعية: زيت الأرغان، والصابون المغربي التقليدي، وماء الورد، وزيت بذور التين الشوكي لترطيب البشرة والشعر ومنحهما إشراقةً ونضارةً.";
const AR_BENEFITS_KEYWORDS =
    "منتجات التجميل المغربية، فوائد زيت الأرغان، الصابون المغربي التقليدي، ماء الورد الطبيعي، زيت بذور التين الشوكي، العناية بالبشرة، العناية بالشعر، منتجات طبيعية";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('BENEFITS', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title =
        page?.translation?.metaTitle ||
        page?.translation?.h1 ||
        (lang === 'ar'
            ? AR_BENEFITS_META_TITLE
            : lang === 'fr'
                ? "Les bienfaits des produits de beauté naturels : pourquoi choisir des soins bio et écologiques ?"
                : "Benefits of Moroccan Beauty Products | Natural Skincare & Haircare from Morocco");
    const description =
        page?.translation?.metaDesc ||
        page?.translation?.description?.substring(0, 160) ||
        (lang === 'ar'
            ? AR_BENEFITS_META_DESCRIPTION
            : lang === 'fr'
                ? "Explorez les bienfaits des produits de beauté naturels pour votre routine de soins. Découvrez comment les cosmétiques bio et écologiques peuvent améliorer la santé de votre peau, réduire les irritations et protéger l’environnement."
                : "Discover the powerful benefits of Moroccan beauty products including Argan Oil, Prickly Pear Seed Oil, Black Soap and Rhassoul Clay. Rich in antioxidants and essential nutrients, Moroccan natural cosmetics support healthy skin, strong hair, anti-aging care, and deep hydration. Available for wholesale and private label.");
    const keywords =
        page?.translation?.keywords ||
        globalSeo?.translation?.defaultKeywords ||
        (lang === 'ar'
            ? AR_BENEFITS_KEYWORDS
            : lang === 'fr'
                ? "benefits of natural beauty products, organic skincare, eco-friendly beauty products, skincare routine natural, benefits organic cosmetics, eco-friendly cosmetics, natural beauty products for skin, healthy skin with natural products, advantages of organic skincare"
                : "benefits of Moroccan beauty products, Moroccan cosmetics benefits, natural Moroccan skincare, Moroccan argan oil benefits, prickly pear oil benefits, Moroccan black soap benefits, rhassoul clay skincare, organic Moroccan beauty products, Moroccan cosmetic ingredients wholesale");

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com${getLocalizedHref('/organica/Benefits-Using-Natural-Beauty-Products', lang)}`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com${getLocalizedHref('/organica/Benefits-Using-Natural-Beauty-Products', lang)}`,
        }
    };
}

export default async function BenefitsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    const [blogDict, page] = await Promise.all([
        getDictionary(lang, 'blog'),
        getStaticPageBySystemName('BENEFITS', lang)
    ]);

    const isArabic = lang === 'ar';
    const isFrench = lang === 'fr';

    const heroTitle =
        page?.translation?.h1 ||
        (isArabic
            ? AR_BENEFITS_META_TITLE
            : isFrench
                ? "Les principaux bienfaits des produits de beauté naturels pour une peau saine"
                : "Benefits of Moroccan Beauty Products for Skin, Hair & Natural Wellness");

    const heroSubtitle =
        page?.translation?.description ||
        (isArabic
            ? AR_BENEFITS_META_DESCRIPTION
            : isFrench
                ? "Explorez les bienfaits des produits de beauté naturels pour votre routine de soins. Découvrez comment les cosmétiques bio et écologiques peuvent améliorer la santé de votre peau, réduire les irritations et protéger l’environnement."
                : "Discover the powerful benefits of Moroccan beauty products including Argan Oil, Prickly Pear Seed Oil, Black Soap and Rhassoul Clay.");

    const searchPlaceholder =
        (blogDict as Record<string, string>)?.searchPlaceholder ||
        (isArabic ? "بحث..." : isFrench ? "Rechercher un article..." : "Search...");

    const readMoreLabel =
        (blogDict as Record<string, string>)?.readMore ||
        (isArabic ? "اقرأ المزيد" : isFrench ? "En savoir plus" : "Read More");

    return (
        <BenefitsClient
            lang={lang}
            heroTitle={heroTitle}
            heroSubtitle={heroSubtitle}
            searchPlaceholder={searchPlaceholder}
            readMoreLabel={readMoreLabel}
        />
    );
}
