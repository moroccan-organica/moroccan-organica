import { Metadata } from "next";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import HowToOrderPayClient from "./HowToOrderPayClient";
import { getLocalizedHref } from "@/lib/utils";

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
            title: "How to Order & Pay | Private Label Moroccan Beauty Products | Organica Group",
            description: "Learn how to order private label Moroccan beauty products from Organica Group. Free label design support, clear payment process, and product photo approval before shipping.",
            keywords: "private label Moroccan beauty products, how to order Moroccan cosmetics, Moroccan cosmetic supplier, argan oil private label, prickly pear seed oil wholesale, Moroccan black soap supplier, Organica Group, bulk Moroccan beauty products, private label skincare Morocco, Moroccan cosmetics wholesale"
        },
        ar: {
            title: "كيفية الطلب والدفع | منتجات التجميل المغربية بالماركة الخاصة | مجموعة أورجانيكا",
            description: "تعرف على كيفية طلب منتجات التجميل المغربية بالماركة الخاصة من مجموعة أورجانيكا. دعم مجاني لتصميم الملصقات، عملية دفع واضحة، والموافقة على صور المنتجات قبل الشحن.",
            keywords: "منتجات تجميل مغربية ماركة خاصة, كيفية طلب مستحضرات التجميل المغربية, مورد مستحضرات تجميل مغربية, زيت أركان ماركة خاصة, زيت بذور التين الشوكي بالجملة, مورد الصابون البلدي المغربي, مجموعة أورجانيكا, منتجات تجميل مغربية بالجملة"
        },
        fr: {
            title: "Comment commander et payer | Produits de beauté marocains de marque privée | Organica Group",
            description: "Découvrez comment commander des produits cosmétiques marocains en marque privée auprès d'Organica Group. Conception d'étiquettes gratuite, processus de paiement clair et envoi de photos avant expédition.",
            keywords: "produits de beauté marocains marque privée, comment commander cosmétiques marocains, fournisseur cosmétiques marocains, huile d'argan marque privée, huile de figue de barbarie en gros, savon noir marocain fournisseur, Organica Group, produits cosmétiques marocains en vrac"
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
            url: `https://www.moroccanorganica.com${getLocalizedHref(`/organica/${SLUG}`, lang)}`,
        },
        alternates: {
            canonical:
                page?.translation?.canonical ||
                `https://www.moroccanorganica.com${getLocalizedHref(`/organica/${SLUG}`, lang)}`,
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
