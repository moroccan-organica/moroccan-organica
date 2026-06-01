/**
 * Centralized Google Structured Data (JSON-LD) Schema Generators
 * 
 * Generates rich result schemas for Google Search, AI answers, and Knowledge Graph.
 * Reference: https://developers.google.com/search/docs/appearance/structured-data
 */

const BASE_URL = 'https://www.moroccanorganica.com';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function localizedUrl(path: string, lang: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const prefix = lang === 'en' ? '' : `/${lang}`;
    return `${BASE_URL}${prefix}${cleanPath === '/' ? '' : cleanPath}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ORGANIZATION — Google Knowledge Panel + brand identity
// ─────────────────────────────────────────────────────────────────────────────

export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Moroccan Organica",
        "legalName": "Organica Group SARL",
        "alternateName": ["Organica Group", "MoroccanOrganica"],
        "url": BASE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/images/logo.png`,
            "width": 320,
            "height": 96
        },
        "image": `${BASE_URL}/images/logo.png`,
        "description": "Moroccan manufacturer and exporter of certified organic argan oil, prickly pear seed oil, black soap, ghassoul clay, rose water and natural cosmetics. Wholesale, private label and OEM.",
        "foundingDate": "2016",
        "foundingLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Marrakech",
                "addressCountry": "MA"
            }
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Lot 377 N°3/6 Sidi Ghanem, Zone Industrielle",
            "addressLocality": "Marrakech",
            "postalCode": "40110",
            "addressRegion": "Marrakech-Safi",
            "addressCountry": "MA"
        },
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+212-648-273228",
                "contactType": "sales",
                "availableLanguage": ["English", "French", "Arabic"],
                "areaServed": "Worldwide"
            },
            {
                "@type": "ContactPoint",
                "email": "inquiry@moroccanorganica.com",
                "contactType": "customer service"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/moroccanorganica/",
            "https://www.instagram.com/moroccanorganic/",
            "https://x.com/morocanorganica",
            "https://www.pinterest.com/moroccanorganicproducts/",
            "https://www.linkedin.com/in/organicamoroccanorganica/",
            "https://www.tiktok.com/@moroccanbeauty_shop"
        ],
        "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "minValue": 10,
            "maxValue": 50
        },
        "knowsAbout": [
            "Argan Oil Production",
            "Prickly Pear Seed Oil",
            "Moroccan Black Soap",
            "Ghassoul Clay",
            "Rose Water",
            "Private Label Cosmetics",
            "OEM Manufacturing",
            "Organic Certifications"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Moroccan Organic Beauty Products",
            "itemListElement": [
                {
                    "@type": "OfferCatalog",
                    "name": "Vegetable Oils",
                    "description": "Argan oil, prickly pear seed oil, and other cold-pressed organic oils"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Essential Oils",
                    "description": "Pure essential oils distilled from Moroccan aromatic plants"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Traditional Skincare",
                    "description": "Black soap, ghassoul clay, rose water, and natural skincare preparations"
                }
            ]
        }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOCAL BUSINESS — Google Maps + local pack
// ─────────────────────────────────────────────────────────────────────────────

export function localBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Manufacturer"],
        "@id": `${BASE_URL}/#localbusiness`,
        "name": "Moroccan Organica — Organica Group SARL",
        "image": `${BASE_URL}/images/logo.png`,
        "url": BASE_URL,
        "telephone": "+212-648-273228",
        "email": "inquiry@moroccanorganica.com",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Lot 377 N°3/6 Sidi Ghanem, Zone Industrielle",
            "addressLocality": "Marrakech",
            "postalCode": "40110",
            "addressRegion": "Marrakech-Safi",
            "addressCountry": "MA"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 31.6295,
            "longitude": -8.0083
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 31.6295,
                "longitude": -8.0083
            },
            "geoRadius": "20000 km"
        },
        "parentOrganization": {
            "@id": `${BASE_URL}/#organization`
        }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. BREADCRUMB LIST — All pages
// ─────────────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
    name: string;
    url?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            ...(item.url ? { "item": item.url } : {})
        }))
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRODUCT — Shop product detail pages
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductSchemaInput {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    slug: string;
    lang: string;
    category?: string;
    sku?: string;
    availability?: boolean;
    brand?: string;
}

