'use server';

import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import type { Metadata } from "next";
import { BenefitsClient } from "./BenefitsClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('BENEFITS', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "Benefits of Moroccan Beauty Products | Natural Skincare & Haircare from Morocco";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || "Discover the powerful benefits of Moroccan beauty products including Argan Oil, Prickly Pear Seed Oil, Black Soap and Rhassoul Clay. Rich in antioxidants and essential nutrients, Moroccan natural cosmetics support healthy skin, strong hair, anti-aging care, and deep hydration. Available for wholesale and private label.";
    const keywords = page?.translation?.keywords || globalSeo?.translation?.defaultKeywords || "benefits of Moroccan beauty products, Moroccan cosmetics benefits, natural Moroccan skincare, Moroccan argan oil benefits, prickly pear oil benefits, Moroccan black soap benefits, rhassoul clay skincare, organic Moroccan beauty products, Moroccan cosmetic ingredients wholesale";

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com/${lang}/benefits`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com/${lang}/benefits`,
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

    const heroTitle = page?.translation?.h1 || (isArabic ? "فوائد منتجاتنا" : "Benefits of Moroccan Beauty Products for Skin, Hair & Natural Wellness");
    const heroSubtitle = page?.translation?.description || (isArabic
        ? "اكتشف الفوائد المذهلة لمكونات التجميل الطبيعية المغربية"
        : "Discover the powerful benefits of Moroccan beauty products including Argan Oil, Prickly Pear Seed Oil, Black Soap and Rhassoul Clay.");
    const searchPlaceholder = (blogDict as Record<string, string>)?.searchPlaceholder || (isArabic ? "بحث..." : "Search...");
    const readMoreLabel = (blogDict as Record<string, string>)?.readMore || (isArabic ? "اقرأ المزيد" : "Read More");

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
