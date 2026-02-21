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
import { WholesaleQuoteForm } from "@/components/shop/WholesaleQuoteForm";

const copy = {
    en: {
        breadcrumbHome: "Products",
        specs: "Specifications",
        highlights: "Highlights",
        requestQuote: "Request Wholesale Quote",
        whatsapp: "Chat on WhatsApp",
        descriptionTitle: "Product Story",
        relatedTitle: "More from this collection",
        badgeFeatured: "Featured Product",
        badgeTopSale: "Top Seller",
        volume: "Size",
        category: "Category",
        price: "Price",
        certification: "Certification",
        fulfillment: "Fulfillment",
        fulfillmentValue: "Ships within 7-12 business days",
        certificationValue: "ISO 22716 · ECOCERT · USDA Organic",
        backToShop: "Back to shop",
        viewDetails: "View Details",
        backToProducts: "Back to products",
    },
    ar: {
        breadcrumbHome: "المنتجات",
        specs: "المواصفات",
        highlights: "أبرز المزايا",
        requestQuote: "طلب عرض أسعار بالجملة",
        whatsapp: "الدردشة عبر واتساب",
        descriptionTitle: "قصة المنتج",
        relatedTitle: "منتجات أخرى من نفس المجموعة",
        badgeFeatured: "منتج مميز",
        badgeTopSale: "الأكثر مبيعاً",
        volume: "السعة",
        category: "الفئة",
        price: "السعر",
        certification: "الشهادات",
        fulfillment: "التجهيز والشحن",
        fulfillmentValue: "الشحن خلال 7 - 12 يوم عمل",
        certificationValue: "ISO 22716 · ECOCERT · USDA Organic",
        backToProducts: "الرجوع للمنتجات",
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
        },
        alternates: {
            canonical: product.canonical || undefined,
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

    if (product && product.placement === 'shop') {
        redirect(`/${lang}/shop/${slug}`);
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
    const localizedDescription = isRTL ? product.descriptionAr : product.description;
    const localizedDetails = isRTL ? product.detailsAr : (lang === 'fr' ? product.detailsFr : product.details);

    const galleryImages = [product.image, ...product.gallery].filter(Boolean);

    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="container-main py-12 md:py-20">
            {/* Breadcrumbs */}
            <nav className="text-xs text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                    <Link href={`/${lang}/products`} className="hover:text-emerald-700">
                        {t.breadcrumbHome}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">{localizedName}</span>
                </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12 lg:gap-16">
                {/* Left Sidebar - Quote Form */}
                <aside className="space-y-8 order-2 lg:order-1">
                    <WholesaleQuoteForm lang={lang} productName={localizedName || ""} />

                    {/* Additional Info / Certification Badges could go here if needed */}
                    <div className="flex flex-col items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 py-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center p-2">
                                <Image src="/images/logo.png" alt="Bio" width={40} height={40} className="object-contain" />
                            </div>
                            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center p-2">
                                <Image src="/images/logo.png" alt="USDA" width={40} height={40} className="object-contain" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Content Area */}
                <article className="space-y-10 order-1 lg:order-2">
                    {/* Main Product Display */}
                    <div className="space-y-8">
                        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/5 border border-emerald-50 bg-white">
                            <ProductImageGallery images={galleryImages} alt={localizedName} />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                {(product.placement === 'featured' || product.isFeatured) && (
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                                        {t.badgeFeatured}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#606C38] leading-tight uppercase tracking-tight">
                                    {localizedName}
                                </h1>
                                <div className="h-1 w-20 bg-emerald-500/20 rounded-full" />
                            </div>

                            <div className="prose prose-emerald max-w-none">
                                <p className="text-lg leading-relaxed text-slate-700 font-medium">
                                    {localizedDescription}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Story / Technical Info - Only show if details exist */}
                    {localizedDetails && (
                        <div className="space-y-8 pt-8 border-t border-emerald-100">
                            <section className="space-y-4">
                                <h2 className="heading-display text-2xl text-emerald-950">{t.descriptionTitle}</h2>
                                <div
                                    className="prose prose-emerald max-w-none text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: localizedDetails }}
                                />
                            </section>
                        </div>
                    )}

                    {product.notes && product.notes.length > 0 && (
                        <div className="space-y-8 pt-8 border-t border-emerald-100">
                            {/* Specs List (if needed or available) */}
                            <section className="bg-emerald-50/50 rounded-2xl p-6 md:p-8 space-y-4 border border-emerald-100/50 text-sm">
                                <h3 className="font-bold text-emerald-900 uppercase tracking-widest text-xs">{t.specs}</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {product.notes.map((note, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                            {note}
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                        {t.certificationValue}
                                    </li>
                                </ul>
                            </section>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}
