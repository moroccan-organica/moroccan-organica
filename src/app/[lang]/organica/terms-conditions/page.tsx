import { Metadata } from "next";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import TermsConditionsClient from "./TermsConditionsClient";

const SLUG = "terms-conditions";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName("TERMS_CONDITIONS", lang);
    const globalSeo = await getGlobalSeoSettings(lang);
    const meta = {
        en: {
            title: "Organica Group - Terms & Conditions",
            description: "Terms & Conditions Organica Group SARL This agreement was written in English.",
            keywords: "Organica Group SARL Terms & Conditions,moroccanorganica.com Terms and Conditions"
        },
        ar: {
            title: "Organica Group - الشروط والأحكام",
            description: "Terms & Conditions Organica Group SARL تمت كتابة هذه الاتفاقية باللغة الإنجليزية.",
            keywords: "شروط وأحكام شركة Organica Group SARL ، شروط وأحكام moroccanorganica.com"
        },
        fr: {
            title: "Organica Group - Conditions Générales",
            description: "Conditions Générales Organica Group SARL Cet accord a été rédigé en anglais.",
            keywords: "Organica Group SARL Conditions Générales, moroccanorganica.com Conditions Générales"
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

export default async function TermsConditionsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main>
            <TermsConditionsClient lang={lang} />
        </main>
    );
}
