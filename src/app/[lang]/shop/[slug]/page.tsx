import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getProductBySlug as getProductBySlugStatic, shopProducts } from "@/data/shop-products";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/actions/product.actions";
import { getGlobalSeoSettings } from "@/lib/queries";
import { Metadata } from "next";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { ShopProductDB } from "@/types/product";

const copy = {
    en: {
        breadcrumbHome: "Shop",
        specs: "Specifications",
        highlights: "Highlights",
        requestQuote: "Request Wholesale Quote",
        whatsapp: "Chat on WhatsApp",
        descriptionTitle: "Product Story",
        relatedTitle: "More from this collection",
        badgeFeatured: "Top Seller",
        volume: "Size",
        category: "Category",
        price: "Price",
        certification: "Certification",
        fulfillment: "Fulfillment",
        fulfillmentValue: "Ships within 7-12 business days",
        certificationValue: "ISO 22716 · ECOCERT · USDA Organic",
        backToShop: "Back to shop",
        viewDetails: "View Details",
    },
    ar: {
        breadcrumbHome: "المتجر",
        specs: "المواصفات",
        highlights: "أبرز المزايا",
        requestQuote: "طلب عرض أسعار بالجملة",
        whatsapp: "الدردشة عبر واتساب",
        descriptionTitle: "قصة المنتج",
        relatedTitle: "منتجات أخرى من نفس المجموعة",
        badgeFeatured: "الأكثر طلباً",
        volume: "السعة",
        category: "الفئة",
        price: "السعر",
        certification: "الشهادات",
        fulfillment: "التجهيز والشحن",
        fulfillmentValue: "الشحن خلال 7 - 12 يوم عمل",
        certificationValue: "ISO 22716 · ECOCERT · USDA Organic",
        backToShop: "الرجوع للمتجر",
        viewDetails: "عرض التفاصيل",
    },
} as const;

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang, slug } = await params;
    const product = await getProductBySlug(slug, lang as any);
    const globalSeo = await getGlobalSeoSettings(lang);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const name = lang === 'ar' ? product.nameAr : product.name;
    const description = lang === 'ar' ? product.descriptionAr : product.description;

    return {
        title: product.metaTitle || name,
        description: product.metaDesc || description?.substring(0, 160),
        keywords: product.keywords || undefined,
        openGraph: {
            title: product.metaTitle || name,
            description: product.metaDesc || description?.substring(0, 160),
            images: product.ogImage ? [product.ogImage] : (product.image ? [product.image] : (globalSeo?.ogImage ? [globalSeo.ogImage] : [])),
            url: `https://www.moroccanorganica.com/${lang}/shop/${slug}`,
        },
        alternates: {
            canonical: product.canonical || `https://www.moroccanorganica.com/${lang}/shop/${slug}`,
        }
    };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
    const { lang, slug } = await params;

    // Try to fetch from database first, fallback to static data
    let product: ShopProductDB | null = await getProductBySlug(slug, lang as 'en' | 'ar' | 'fr');
    let relatedProducts: ShopProductDB[] = [];

    // Fallback to static data if DB returns nothing
    if (!product) {
        const staticProduct = getProductBySlugStatic(slug);
        if (staticProduct) {
            product = {
                id: staticProduct.id,
                slug: staticProduct.slug,
                category: staticProduct.category,
                categorySlug: staticProduct.category.toLowerCase().replace(/\s+/g, '-'),
                image: staticProduct.image,
                gallery: staticProduct.gallery || [],
                badge: staticProduct.badge,
                volume: staticProduct.volume,
                name: staticProduct.name,
                nameAr: staticProduct.nameAr,
                nameFr: staticProduct.name,
                description: staticProduct.description,
                descriptionAr: staticProduct.descriptionAr,
                descriptionFr: staticProduct.description,
                h1: staticProduct.name,
                h1Ar: staticProduct.nameAr,
                h1Fr: staticProduct.name,
                details: '',
                detailsAr: '',
                detailsFr: '',
                notes: staticProduct.notes,
                price: staticProduct.price,
                stock: staticProduct.stockQuantity || 100,
                isAvailable: true,
                isFeatured: staticProduct.badge === 'bestseller',
                isTopSale: false,
                placement: 'shop' as const,
                sku: staticProduct.id,
                variants: [],
                metaTitle: '',
                metaDesc: '',
                keywords: '',
            };

            // Get related from static
            relatedProducts = shopProducts
                .filter((item) => item.id !== staticProduct.id && item.category === staticProduct.category)
                .slice(0, 3)
                .map(p => ({
                    id: p.id,
                    slug: p.slug,
                    category: p.category,
                    categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
                    image: p.image,
                    gallery: p.gallery || [],
                    badge: p.badge,
                    volume: p.volume,
                    name: p.name,
                    nameAr: p.nameAr,
                    nameFr: p.name,
                    description: p.description,
                    descriptionAr: p.descriptionAr,
                    descriptionFr: p.description,
                    h1: p.name,
                    h1Ar: p.nameAr,
                    h1Fr: p.name,
                    details: '',
                    detailsAr: '',
                    detailsFr: '',
                    notes: p.notes,
                    price: p.price,
                    stock: p.stockQuantity || 100,
                    isAvailable: true,
                    isFeatured: p.badge === 'bestseller',
                    isTopSale: false,
                    placement: 'shop' as const,
                    sku: p.id,
                    variants: [],
                    metaTitle: '',
                    metaDesc: '',
                    keywords: '',
                }));
        }
    } else {
        // Get related from DB - try by category first
        if (product && product.categorySlug) {
            const currentProduct = product;
            // Find category by slug to get ID
            const { getCategories } = await import('@/actions/category.actions');
            const categories = await getCategories();
            const category = categories.find(c => c.slug === currentProduct.categorySlug || c.slugAr === currentProduct.categorySlug);

            if (category) {
                relatedProducts = await getRelatedProducts(currentProduct.id, category.id, 3);
            }
        }

        // If no related products found, get any 3 available products (excluding current)
        if (product && relatedProducts.length === 0) {
            const currentProduct = product;
            const allProductsResult = await getProducts({ isAvailable: true, placement: 'shop', limit: 10 });
            relatedProducts = allProductsResult.products
                .filter(p => p.id !== currentProduct.id)
                .slice(0, 3);
        }
    }

    if (product && (product.placement === 'featured' || product.placement === 'topsale')) {
        redirect(`/${lang}/organica/${slug}`);
    }

    if (!product) {
        notFound();
    }

    const isRTL = lang === "ar";
    const locale = isRTL ? "ar-MA" : "en-US";
    const t = copy[isRTL ? "ar" : "en"];

    const priceFormatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

    const localizedName = isRTL ? product.nameAr : product.name;
    const localizedH1 = isRTL ? product.h1Ar : (lang === 'fr' ? product.h1Fr : product.h1);
    const localizedDescription = isRTL ? product.descriptionAr : product.description;
    const localizedDetails = isRTL ? product.detailsAr : (lang === 'fr' ? product.detailsFr : product.details);

    const galleryImages = [product.image, ...product.gallery].filter(Boolean);


    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="container-main py-16 md:py-24 space-y-16">
            <nav className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Link href={`/${lang}/shop`} className="hover:text-emerald-700">
                        {t.breadcrumbHome}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{localizedName}</span>
                </div>
            </nav>

            <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <ProductImageGallery images={galleryImages} alt={localizedName} />

                <div className="flex flex-col gap-6">
                    <div>
                        {product.badge && (
                            <span className="inline-flex rounded-full border border-emerald-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                {t.badgeFeatured}
                            </span>
                        )}
                        <h1 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-semibold text-emerald-950 leading-tight uppercase tracking-tight">
                            {localizedH1 || localizedName}
                        </h1>
                    </div>

                    <div className="grid gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-900 sm:grid-cols-2">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{t.volume}</p>
                            <p className="text-lg font-semibold text-emerald-900">{product.volume}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{t.category}</p>
                            <p className="text-lg font-semibold text-emerald-900">{product.category}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{t.price}</p>
                            <p className="text-2xl font-semibold text-emerald-700">
                                {priceFormatter.format(product.price)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{t.fulfillment}</p>
                            <p className="text-lg font-semibold text-emerald-900">{t.fulfillmentValue}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{t.specs}</p>
                            <p className="text-sm text-muted-foreground">{t.certificationValue}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{t.highlights}</p>
                            <ul className="mt-3 space-y-2">
                                {product.notes.map((note) => (
                                    <li key={note} className="flex items-center gap-3 text-sm text-emerald-900">
                                        <span className="size-2 rounded-full bg-emerald-400" />
                                        <span>{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <AddToCartButton product={product} label={isRTL ? "أضف إلى السلة" : "Add to Cart"} />
                        <a
                            href="https://wa.me/212600000000"
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 min-w-[220px] rounded-full border border-emerald-200 px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:text-emerald-900"
                        >
                            {t.whatsapp}
                        </a>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="heading-display text-3xl text-emerald-950">{t.descriptionTitle}</h2>
                <div
                    className="prose prose-emerald max-w-none text-lg leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: localizedDetails || localizedDescription }}
                />
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="heading-display text-2xl text-emerald-950">{t.relatedTitle}</h2>
                    <Link href={`/${lang}/shop`} className="text-sm font-semibold text-emerald-700 hover:underline">
                        {t.backToShop}
                    </Link>
                </div>
                {relatedProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedProducts.map((item) => (
                            <article
                                key={item.id}
                                className="flex h-full flex-col rounded-2xl border border-emerald-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="aspect-4/3 overflow-hidden rounded-t-2xl relative">
                                    <Image
                                        src={item.image}
                                        alt={isRTL ? item.nameAr : item.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col gap-3 p-5">
                                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                                        {item.category}
                                    </p>
                                    <h3 className="text-lg font-semibold text-emerald-900">
                                        {isRTL ? item.nameAr : item.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {isRTL ? item.descriptionAr : item.description}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <p className="text-base font-semibold text-emerald-700">
                                            {priceFormatter.format(item.price)}
                                        </p>
                                        <Link
                                            href={item.placement === 'shop' ? `/${lang}/shop/${item.slug}` : `/${lang}/organica/${item.slug}`}
                                            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:text-emerald-900"
                                        >
                                            {t.viewDetails}
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No related products available at the moment.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
