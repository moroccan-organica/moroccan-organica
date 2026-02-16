import { getDictionary } from "@/lib/dictionaries";
import { BlogContent } from "@/features/blog/components/BlogContent";
import { getBlogCategories } from "@/features/blog/actions";
import { Metadata } from "next";
import { getStaticPageBySystemName } from "@/features/static-pages/actions";
import { getGlobalSeoSettings } from "@/features/seo/actions";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const page = await getStaticPageBySystemName('BLOG', lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = page?.translation?.metaTitle || page?.translation?.h1 || "Blog | Moroccan Organica";
    const description = page?.translation?.metaDesc || globalSeo?.translation?.defaultMetaDesc || "";
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
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'blog');
    const categories = await getBlogCategories();

    return (
        <BlogContent
            lang={lang}
            dictionary={dict}
            initialCategories={categories}
        />
    );
}
