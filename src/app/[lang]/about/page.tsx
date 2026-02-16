import { getDictionary } from "@/lib/dictionaries";
import { AboutContent } from "@/features/static-pages/components/AboutContent";
import { Metadata } from "next";
import { aboutPageData } from "@/data/about";
import { getStaticPageBySystemName } from "@/features/static-pages/actions";
import { getGlobalSeoSettings } from "@/features/seo/actions";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('ABOUT_US', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "About Us | MoroccanOrganica";
    const description = page?.translation?.metaDesc || page?.translation?.description?.substring(0, 160) || "Learn about our heritage and commitment to authentic organic Moroccan products.";
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

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
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
            <AboutContent data={aboutPageData} dict={dict} lang={lang} />
        </main>
    );
}
