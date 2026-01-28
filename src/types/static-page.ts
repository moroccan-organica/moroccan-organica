export interface StaticPageTranslation {
    language: string;
    slug: string;
    h1?: string | null;
    description?: string | null;
    metaTitle?: string | null;
    metaDesc?: string | null;
    keywords?: string | null;
    ogImage?: string | null;
    canonical?: string | null;
}

export interface StaticPage {
    id: string;
    systemName: string;
    translations: StaticPageTranslation[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface StaticPageInput {
    id?: string;
    systemName: string;
    translations: StaticPageTranslation[];
}
