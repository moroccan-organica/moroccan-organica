// Language codes matching Prisma schema
export type LanguageCode = 'en' | 'ar' | 'fr';

// Product placement enum — controls which admin section the product belongs to
export type ProductPlacement = 'shop' | 'topsale' | 'featured' | 'catalogue';

// Type for product with translations (what we get from DB)
export interface ProductWithTranslations {
  id: string;
  categoryId: string;
  basePrice: number;
  sku: string;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isTopSale: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    image: string | null;
    translations: {
      language: LanguageCode;
      name: string;
      slug: string;
    }[];
  };
  translations: {
    id: string;
    language: LanguageCode;
    name: string;
    description: string | null;
    details: string | null;
    slug: string;
    metaTitle: string | null;
    metaDesc: string | null;
    keywords: string | null;
    ogImage: string | null;
    canonical: string | null;
  }[];
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  variants: {
    id: string;
    sku: string;
    sizeName: string;
    price: number;
    stock: number;
  }[];
}

// Simplified product for shop display
export interface ShopProductDB {
  id: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryColor?: string;
  image: string;
  gallery: string[];
  badge?: string;
  volume: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  details: string;
  detailsAr: string;
  detailsFr: string;
  notes: string[];
  price: number;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isTopSale: boolean;
  placement: ProductPlacement;
  sku: string;
  variants: {
    id: string;
    sku: string;
    sizeName: string;
    price: number;
    stock: number;
  }[];
  metaTitle?: string;
  metaTitleAr?: string;
  metaTitleFr?: string;
  metaDesc?: string;
  metaDescAr?: string;
  metaDescFr?: string;
  keywords?: string;
  keywordsAr?: string;
  keywordsFr?: string;
  ogImage?: string;
  canonical?: string;
}

// Input for creating a product
export interface CreateProductInput {
  categoryId: string;
  basePrice: number;
  sku: string;
  stock?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isTopSale?: boolean;
  placement?: ProductPlacement;
  translations: {
    language: LanguageCode;
    name: string;
    description?: string;
    details?: string;
    slug: string;
    metaTitle?: string;
    metaDesc?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
  }[];
  images?: {
    url: string;
    isPrimary?: boolean;
  }[];
  variants?: {
    sku: string;
    sizeName: string;
    price: number;
    stock?: number;
  }[];
}

// Input for updating a product
export interface UpdateProductInput {
  categoryId?: string;
  basePrice?: number;
  sku?: string;
  stock?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isTopSale?: boolean;
  placement?: ProductPlacement;
  translations?: {
    language: LanguageCode;
    name: string;
    description?: string;
    details?: string;
    slug: string;
    metaTitle?: string;
    metaDesc?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
  }[];
  images?: {
    url: string;
    isPrimary?: boolean;
  }[];
  variants?: {
    sku: string;
    sizeName: string;
    price: number;
    stock?: number;
  }[];
}

// Category type for shop
export interface CategoryDB {
  id: string;
  image: string | null;
  name: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  slugAr: string;
  slugFr: string;
}
