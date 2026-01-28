export type LanguageCode = 'en' | 'fr' | 'ar';

export interface GlobalSettings {
    ogImage: string;
    twitterHandle: string;
    facebookPage: string;
}

export interface LocalizedSettings {
    siteName: string;
    titleSuffix: string;
    defaultMetaDesc: string;
    defaultKeywords: string;
}

export interface SEOSettings {
    ogImage?: string;
    twitterHandle?: string;
    facebookPage?: string;
    translations: {
        language: string;
        siteName?: string;
        titleSuffix?: string;
        defaultMetaDesc?: string;
        defaultKeywords?: string;
    }[];
}
