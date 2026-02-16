import { getStaticPageBySlug } from "@/features/static-pages/actions";
import { Markdown } from "@/components/shared/Markdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGlobalSeoSettings } from "@/features/seo/actions";

// Re-validate content every hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const page = await getStaticPageBySlug(slug, lang);
    const globalSeo = await getGlobalSeoSettings(lang);

    if (!page || !page.translation) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.translation.metaTitle || page.translation.h1,
        description: page.translation.metaDesc || page.translation.description?.substring(0, 160),
        openGraph: {
            title: page.translation.metaTitle || page.translation.h1 || undefined,
            description: page.translation.metaDesc || undefined,
            images: page.translation.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
        },
        alternates: {
            canonical: page.translation.canonical || undefined,
        }
    };
}

export default async function GenericStaticPage({ params }: PageProps) {
    const { lang, slug } = await params;

    // Fetch page content from DB
    const page = await getStaticPageBySlug(slug, lang);

    if (!page || !page.translation) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container-main max-w-4xl mx-auto px-4">
                <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none">
                    {/* Render the markdown content */}
                    {page.translation.h1 && (
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-foreground">
                            {page.translation.h1}
                        </h1>
                    )}

                    {page.translation.description && (
                        <Markdown content={page.translation.description} />
                    )}
                </article>
            </div>
        </main>
    );
}
