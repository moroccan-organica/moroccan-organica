import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductBySlug, shopProducts } from "@/data/shop-products";

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

export default async function ProductDetailPage({ params }: { params: Params }) {
    const { lang, slug } = await params;
    const product = getProductBySlug(slug);

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

    const relatedProducts = shopProducts
        .filter((item) => item.id !== product.id && item.category === product.category)
        .slice(0, 3);

    const localizedName = isRTL ? product.nameAr : product.name;
    const localizedDescription = isRTL ? product.descriptionAr : product.description;

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
                <div className="rounded-3xl border border-emerald-50 bg-white shadow-md">
                    <Image
                        src={product.image}
                        alt={localizedName}
                        width={900}
                        height={640}
                        className="h-[460px] w-full rounded-3xl object-cover"
                        priority
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        {product.badge && (
                            <span className="inline-flex rounded-full border border-emerald-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                {t.badgeFeatured}
                            </span>
                        )}
                        <h1 className="mt-4 text-4xl font-semibold text-emerald-950">{localizedName}</h1>
                        <p className="mt-3 text-lg text-muted-foreground">{localizedDescription}</p>
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
                        <Link
                            href={`/${lang}/contact`}
                            className="flex-1 min-w-[220px] rounded-full border border-transparent bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                            {t.requestQuote}
                        </Link>
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
                <p className="text-lg leading-relaxed text-muted-foreground">
                    {localizedDescription}{" "}
                    {isRTL
                        ? "يتم اختيار كل دفعة بعناية من التعاونيات المغربية وتعبئتها في مختبرات معتمدة لضمان النقاء والأصالة."
                        : "Each batch is cold-filtered in certified Moroccan labs and prepared on demand, ensuring traceability and premium freshness for your brand."}
                </p>
            </section>

            {relatedProducts.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="heading-display text-2xl text-emerald-950">{t.relatedTitle}</h2>
                        <Link href={`/${lang}/shop`} className="text-sm font-semibold text-emerald-700">
                            {t.backToShop}
                        </Link>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedProducts.map((item) => (
                            <article
                                key={item.id}
                                className="flex h-full flex-col rounded-2xl border border-emerald-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="overflow-hidden rounded-t-2xl">
                                    <Image
                                        src={item.image}
                                        alt={isRTL ? item.nameAr : item.name}
                                        width={640}
                                        height={400}
                                        className="h-52 w-full object-cover"
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
                                            href={`/${lang}/shop/${item.slug}`}
                                            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:text-emerald-900"
                                        >
                                            {t.viewDetails}
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
