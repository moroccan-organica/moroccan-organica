import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPostFull } from '@/types/blog';

interface BlogCardProps {
  post: BlogPostFull;
  lang: string;
  translations: {
    readMore: string;
    by: string;
    minRead: string;
  };
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop';

export function BlogCard({ post, lang, translations }: BlogCardProps) {
  const categoryColor = post.category?.color || '#606C38';
  
  // Filter out blob URLs (they're temporary and won't work after page reload)
  let featuredImage = post.featured_image_url || DEFAULT_IMAGE;
  if (featuredImage.startsWith('blob:')) {
    featuredImage = DEFAULT_IMAGE;
  }
  
  // Select content based on language
  const isArabic = lang === 'ar';
  const title = isArabic && post.title_ar ? post.title_ar : post.title;
  const excerpt = isArabic && post.excerpt_ar ? post.excerpt_ar : post.excerpt;

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/${lang}/blog/${post.slug}`} className="relative h-64 overflow-hidden">
        <Image
          src={featuredImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
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
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span>{format(new Date(post.published_at), 'dd MMM yyyy')}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.read_time_minutes} {translations.minRead}
          </span>
        </div>

        <Link href={`/${lang}/blog/${post.slug}`}>
          <h3 className="text-xl font-playfair font-bold text-slate-900 mb-3 group-hover:text-[#BC6C25] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm line-clamp-3 mb-6">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            {post.author?.avatar_url && (
              <div className="relative w-8 h-8">
                <Image 
                  src={post.author.avatar_url} 
                  alt={post.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <span className="text-xs font-medium text-slate-700">
              {translations.by} {post.author?.name}
            </span>
          </div>

          <Link 
            href={`/${lang}/blog/${post.slug}`}
            className="text-[#BC6C25] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            {translations.readMore}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
