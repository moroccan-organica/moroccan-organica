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
        breadcrumbHome: "Organica",
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
        backToProducts: "Back to Organica",
    },
    ar: {
        breadcrumbHome: "أورغانيكا",
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
        backToProducts: "الرجوع لأورغانيكا",
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
        title: product.metaTitle || `${name} | Organica`,
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

export default async function CatalogueDetailPage({ params }: { params: Params }) {
    const { lang, slug } = await params;

    // Try to fetch from database first
    let product: ShopProductDB | null = await getProductBySlug(slug, lang as 'en' | 'ar' | 'fr');
    let relatedProducts: ShopProductDB[] = [];

    if (!product) {
        notFound();
    }

    // Redirect logic for different placements
    if (product.placement === 'shop') {
        redirect(`/${lang}/shop/${slug}`);
    }

    // Get related from DB - try by category first
    if (product && product.categorySlug) {
        const currentProduct = product;
        const { getCategories } = await import('@/actions/category.actions');
        const categories = await getCategories();
        const category = categories.find(c => c.slug === currentProduct.categorySlug || c.slugAr === currentProduct.categorySlug);

        if (category) {
            relatedProducts = await getRelatedProducts(currentProduct.id, category.id, 3);
        }
    }

    // Fallback for related products
    if (product && relatedProducts.length === 0) {
        const currentProduct = product;
        const allProductsResult = await getProducts({ isAvailable: true, placement: 'catalogue', limit: 10 });
        relatedProducts = allProductsResult.products
            .filter(p => p.id !== currentProduct.id)
            .slice(0, 3);
    }

    const isRTL = lang === "ar";
    const locale = isRTL ? "ar-MA" : "en-US";
    const t = copy[isRTL ? "ar" : "en"];

    const localizedName = isRTL ? product.nameAr : product.name;
    const localizedDescription = isRTL ? product.descriptionAr : product.description;
    const localizedDetails = isRTL ? product.detailsAr : (lang === 'fr' ? product.detailsFr : product.details);

    const galleryImages = [product.image, ...product.gallery].filter(Boolean);

    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="container-main py-12 md:py-20 bg-[#fefcf8]">
            {/* Breadcrumbs */}
            <nav className="text-xs text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                    <Link href={`/${lang}/organica`} className="hover:text-emerald-700">
                        {t.breadcrumbHome}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">{localizedName}</span>
                </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12 lg:gap-16">
                {/* Left Sidebar - Quote Form */}
                <aside className="space-y-8 order-2 lg:order-1">
                    <div className="sticky top-24">
                        <WholesaleQuoteForm lang={lang} productName={localizedName || ""} />

                        <div className="mt-8 p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                            <h4 className="font-bold text-emerald-900 mb-4 text-sm uppercase tracking-wider">{t.certification}</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>ECOCERT Organic Standard</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>USDA Organic Certified</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>ISO 22716 (GMP)</span>
                                </div>
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
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#606C38] block mb-2">
                                    {product.category} | {t.certificationValue.split(' · ')[0]}
                                </span>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#606C38] leading-tight uppercase tracking-tight">
                                    {localizedName}
                                </h1>
                                <div className="h-1.5 w-24 bg-[#606C38]/20 rounded-full" />
                            </div>

                            <div className="prose prose-emerald max-w-none">
                                <p className="text-lg leading-relaxed text-slate-700 font-medium">
                                    {localizedDescription}
                                </p>
                            </div>

                            {/* Key Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                <div className="bg-white p-4 rounded-xl border border-emerald-50 shadow-sm">
                                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">{t.volume}</span>
                                    <span className="font-bold text-emerald-950">{product.volume}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-emerald-50 shadow-sm">
                                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">SKU</span>
                                    <span className="font-bold text-emerald-950">{product.sku || 'N/A'}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-emerald-50 shadow-sm col-span-2 md:col-span-1">
                                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">{t.fulfillment}</span>
                                    <span className="font-bold text-emerald-950 text-xs">{t.fulfillmentValue}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Story / Technical Info */}
                    {(localizedDetails || (product.notes && product.notes.length > 0)) && (
                        <div className="space-y-12 pt-10 border-t border-emerald-100">
                            {localizedDetails && (
                                <section className="space-y-6">
                                    <h2 className="heading-display text-2xl text-emerald-950">{t.descriptionTitle}</h2>
                                    <div
                                        className="prose prose-emerald max-w-none text-slate-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: localizedDetails }}
                                    />
                                </section>
                            )}

                            {product.notes && product.notes.length > 0 && (
                                <section className="bg-[#606C38]/5 rounded-3xl p-8 md:p-10 space-y-6 border border-[#606C38]/10">
                                    <h3 className="font-bold text-[#606C38] uppercase tracking-widest text-xs">{t.specs}</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                        {product.notes.map((note, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                {note}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="pt-16 border-t border-emerald-100">
                            <h3 className="heading-display text-2xl text-emerald-950 mb-8">{t.relatedTitle}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProducts.map((rp) => (
                                    <Link key={rp.id} href={`/${lang}/organica/${rp.slug}`} className="group space-y-3">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-emerald-50 shadow-sm">
                                            <Image
                                                src={rp.image || '/images/placeholder.svg'}
                                                alt={rp.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <h4 className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{isRTL ? rp.nameAr : rp.name}</h4>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
        </main>
    );
}
