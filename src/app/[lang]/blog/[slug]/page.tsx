'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from "@/lib/dictionaries";
import { mockBlogPosts } from "@/data/mock-blog";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogPostMeta } from "@/components/blog/BlogPostMeta";
import { BlogPostTimeline } from "@/components/blog/BlogPostTimeline";
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = React.use(params);
    const [dict, setDict] = useState<Record<string, unknown> | null>(null);

    React.useEffect(() => {
        getDictionary(lang, 'blog').then(setDict);
    }, [lang]);

    const post = mockBlogPosts.find(p => p.slug === slug);

    if (!dict || !post) return null;

    return (
        <main className="min-h-screen bg-white">
            {/* Post Header */}
            <div className="relative h-[70vh] min-h-[500px] w-full">
                <Image 
                    src={post.featured_image_url} 
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end pb-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl">
                            <Link 
                                href={`/${lang}/blog`}
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {dict.backToBlog as string}
                            </Link>
                            <h1 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-8 leading-tight">
                                {post.title}
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
                    <BlogPostTimeline content={post.content} />

                    {/* Main Content */}
                    <article className="max-w-3xl w-full">
                        <BlogPostContent 
                            content={post.content} 
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
