type DictionaryLoader = () => Promise<any>;

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

export const getDictionary = async <T extends Page>(locale: string, page: T): Promise<any> => {
    const loc = (dictionaries[locale] ? locale : 'en');
    const loadDictionary = dictionaries[loc][page] || dictionaries['en'][page];
    return loadDictionary();
}
