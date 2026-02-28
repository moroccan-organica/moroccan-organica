import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BenefitPost } from '@/data/benefits';

interface BenefitsCardProps {
    post: BenefitPost;
    lang: string;
    translations: {
        readMore: string;
    };
}

export function BenefitsCard({ post, lang, translations }: BenefitsCardProps) {
    const isArabic = lang === 'ar';
    const title = isArabic && post.title_ar ? post.title_ar : post.title;
    const excerpt = isArabic && post.excerpt_ar ? post.excerpt_ar : post.excerpt;

    return (
        <article className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-100">
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={post.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6">
                <p
                    className="text-xl font-bold font-playfair text-slate-900 mb-3 line-clamp-2 group-hover:text-[#606C38] transition-colors"
                    dir={isArabic ? 'rtl' : 'ltr'}
                >
                    {title}
                </p>

                <p
                    className="text-slate-600 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed"
                    dir={isArabic ? 'rtl' : 'ltr'}
                >
                    {excerpt}
                </p>

                <div className={`mt-auto flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Link
                        href={`/${lang}/organica/${post.slug}`}
                        className={`inline-flex items-center gap-2 text-[#606C38] font-medium hover:text-[#BC6C25] transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}
                    >
                        {translations.readMore}
                        <span className="sr-only">: {title}</span>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </Link>
                </div>
            </div>
        </article>
    );
}
