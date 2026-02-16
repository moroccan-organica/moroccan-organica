'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from "@/lib/dictionaries";
import { getPublishedPostBySlug, incrementPostViewCount } from "@/features/blog/actions";
import { BlogPostContent } from "@/features/blog/components/BlogPostContent";
import { BlogPostMeta } from "@/features/blog/components/BlogPostMeta";
import { BlogPostTimeline } from "@/features/blog/components/BlogPostTimeline";
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { BlogPostFull } from "@/types/blog";

export default function BlogPostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = React.use(params);
    const [dict, setDict] = useState<Record<string, unknown> | null>(null);
    const [post, setPost] = useState<BlogPostFull | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        getDictionary(lang, 'blog').then(setDict);
    }, [lang]);

    useEffect(() => {
        async function fetchPost() {
            setIsLoading(true);
            try {
                const fetchedPost = await getPublishedPostBySlug(slug);
                if (fetchedPost) {
                    setPost(fetchedPost);
                    await incrementPostViewCount(fetchedPost.id);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPost();
    }, [slug]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#606C38]" />
            </main>
        );
    }

    if (notFound || !post) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
                <Link 
                    href={`/${lang}/blog`}
                    className="text-[#606C38] hover:underline flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Link>
            </main>
        );
    }

    if (!dict) return null;

    const defaultImage = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop';
    const featuredImage = post.featured_image_url || defaultImage;
    
    // Select content based on language
    const isArabic = lang === 'ar';
    const title = isArabic && post.title_ar ? post.title_ar : post.title;
    const content = isArabic && post.content_ar?.content?.length ? post.content_ar : post.content;

    return (
        <main className="min-h-screen bg-white">
            {/* Post Header */}
            <div className="relative h-[70vh] min-h-[500px] w-full">
                <Image 
                    src={featuredImage} 
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end pb-20">
                    <div className="container mx-auto px-4">
                        <div className={`max-w-4xl ${isArabic ? 'text-right mr-auto ml-0' : ''}`}>
                            <Link 
                                href={`/${lang}/blog`}
                                className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ${isArabic ? 'flex-row-reverse' : ''}`}
                            >
                                <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
                                {dict.backToBlog as string}
                            </Link>
                            <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-8 leading-tight" dir={isArabic ? 'rtl' : 'ltr'}>
                                {title}
                            </h1>
                            
                            <BlogPostMeta 
                                author={post.author}
                                publishedAt={post.published_at}
                                createdAt={post.created_at}
                                readTimeMinutes={post.read_time_minutes}
                                onShare={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: post.title,
                                            url: window.location.href
                                        });
                                    }
                                }}
                                translations={{
                                    author: dict.by as string,
                                    share: dict.share as string,
                                    readTime: dict.minRead as string
                                }}
                            />
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
        </main>
    );
}
