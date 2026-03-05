type DictionaryLoader = () => Promise<unknown>;

interface DictionaryGroup {
    common: DictionaryLoader;
    home: DictionaryLoader;
    about: DictionaryLoader;
    products: DictionaryLoader;
    contact: DictionaryLoader;
    blog: DictionaryLoader;
    'private-label': DictionaryLoader;
    shop: DictionaryLoader;
}

const dictionaries: Record<string, DictionaryGroup> = {
    en: {
        common: () => import('../locales/en/common.json').then((module) => module.default),
        home: () => import('../locales/en/home.json').then((module) => module.default),
        about: () => import('../locales/en/about.json').then((module) => module.default),
        products: () => import('../locales/en/products.json').then((module) => module.default),
        contact: () => import('../locales/en/contact.json').then((module) => module.default),
        blog: () => import('../locales/en/blog.json').then((module) => module.default),
        'private-label': () => import('../locales/en/private-label.json').then((module) => module.default),
        shop: () => import('../locales/en/shop.json').then((module) => module.default),
    },
    fr: {
        common: () => import('../locales/fr/common.json').then((module) => module.default),
        home: () => import('../locales/fr/home.json').then((module) => module.default),
        about: () => import('../locales/fr/about.json').then((module) => module.default),
        products: () => import('../locales/fr/products.json').then((module) => module.default),
        contact: () => import('../locales/fr/contact.json').then((module) => module.default),
        blog: () => import('../locales/fr/blog.json').then((module) => module.default),
        'private-label': () => import('../locales/fr/private-label.json').then((module) => module.default),
        shop: () => import('../locales/fr/shop.json').then((module) => module.default),
    },
    ar: {
        common: () => import('../locales/ar/common.json').then((module) => module.default),
        home: () => import('../locales/ar/home.json').then((module) => module.default),
        about: () => import('../locales/ar/about.json').then((module) => module.default),
        products: () => import('../locales/ar/products.json').then((module) => module.default),
        contact: () => import('../locales/ar/contact.json').then((module) => module.default),
        blog: () => import('../locales/ar/blog.json').then((module) => module.default),
        'private-label': () => import('../locales/ar/private-label.json').then((module) => module.default),
        shop: () => import('../locales/ar/shop.json').then((module) => module.default),
    }
}

export type Locale = keyof typeof dictionaries;
export type Page = keyof DictionaryGroup;

import { supabase } from './supabase';

export const getDictionary = async <T extends Page>(locale: string, page: T): Promise<any> => {
    const loc = (dictionaries[locale] ? locale : 'en');
    const loadDictionary = dictionaries[loc][page] || dictionaries['en'][page];

    // Load static content
    const staticDict = await loadDictionary() as any;

    try {
        // Proxy logic: Try to fetch overrides from DB always
        const systemName = page.toUpperCase().replace('-', '_');
        const { data: dbPage } = await supabase
            .from('StaticPage')
            .select('*, translations:StaticPageTranslation(*)')
            .eq('systemName', systemName)
            .eq('translations.language', loc)
            .maybeSingle();

        if (dbPage?.translations?.[0]) {
            const trans = dbPage.translations[0];
            // Merge DB H1/Description into the dictionary
            // This ensures "data from db always" for pages like Home, Private Label, etc.
            return {
                ...staticDict,
                hero: {
                    ...staticDict.hero,
                    title: trans.h1 || staticDict.hero?.title,
                    description: trans.description || staticDict.hero?.description
                },
                meta: {
                    ...staticDict.meta,
                    title: trans.metaTitle || staticDict.meta?.title,
                    description: trans.metaDesc || staticDict.meta?.description,
                    keywords: trans.keywords || staticDict.meta?.keywords
                }
            };
        }
    } catch (error) {
        console.warn(`[Dictionary Proxy] Failed to fetch DB overrides for ${page}:`, error);
    }

    return staticDict;
}
