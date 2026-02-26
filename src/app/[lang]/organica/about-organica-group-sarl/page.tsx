import { getDictionary } from "@/lib/dictionaries";
import AboutClient from "./AboutClient";
import { Metadata } from "next";
import { aboutPageData } from "@/data/about";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('ABOUT_US', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const meta = {
        en: {
            title: "Wholesale of organic cosmetics beauty products",
            description: "Help re-establish the link between the women Argan oil-cooperatives and Argan oil end customers",
            keywords: "Organica Group,Buy organic Oil,About Organica Group,Argan oil-cooperatives"
        },
        ar: {
            title: "بيع منتجات التجميل التجميلية العضوية بالجملة",
            description: "ساعد في إعادة إنشاء الرابط بين تعاونيات زيت أركان النسائية والعملاء النهائيين لزيت أركان",
            keywords: "اورجانيكا جروب ، شراء زيت عضوي ، حول اورجانيكا جروب ، زيت الارجان-التعاونيات "
        },
        fr: {
            title: "Vente en gros de produits cosmétiques de beauté biologiques",
            description: "Aider à rétablir le lien entre les coopératives de femmes productrices d'huile d'argan et les clients finaux d'huile d'argan",
            keywords: "Groupe Organica,Acheter de l'huile biologique,À propos du groupe Organica,Coopératives d'huile d'argan"
        }
    };

    const currentMeta = meta[lang as keyof typeof meta] || meta.en;

    const title = page?.translation?.metaTitle || currentMeta.title;
    const description = page?.translation?.metaDesc || currentMeta.description;
    const keywords = page?.translation?.keywords || currentMeta.keywords;

    const slug = "about-organica-group-sarl";

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
            url: `https://www.moroccanorganica.com/${lang}/organica/${slug}`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com/${lang}/organica/${slug}`,
        }
    };
}

export default async function AboutOrganicaPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'about');
    const page = await getStaticPageBySystemName('ABOUT_US', lang);

    // Apply DB overrides to the dictionary if available
    if (page?.translation) {
        if (!dict.hero) dict.hero = {};
        if (page.translation.h1) dict.hero.title = page.translation.h1;
        if (page.translation.description) dict.hero.description = page.translation.description;
    }

    return (
        <main>
            <AboutClient data={aboutPageData} dict={dict} lang={lang} />
        </main>
    );
}
