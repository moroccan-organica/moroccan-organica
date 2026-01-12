
import Link from "next/link";
import { shopProducts } from "@/data/shop-products";

const copy = {
    en: {
        title: "Shop Moroccan Organica",
        subtitle:
            "Discover small-batch, ethically sourced Moroccan oils, butters, and beauty essentials crafted in certified laboratories.",
        filtersLabel: "Browse by collection",
        featuredLabel: "Bestseller",
        viewDetails: "View Details",
        comingSoon: "Nationwide delivery coming soon",
        pagination: { prev: "Previous", next: "Next" },
    },
    ar: {
        title: "تسوق منتجات موروكان أورغانيكا",
        subtitle:
            "اكتشف الزيوت والزبدات المغربية الأصيلة المنتجة بكميات محدودة وبجودة مخبرية معتمدة.",
        filtersLabel: "تصفح حسب المجموعة",
        featuredLabel: "الأكثر مبيعاً",
        viewDetails: "عرض التفاصيل",
        comingSoon: "الشحن لجميع المدن قريباً",
        pagination: { prev: "السابق", next: "التالي" },
    },
} as const;

const mockProducts = shopProducts;

const filterPresets = [
    { labelEn: "All Products", labelAr: "كل المنتجات" },
    { labelEn: "Oils", labelAr: "الزيوت" },
    { labelEn: "Hydrosols", labelAr: "الماء المقطر" },
    { labelEn: "Spa Rituals", labelAr: "طقوس السبا" },
    { labelEn: "Powders", labelAr: "المساحيق" },
] as const;

export default async function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isRTL = lang === "ar";
    const locale = isRTL ? "ar-MA" : "en-US";
    const t = copy[isRTL ? "ar" : "en"];
    const currentPage = 1;
    const totalPages = 12;
    const priceFormatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

    return (
        <main
            dir={isRTL ? "rtl" : "ltr"}
            className="container-main py-16 md:py-24 space-y-16"
        >
            <section className="px-6 py-12 text-center md:px-12">
                <div className="mx-auto max-w-4xl">
                    <p className="text-sm uppercase tracking-[0.4em] text-emerald-600">
                        Organic · Fair Trade · Made in Morocco
                    </p>
                    <h1 className="heading-display mt-4 text-balance text-4xl font-semibold text-emerald-950 md:text-5xl">
                        {t.title}
                    </h1>
                    <p className="text-body mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        {t.subtitle}
                    </p>
                </div>
            </section>

            <section className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
                            {t.filtersLabel}
                        </p>
                        <h2 className="heading-display mt-2 text-3xl text-emerald-950">
                            {isRTL ? "منتجات جاهزة للتصدير" : "Ready-to-ship Collections"}
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {filterPresets.map((filter, index) => (
                            <span
                                key={`${filter.labelEn}-${index}`}
                                className={`rounded-full px-4 py-2 text-sm font-medium ${
                                    index === 0
                                        ? "bg-emerald-600 text-white"
                                        : "border border-emerald-100 bg-white text-emerald-700"
                                }`}
                            >
                                {isRTL ? filter.labelAr : filter.labelEn}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {mockProducts.map((product) => {
                        const localizedName = isRTL ? product.nameAr : product.name;
                        const localizedDescription = isRTL
                            ? product.descriptionAr
                            : product.description;
                        return (
                            <article
                                key={product.id}
                                className="group flex h-full flex-col rounded-3xl border border-emerald-100 bg-white/90 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative overflow-hidden rounded-t-3xl">
                                    <img
                                        src={product.image}
                                        alt={localizedName}
                                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {product.badge && (
                                        <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow">
                                            {isRTL ? t.featuredLabel : t.featuredLabel}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-4 p-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                                            {product.category}
                                        </p>
                                        <h3 className="mt-2 text-lg font-semibold text-emerald-950">
                                            {localizedName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {localizedDescription}
                                        </p>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                                {isRTL ? "السعر" : "Price"}
                                            </p>
                                            <p className="text-2xl font-semibold text-emerald-700">
                                                {priceFormatter.format(product.price)}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/${lang}/shop/${product.slug}`}
                                            className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                                        >
                                            {t.viewDetails}
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-full border border-emerald-100 bg-white px-6 py-4 shadow-sm">
                <div className={`flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between ${isRTL ? "text-right" : "text-left"}`}>
                    <div className="flex items-center gap-2 text-emerald-800">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>
                            {isRTL
                                ? `صفحة ${currentPage} من ${totalPages}`
                                : `Page ${currentPage} of ${totalPages}`}
                        </span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button
                            className="rounded-full border border-emerald-100 px-5 py-2 font-semibold text-emerald-500 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40"
                            disabled
                        >
                            {t.pagination.prev}
                        </button>
                        <button className="rounded-full border border-transparent bg-emerald-600 px-5 py-2 font-semibold text-white shadow hover:bg-emerald-500">
                            {t.pagination.next}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
