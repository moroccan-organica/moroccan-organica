import { getDictionary } from "@/lib/dictionaries";
import FaqClient from "./FaqClient";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import { Metadata } from "next";
import { getLocalizedHref } from "@/lib/utils";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('FAQ', lang);
    const globalSeo = await getGlobalSeoSettings(lang);
    const dict = await getDictionary(lang, 'faq');

    const title = page?.translation?.metaTitle || page?.translation?.h1 || dict.title || "FAQ | Moroccan Organica";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || dict.description || "";
    const keywords = page?.translation?.keywords || globalSeo?.translation?.defaultKeywords || dict.keywords || "";

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com${getLocalizedHref('/faq', lang)}`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com${getLocalizedHref('/faq', lang)}`,
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'faq');
    const page = await getStaticPageBySystemName('FAQ', lang);

    // Apply DB overrides if available
    if (page?.translation) {
        if (!dict.hero) dict.hero = {};
        if (page.translation.h1) dict.hero.title = page.translation.h1;
        if (page.translation.description) dict.hero.description = page.translation.description;
    }

    return (
        <FaqClient
            lang={lang}
            dict={dict}
        />
    );
}
