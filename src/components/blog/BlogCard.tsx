import React from 'react';
import { JSONContent } from '@tiptap/core';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPostFull } from '@/types/blog';

import { getValidImageUrl } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostFull;
  lang: string;
  translations: {
    readMore: string;
  };
}

const DEFAULT_IMAGE = '/images/placeholder.svg';

const extractText = (node: JSONContent | null | undefined): string => {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (Array.isArray(node.content)) return node.content.map((child) => extractText(child)).join(' ');
  return '';
};

export function BlogCard({ post, lang, translations }: BlogCardProps) {
  const [imgSrc, setImgSrc] = React.useState(getValidImageUrl(post.featured_image_url));
  const categoryColor = post.category?.color || '#606C38';

  // Update imgSrc if post changes
  React.useEffect(() => {
    setImgSrc(getValidImageUrl(post.featured_image_url));
  }, [post.featured_image_url]);

  const contentFallback = React.useMemo(() => {
    const source = lang === 'ar' ? post.content_ar : post.content;
    return extractText(source)?.trim() || '';
  }, [lang, post.content, post.content_ar]);

  // Select content based on language
  const isArabic = lang === 'ar';
  const title = isArabic && post.title_ar ? post.title_ar : post.title;
  const rawExcerpt = isArabic && post.excerpt_ar ? post.excerpt_ar : post.excerpt;
  const cleanedExcerpt = rawExcerpt?.trim() || '';
  const longerText = contentFallback.length > cleanedExcerpt.length ? contentFallback : cleanedExcerpt;
  const descriptionSource = longerText || cleanedExcerpt || contentFallback;
  const description = descriptionSource ? descriptionSource.slice(0, 150) : '';

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/${lang}/blog/${post.slug}`} className="relative h-64 overflow-hidden">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />
        {post.category && (
          <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'}`}>
            <Badge
              className="bg-white/90 text-slate-900 hover:bg-white border-none"
              style={{ borderLeft: isArabic ? 'none' : `4px solid ${categoryColor}`, borderRight: isArabic ? `4px solid ${categoryColor}` : 'none' }}
            >
              {post.category.name}
            </Badge>
          </div>
        )}
      </Link>

      <div className={`flex flex-col flex-1 p-6 ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>

        <Link href={`/${lang}/blog/${post.slug}`}>
          <p className="text-xl font-playfair font-bold text-slate-900 mb-3 group-hover:text-[#BC6C25] transition-colors line-clamp-2 min-h-[56px]">
            {title}
          </p>
        </Link>

        <p className="text-slate-600 text-sm line-clamp-2 mb-6 min-h-[44px]">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-end pt-4 border-t border-slate-50">
          <Link
            href={`/${lang}/blog/${post.slug}`}
            className="text-[#BC6C25] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            {translations.readMore}
            <span className="sr-only">: {title}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
