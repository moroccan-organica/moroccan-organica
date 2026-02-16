import { getDictionary } from "@/lib/dictionaries";
import { ContactContent } from "@/features/static-pages/components/ContactContent";
import { contactPageData } from "@/data/contact";
import { getStaticPageBySystemName } from "@/features/static-pages/actions";
import { getGlobalSeoSettings } from "@/features/seo/actions";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('CONTACT', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "Contact Us | MoroccanOrganica";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || "Get in touch with MoroccanOrganica for wholesale premium Moroccan organic beauty products.";
    const keywords = page?.translation?.keywords || globalSeo?.translation?.defaultKeywords || "";

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
        },
        alternates: {
            canonical: page?.translation?.canonical || undefined,
        }
    };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'contact');
    const page = await getStaticPageBySystemName('CONTACT', lang);

    // Apply DB overrides to the dictionary if available
    if (page?.translation) {
        if (!dict.hero) dict.hero = {};
        if (page.translation.h1) dict.hero.title = page.translation.h1;
        if (page.translation.description) dict.hero.description = page.translation.description;
    }

    return (
        <ContactContent
            data={contactPageData}
            dict={dict}
            lang={lang}
        />
    );
}
