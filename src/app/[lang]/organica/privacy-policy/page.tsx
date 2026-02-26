import { Metadata } from "next";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

const SLUG = "privacy-policy";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName("PRIVACY_POLICY", lang);
    const globalSeo = await getGlobalSeoSettings(lang);
    const meta = {
        en: {
            title: "Organica Group - Privacy policy",
            description: "moroccanorganica.com we,us or the \"Company\" is committed to guarantee the privacy protection. We understand the importance of keeping personal information private and secure. This policy describes generally how we manage personal information. If you would like more information, please don’t hesitate to contact us.",
            keywords: "Organica Group privacy policy,moroccanorganica.com terms"
        },
        ar: {
            title: "Organica Group - سياسة الخصوصية",
            description: "moroccanorganica.com نحن أو \"الشركة\" ملتزمون بضمان حماية الخصوصية. نحن نتفهم أهمية الحفاظ على خصوصية المعلومات الشخصية وأمانها. تصف هذه السياسة بشكل عام كيفية إدارتنا للمعلومات الشخصية. إذا كنت ترغب في مزيد من المعلومات ، فلا تتردد في الاتصال بنا. ",
            keywords: "سياسة خصوصية Organica Group ، شروط moroccanorganica.com"
        },
        fr: {
            title: "Organica Group - Politique de confidentialité",
            description: "moroccanorganica.com nous, ou la \"Société\" s'engage à garantir la protection de la vie privée. Nous comprenons l'importance de garder les informations personnelles privées et sécurisées. Cette politique décrit généralement comment nous gérons les informations personnelles. Si vous souhaitez plus d'informations, n'hésitez pas à nous contacter.",
            keywords: "Organica Group politique de confidentialité, moroccanorganica.com conditions"
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

export default async function PrivacyPolicyPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main>
            <PrivacyPolicyClient lang={lang} />
        </main>
    );
}
