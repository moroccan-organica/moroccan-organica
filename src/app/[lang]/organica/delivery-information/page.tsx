import { Metadata } from "next";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import DeliveryInformationClient from "./DeliveryInformationClient";

const SLUG = "delivery-information";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName("DELIVERY_INFORMATION", lang);
    const globalSeo = await getGlobalSeoSettings(lang);
    const meta = {
        en: {
            title: "Organica Group - Delivery Information",
            description: "Delivery Information terms and conditions for Organica Group SARL .",
            keywords: "Organica Group SARL Delivery Information,moroccanorganica.com terms"
        },
        ar: {
            title: "Organica Group - معلومات التسليم",
            description: "أحكام وشروط معلومات التسليم لشركة Organica Group SARL.",
            keywords: "معلومات تسليم Organica Group SARL ، شروط moroccanorganica.com"
        },
        fr: {
            title: "Organica Group - Informations de livraison",
            description: "Conditions générales d'informations de livraison pour Organica Group SARL.",
            keywords: "Organica Group SARL Informations de livraison, moroccanorganica.com conditions"
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

export default async function DeliveryInformationPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main>
            <DeliveryInformationClient lang={lang} />
        </main>
    );
}
