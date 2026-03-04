import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BenefitPost } from "@/data/benefits";
import { BenefitsContent } from "@/components/benefits/BenefitsContent";
import { ArrowLeft } from 'lucide-react';
import InnerHero from "@/components/common/InnerHero";
import { getLocalizedHref } from "@/lib/utils";

interface BenefitDetailProps {
    post: BenefitPost;
    lang: string;
}

export default function BenefitDetail({ post, lang }: BenefitDetailProps) {
    const isArabic = lang === 'ar';
    const isFrench = lang === 'fr';

    const title = isArabic && post.title_ar ? post.title_ar : (isFrench && post.title_fr ? post.title_fr : post.title);
    const content = isArabic && post.content_ar ? post.content_ar : (isFrench && post.content_fr ? post.content_fr : post.content);
    const excerpt = isArabic && post.excerpt_ar ? post.excerpt_ar : (isFrench && post.excerpt_fr ? post.excerpt_fr : post.excerpt);

    return (
        <main className="min-h-screen bg-[#fefcf8]">
            <InnerHero
                title={title}
                backgroundImage={post.image}
                titleTag="h1"
                breadcrumbs={[
                    { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: getLocalizedHref('/', lang) },
                    { label: lang === 'ar' ? 'الفوائد' : isFrench ? 'Bienfaits' : 'Benefits', href: getLocalizedHref('/organica/Benefits-Using-Natural-Beauty-Products', lang) },
                    { label: title, href: getLocalizedHref(`/organica/${post.slug}`, lang) }
                ]}
            />

            <div className="container-main py-16">
                <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-emerald-900/5 border border-emerald-50">
                    <article className={`prose prose-emerald max-w-none ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                        <BenefitsContent content={content} dir={isArabic ? 'rtl' : 'ltr'} />
                    </article>

                    <div className="mt-12 pt-8 border-t border-emerald-100 flex justify-center">
                        <Link
                            href={getLocalizedHref('/organica/Benefits-Using-Natural-Beauty-Products', lang)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#606C38] text-white rounded-full font-bold hover:bg-[#4a542b] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/20"
                        >
                            <ArrowLeft className={`h-5 w-5 ${isArabic ? 'rotate-180' : ''}`} />
                            {isArabic ? "العودة إلى الفوائد" : isFrench ? "Retour aux bienfaits" : "Back to All Benefits"}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
