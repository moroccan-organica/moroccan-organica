import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    if (tag) {
      // @ts-ignore
      revalidateTag(tag);
    } else {
      // @ts-ignore
      revalidateTag(CACHE_TAGS.PRODUCTS);
      // @ts-ignore
      revalidateTag('products');
      // @ts-ignore
      revalidateTag(CACHE_TAGS.BLOG_POSTS);
      // @ts-ignore
      revalidateTag('blog_posts');
    }

    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || CACHE_TAGS.PRODUCTS,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}
