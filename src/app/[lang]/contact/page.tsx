import { getDictionary } from "@/lib/dictionaries";
import ContactClient from "./ContactClient";
import { contactPageData } from "@/data/contact";
import { getStaticPageBySystemName, getGlobalSeoSettings } from "@/lib/queries";
import { Metadata } from "next";
import { getLocalizedHref } from "@/lib/utils";
import { contactPageSchema, breadcrumbSchema, renderSchemas } from "@/lib/seo/schemas";
import Script from "next/script";

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
            url: `https://www.moroccanorganica.com${getLocalizedHref('/contact', lang)}`,
        },
        alternates: {
            canonical: page?.translation?.canonical || `https://www.moroccanorganica.com${getLocalizedHref('/contact', lang)}`,
        }
    };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'contact') as any;
    const page = await getStaticPageBySystemName('CONTACT', lang);

    // Apply DB overrides to the dictionary if available
    if (page?.translation) {
        if (!dict.hero) dict.hero = {};
        if (page.translation.h1) dict.hero.title = page.translation.h1;
        if (page.translation.description) dict.hero.description = page.translation.description;
    }

    return (
        <>
            <Script
                id="contact-schema"
                strategy="afterInteractive"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: renderSchemas(
                        contactPageSchema(lang),
                        breadcrumbSchema([
                            { name: lang === 'ar' ? 'الصفحة الرئيسية' : (lang === 'fr' ? 'Accueil' : 'Home'), url: `https://www.moroccanorganica.com${getLocalizedHref('/', lang)}` },
                            { name: lang === 'ar' ? 'اتصل بنا' : (lang === 'fr' ? 'Contact' : 'Contact Us') }
                        ])
                    )
                }}
            />
            <ContactClient
                data={contactPageData}
                dict={dict}
            />
        </>
    );
}
