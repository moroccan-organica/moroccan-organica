import { supabaseAdmin } from '@/lib/supabase-admin';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.moroccanorganica.com';
const LANGUAGES = ['en', 'fr', 'ar'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes = [
        '',
        '/shop',
        '/blog',
        '/contact',
        '/faq',
        '/wholesale-of-moroccan-skincare',
    ];

    // 2. Fetch Products for dynamic routes
    const { data: products } = await supabaseAdmin
        .from('Product')
        .select('id, translations:ProductTranslation(slug, language)')
        .eq('isAvailable', true);

    // 3. Fetch Static Pages (Organica custom pages)
    const { data: staticPages } = await supabaseAdmin
        .from('StaticPage')
        .select('id, translations:StaticPageTranslation(slug, language)');

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Process Static Routes
    staticRoutes.forEach(route => {
        LANGUAGES.forEach(lang => {
            const langPrefix = lang === 'en' ? '' : `/${lang}`;
            const url = `${BASE_URL}${langPrefix}${route}`;
            
            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
                // Add alternates
                alternates: {
                    languages: {
                        en: `${BASE_URL}${route}`,
                        fr: `${BASE_URL}/fr${route}`,
                        ar: `${BASE_URL}/ar${route}`,
                    }
                }
            });
        });
    });

    // Process Products
    products?.forEach(product => {
        LANGUAGES.forEach(lang => {
            const trans = product.translations?.find((t: any) => t.language === lang) || product.translations?.find((t: any) => t.language === 'en');
            if (trans?.slug) {
                const langPrefix = lang === 'en' ? '' : `/${lang}`;
                const url = `${BASE_URL}${langPrefix}/organica/${trans.slug}`;
                
                sitemapEntries.push({
                    url,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                    alternates: {
                        languages: {
                            en: `${BASE_URL}/organica/${product.translations?.find((t: any) => t.language === 'en')?.slug || trans.slug}`,
                            fr: `${BASE_URL}/fr/organica/${product.translations?.find((t: any) => t.language === 'fr')?.slug || trans.slug}`,
                            ar: `${BASE_URL}/ar/organica/${product.translations?.find((t: any) => t.language === 'ar')?.slug || trans.slug}`,
                        }
                    }
                });
            }
        });
    });

    // Process Organica Static Pages from DB
    staticPages?.forEach(page => {
        LANGUAGES.forEach(lang => {
            const trans = page.translations?.find((t: any) => t.language === lang) || page.translations?.find((t: any) => t.language === 'en');
            if (trans?.slug) {
                // Avoid duplicating home page if slug is empty
                if (trans.slug === '' || trans.slug === '/') return;

                const langPrefix = lang === 'en' ? '' : `/${lang}`;
                const url = `${BASE_URL}${langPrefix}/organica/${trans.slug}`;
                
                sitemapEntries.push({
                    url,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                    alternates: {
                        languages: {
                            en: `${BASE_URL}/organica/${page.translations?.find((t: any) => t.language === 'en')?.slug || trans.slug}`,
                            fr: `${BASE_URL}/fr/organica/${page.translations?.find((t: any) => t.language === 'fr')?.slug || trans.slug}`,
                            ar: `${BASE_URL}/ar/organica/${page.translations?.find((t: any) => t.language === 'ar')?.slug || trans.slug}`,
                        }
                    }
                });
            }
        });
    });

    return sitemapEntries;
}
