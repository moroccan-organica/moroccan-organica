import { Metadata } from "next";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import HowToOrderPayClient from "./HowToOrderPayClient";

const SLUG = "how-to-order-pay";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName("HOW_TO_ORDER_PAY", lang);
    const globalSeo = await getGlobalSeoSettings(lang);
    const meta = {
        en: {
            title: "Organica Group - Order & payment",
            description: "Organica group - Paying by Paypal without an account",
            keywords: "Organica Group Order & payment,moroccanorganica.com Order and payment"
        },
        ar: {
            title: "Organica Group - الطلب والدفع",
            description: "مجموعة Organica - الدفع عن طريق Paypal بدون حساب",
            keywords: "طلب ودفع Organica Group، moroccanorganica.com الطلب والدفع"
        },
        fr: {
            title: "Organica Group - Commande & Paiement",
            description: "Organica group - Payer par Paypal sans compte",
            keywords: "Organica Group Commande & Paiement, moroccanorganica.com Commande et paiement"
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

export default async function HowToOrderPayPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main>
            <HowToOrderPayClient lang={lang} />
        </main>
    );
}
