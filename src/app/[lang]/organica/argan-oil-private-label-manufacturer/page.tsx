import { getDictionary } from "@/lib/dictionaries";
import PrivateLabelClient from "./PrivateLabelClient";
import { privateLabelData } from "@/data/private-label";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import { Metadata } from "next";
import { getLocalizedHref } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('PRIVATE_LABEL', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "Argan oil manufacturer private-label service";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || "private labeling is available for all our products , All you have to do is send us a physical or a digital sample of your label, organic argan oil private label";
    const keywords = page?.translation?.keywords || "private label products, private label cosmetics, private label wholesale, private label manufacturers, private label skincare, Health, and beauty private label, white label products to sell";

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com${getLocalizedHref('/organica/argan-oil-private-label-manufacturer', lang)}`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com${getLocalizedHref('/organica/argan-oil-private-label-manufacturer', lang)}`,
        }
    };
}

export default async function PrivateLabelPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'private-label') as any;
    const page = await getStaticPageBySystemName('PRIVATE_LABEL', lang);

    // Apply DB overrides to the dictionary if available
    if (page?.translation) {
        if (!dict.hero) dict.hero = {};
        if (page.translation.h1) dict.hero.title = page.translation.h1;
        if (page.translation.description) dict.hero.description = page.translation.description;
    }

    return (
        <PrivateLabelClient
            data={privateLabelData}
            dict={dict}
            lang={lang}
        />
    );
}
