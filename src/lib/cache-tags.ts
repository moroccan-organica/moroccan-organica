/**
 * Centralized cache tag definitions.
 * 
 * Use these constants everywhere to avoid typos and keep
 * invalidation logic in sync with data-fetching logic.
 * 
 * Naming convention:
 *   CACHE_TAGS.PRODUCTS            → invalidates ALL product lists
 *   CACHE_TAGS.PRODUCT(id/slug)    → invalidates ONE specific product
 *   CACHE_TAGS.CATEGORIES          → invalidates ALL category lists
 *   CACHE_TAGS.STATIC_PAGES        → invalidates all static/SEO pages
 */
export const CACHE_TAGS = {
    // Collections
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    STATIC_PAGES: 'static-pages',
    ORDERS: 'orders',

    // Individual product (by id or slug)
    PRODUCT: (idOrSlug: string) => `product-${idOrSlug}`,

    // Individual category (by id)
    CATEGORY: (id: string) => `category-${id}`,

    // Static page (by systemName)
    STATIC_PAGE: (systemName: string) => `static-page-${systemName}`,

    // Blog
    BLOG_POSTS: 'blog_posts',
    BLOG_POST: (idOrSlug: string) => `blog_post-${idOrSlug}`,
} as const;