export function productSchema(input: ProductSchemaInput) {
    const url = localizedUrl(`/shop/${input.slug}`, input.lang);
    const imageUrl = input.image.startsWith('http') ? input.image : `${BASE_URL}${input.image}`;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": input.name,
        "description": input.description,
        "image": imageUrl,
        "url": url,
        "sku": input.sku || input.slug,
        "brand": {
            "@type": "Brand",
            "name": input.brand || "Moroccan Organica"
        },
        "manufacturer": {
            "@id": `${BASE_URL}/#organization`
        },
        ...(input.category ? { "category": input.category } : {}),
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": input.currency || "USD",
            "price": input.price.toFixed(2),
            "availability": input.availability !== false
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            "seller": {
                "@id": `${BASE_URL}/#organization`
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "Worldwide"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 7,
                        "maxValue": 12,
                        "unitCode": "DAY"
                    }
                }
            }
        },
        "additionalProperty": [
            {
                "@type": "PropertyValue",
                "name": "Certification",
                "value": "ISO 22716 · ECOCERT · USDA Organic"
            }
        ]
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ARTICLE — Blog post pages
// ─────────────────────────────────────────────────────────────────────────────

export interface ArticleSchemaInput {
    title: string;
    description?: string;
    image?: string;
    slug: string;
    lang: string;
    publishedAt?: string;
    updatedAt?: string;
    authorName?: string;
    tags?: string[];
    category?: string;
}

export function articleSchema(input: ArticleSchemaInput) {
    const url = localizedUrl(`/blog-details/${input.slug}`, input.lang);
    const imageUrl = input.image
        ? (input.image.startsWith('http') ? input.image : `${BASE_URL}${input.image}`)
        : `${BASE_URL}/images/logo.png`;

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": input.title,
        "description": input.description || input.title,
        "image": imageUrl,
        "url": url,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "author": {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            "name": input.authorName || "Moroccan Organica"
        },
        "publisher": {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            "name": "Moroccan Organica",
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/images/logo.png`
            }
        },
        ...(input.publishedAt ? { "datePublished": input.publishedAt } : {}),
        ...(input.updatedAt ? { "dateModified": input.updatedAt } : { ...(input.publishedAt ? { "dateModified": input.publishedAt } : {}) }),
        ...(input.tags && input.tags.length > 0 ? { "keywords": input.tags.join(", ") } : {}),
        ...(input.category ? { "articleSection": input.category } : {}),
        "inLanguage": input.lang === 'ar' ? 'ar' : (input.lang === 'fr' ? 'fr' : 'en')
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONTACT PAGE — ContactPage rich result
// ─────────────────────────────────────────────────────────────────────────────

export function contactPageSchema(lang: string) {
    return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": lang === 'ar' ? "اتصل بنا" : (lang === 'fr' ? "Nous Contacter" : "Contact Us"),
        "url": localizedUrl('/contact', lang),
        "description": lang === 'ar'
            ? "تواصل مع Moroccan Organica لمنتجات التجميل العضوية المغربية بالجملة"
            : (lang === 'fr'
                ? "Contactez Moroccan Organica pour les produits cosmétiques biologiques marocains en gros"
                : "Get in touch with Moroccan Organica for wholesale premium Moroccan organic beauty products"),
        "mainEntity": {
            "@id": `${BASE_URL}/#organization`
        }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. COLLECTION PAGE — Product listing / shop pages
// ─────────────────────────────────────────────────────────────────────────────

export interface CollectionProduct {
    name: string;
    url: string;
    image?: string;
    price?: number;
}

export function collectionPageSchema(
    name: string,
    description: string,
    url: string,
    products: CollectionProduct[]
) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": name,
        "description": description,
        "url": url,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": products.length,
            "itemListElement": products.slice(0, 30).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": product.name,
                "url": product.url,
                ...(product.image ? { "image": product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}` } : {})
            }))
        }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. WEBPAGE — Generic web page schema (about, private-label, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export function webPageSchema(
    name: string,
    description: string,
    url: string,
    type: string = "WebPage"
) {
    return {
        "@context": "https://schema.org",
        "@type": type,
        "name": name,
        "description": description,
        "url": url,
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`
        },
        "publisher": {
            "@id": `${BASE_URL}/#organization`
        }
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Render multiple schemas as a single JSON-LD script body
// ─────────────────────────────────────────────────────────────────────────────

export function renderSchemas(...schemas: object[]): string {
    if (schemas.length === 1) {
        return JSON.stringify(schemas[0]);
    }
    // Use @graph to bundle multiple schemas in one script tag
    return JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemas.map(s => {
            // Remove redundant @context from each item
            const { "@context": _, ...rest } = s as any;
            return rest;
        })
    });
}
