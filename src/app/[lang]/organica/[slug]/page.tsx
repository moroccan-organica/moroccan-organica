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
import InnerHero from "@/components/common/InnerHero";

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
            url: `https://www.moroccanorganica.com/${lang}/organica/${slug}`,
        },
        alternates: {
            canonical: product.canonical || `https://www.moroccanorganica.com/${lang}/organica/${slug}`,
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
    const t = copy[isRTL ? "ar" : "en"];

    const localizedName = isRTL ? product.nameAr : product.name;
    const localizedH1 = isRTL ? product.h1Ar : (lang === 'fr' ? product.h1Fr : product.h1);
    const localizedDescription = isRTL ? product.descriptionAr : product.description;
    const localizedDetails = isRTL ? product.detailsAr : (lang === 'fr' ? product.detailsFr : product.details);

    const galleryImages = [product.image, ...product.gallery].filter(Boolean);

    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="pb-12 md:pb-20 bg-[#fefcf8]">
            <InnerHero
                title={localizedDescription || localizedName || ""}
                description=""
                badge={product.category}
                backgroundImage={product.image || "/images/slider/slide_2.webp"}
                titleTag="h2"
                breadcrumbs={[
                    { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: `/${lang}` },
                    { label: localizedName || "", href: `/${lang}/organica/${slug}` }
                ]}
            />

            <div className="container-main mt-12 md:mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12 lg:gap-16">
                    {/* Left Sidebar - Quote Form */}
                    <aside className="space-y-8 order-2 lg:order-1">
                        <div className="sticky top-24">
                            <WholesaleQuoteForm lang={lang} productName={localizedName || ""} />
                        </div>
                    </aside>

                    {/* Right Content Area */}
                    <article className="space-y-10 order-1 lg:order-2">
                        {/* Main Product Display */}
                        <div className="space-y-2">
                            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/5 border border-emerald-50 bg-white">
                                <ProductImageGallery images={galleryImages} alt={localizedName} />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#606C38] leading-tight uppercase tracking-tight">
                                    {localizedH1 || localizedName}
                                </h1>
                            </div>
                        </div>

                        {/* Detailed Story / Technical Info */}
                        {(localizedDetails || (product.notes && product.notes.length > 0)) && (
                            <div className="space-y-2 pt-2 border-t border-emerald-100">
                                {localizedDetails && (
                                    <section className="space-y-6">
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
                    </article>
                </div>
            </div>
        </main>
    );
}
