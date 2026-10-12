import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from "@/lib/dictionaries";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog/actions";
import { getGlobalSeoSettings } from "@/lib/queries";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogPostTimeline } from "@/components/blog/BlogPostTimeline";
import { BlogHeaderImage } from "@/components/blog/BlogHeaderImage";
import { BlogPostViewTracker } from "@/components/blog/BlogPostViewTracker";
import { ArrowLeft } from 'lucide-react';
import type { BlogPostFull } from "@/types/blog";
import { getValidImageUrl, getLocalizedHref } from '@/lib/utils';
import { BlogCard } from '@/components/blog/BlogCard';
import { articleSchema, breadcrumbSchema, renderSchemas } from '@/lib/seo/schemas';

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = await getPublishedPostBySlug(slug);
    const globalSeo = await getGlobalSeoSettings(lang);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const isArabic = lang === 'ar';
    const isFrench = lang === 'fr';
    const postTitle = isArabic ? (post.title_ar || post.title) : (isFrench ? (post.title_fr || post.title) : post.title);
    const postExcerpt = isArabic ? (post.excerpt_ar || post.excerpt) : (isFrench ? (post.excerpt_fr || post.excerpt) : post.excerpt);
    const title = post.meta_title || postTitle;
    const cleanDesc = post.meta_description || (postExcerpt
        ? postExcerpt.replace(/<[^>]*>/g, '').trim().substring(0, 160)
        : (post.content ? post.content.replace(/<[^>]*>/g, '').trim().substring(0, 160) : title));

    const image = post.featured_image_url || globalSeo?.ogImage || undefined;
    const canonicalUrl = `https://www.moroccanorganica.com${getLocalizedHref(`/blog-details/${slug}`, lang)}`;

    return {
        title: title,
        description: cleanDesc,
        openGraph: {
            title: title,
            description: cleanDesc,
            images: image ? [image] : [],
            url: canonicalUrl,
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            modifiedTime: post.updated_at || post.created_at,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: cleanDesc,
            images: image ? [image] : [],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { lang, slug } = await params;

    const [post, dict] = await Promise.all([
        getPublishedPostBySlug(slug),
        getDictionary(lang, 'blog') as Promise<Record<string, unknown>>,
    ]);

    if (!post) {
        notFound();
    }

    let relatedPosts: BlogPostFull[] = [];
    try {
        const { posts } = await getPublishedPosts({
            page: 1,
            pageSize: 4,
            categoryId: post.category_id,
        });
        relatedPosts = posts.filter((p: BlogPostFull) => p.id !== post.id).slice(0, 3);
    } catch (error) {
        console.error('Error fetching related posts:', error);
    }

    const isArabic = lang === 'ar';
    const isFrench = lang === 'fr';
    const title = isArabic ? (post.title_ar || post.title) : (isFrench ? (post.title_fr || post.title) : post.title);
    const content = isArabic ? (post.content_ar || post.content) : (isFrench ? (post.content_fr || post.content) : post.content);
    const featuredImageUrl = getValidImageUrl(post.featured_image_url);

    return (
        <main className="min-h-screen bg-white">
            <BlogPostViewTracker postId={post.id} title={title} />
            {/* Article + Breadcrumb Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: renderSchemas(
                        articleSchema({
                            title: title,
                            description: content ? content.replace(/<[^>]*>/g, '').substring(0, 200) : title,
                            image: featuredImageUrl !== '/images/placeholder.svg' ? featuredImageUrl : undefined,
                            slug: slug,
                            lang: lang,
                            publishedAt: post.created_at,
                            updatedAt: post.updated_at || post.created_at,
                            tags: post.tags || [],
                            category: post.category?.name,
                        }),
                        breadcrumbSchema([
                            { name: isArabic ? 'الصفحة الرئيسية' : (isFrench ? 'Accueil' : 'Home'), url: `https://www.moroccanorganica.com${getLocalizedHref('/', lang)}` },
                            { name: isArabic ? 'مقالات' : 'Blog', url: `https://www.moroccanorganica.com${getLocalizedHref('/blog', lang)}` },
                            { name: title }
                        ])
                    )
                }}
            />
            {/* Post Header */}
            <div className="relative h-[70vh] min-h-[500px] w-full">
                <BlogHeaderImage
                    src={featuredImageUrl}
                    alt={title}
                    defaultImage="/images/placeholder.svg"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end pb-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <Link
                                href={getLocalizedHref('/blog', lang)}
                                className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ${isArabic ? 'flex-row-reverse' : ''}`}
                            >
                                <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                                {dict.backToBlog as string}
                            </Link>
                            <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-8 leading-tight text-center" dir={isArabic ? 'rtl' : 'ltr'}>
                                {title}
                            </h1>
                            <div className="flex justify-center mt-4">
                                <Link
                                    href={getLocalizedHref('/organica/essential-oils-wholesale-suppliers', lang)}
                                    className="bg-[#F9E28B] text-[#114232] font-bold py-3 px-8 rounded-xl text-lg hover:scale-105 transition-all duration-300 uppercase tracking-wide shadow-xl"
                                >
                                    {(dict.banner as any)?.button || "Shop Now"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col xl:flex-row gap-16 justify-center">
                    {/* Left Sidebar - Timeline */}
                    <BlogPostTimeline content={content} />

                    {/* Main Content */}
                    <article className={`max-w-3xl w-full ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                        <BlogPostContent
                            content={content}
                            contentUnavailableText={dict.contentUnavailable as string}
                        />

                        {/* Post Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-slate-100">
                                <div className="flex flex-wrap gap-3">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-4 py-1.5 bg-slate-50 text-[#606C38] text-sm font-medium rounded-full border border-slate-100"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Right Sidebar - Potential for related posts or info */}
                    <div className="hidden xl:block w-64" />
                </div>
            </div>

            {relatedPosts.length > 0 && (
                <div className="bg-slate-50/60 border-t border-slate-100">
                    <div className="container mx-auto px-4 py-16">
                        <div className={`flex items-center justify-between mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-slate-900" dir={isArabic ? 'rtl' : 'ltr'}>
                                {(dict.relatedPosts as string) || 'Related Posts'}
                            </h2>
                            <Link href={getLocalizedHref('/blog', lang)} className="text-[#BC6C25] font-semibold text-sm hover:underline">
                                {dict.backToBlog as string}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {relatedPosts.map((related) => (
                                <BlogCard
                                    key={related.id}
                                    post={related}
                                    lang={lang}
                                    translations={{
                                        readMore: dict.readMore as string,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}
