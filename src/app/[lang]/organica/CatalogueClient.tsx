"use client";

import InnerHero from "@/components/common/InnerHero";
import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";

interface CatalogueClientProps {
    pageData: any;
    products: any[];
    topProducts: any[];
    dict: any;
    lang: string;
}

export default function CatalogueClient({ pageData, products, topProducts, dict, lang }: CatalogueClientProps) {
    const heroImage = pageData?.translation?.ogImage || "/images/slider/slide_2.webp";
    const isRTL = lang === 'ar';

    const t = {
        en: {
            heroTitle: pageData?.translation?.h1 || "Natural Essential Oils Wholesale",
            heroDesc: pageData?.translation?.description || dict.content,
            sectionTitle: "Organic Essential Oils Wholesale Suppliers",
            sectionDesc: "We are wholesale suppliers of Organic Essential Oils, our product are 100% pure and natural, free of herbicidal residue, pesticides and synthetic fertilizers. Our high quality therapeutic grade Organic Essential Oils will make a perfect addition to your body care, aromatherapy and perfumery products.",
            breadcrumbHome: "Home",
            empty: "Our collection is currently being updated. Please check back soon.",
            topSellingTitle: "Best Selling Products",
            topSellingSubtitle: "Our most popular organic selections"
        },
        ar: {
            heroTitle: pageData?.translation?.h1 || "بيع الزيوت الأساسية الطبيعية بالجملة",
            heroDesc: pageData?.translation?.description || dict.content,
            sectionTitle: "موردي الزيوت الأساسية العضوية بالجملة",
            sectionDesc: "نحن موردو زيوت أساسية عضوية بالجملة، منتجاتنا نقية وطبيعية 100٪، خالية من متبقيات مبيدات الأعشاب والمبيدات الحشرية والأسمدة الاصطناعية. زيوتنا الأساسية العضوية عالية الجودة ستكون إضافة مفالية لمنتجات العناية بالجسم والعلاج بالعطور والعطور.",
            breadcrumbHome: "الرئيسية",
            empty: "يجري حالياً تحديث مجموعتنا. يرجى العودة قريباً.",
            topSellingTitle: "المنتجات الأكثر مبيعاً",
            topSellingSubtitle: "اختياراتنا العضوية الأكثر شعبية"
        },
        fr: {
            heroTitle: pageData?.translation?.h1 || "Vente en gros d'huiles essentielles naturelles",
            heroDesc: pageData?.translation?.description || dict.content,
            sectionTitle: "Fournisseurs d'huiles essentielles biologiques en gros",
            sectionDesc: "Nous sommes des fournisseurs en gros d'huiles essentielles biologiques, nos produits sont 100% purs et naturels, exempts de résidus d'herbicides, de pesticides et d'engrais synthétiques. Nos huiles essentielles biologiques de haute qualité thérapeutique seront un complément parfait à vos produits de soin corporel, d'aromathérapie et de parfumerie.",
            breadcrumbHome: "Accueil",
            empty: "Notre collection est en cours de mise à jour. Veuillez revenir bientôt.",
            topSellingTitle: "Produits les plus vendus",
            topSellingSubtitle: "Nos sélections bio les plus populaires"
        }
    }[lang as 'en' | 'ar' | 'fr'] || {
        heroTitle: pageData?.translation?.h1 || "Natural Essential Oils Wholesale",
        heroDesc: pageData?.translation?.description || dict.content,
        sectionTitle: "Organic Essential Oils Wholesale Suppliers",
        sectionDesc: "We are wholesale suppliers of Organic Essential Oils, our product are 100% pure and natural, free of herbicidal residue, pesticides and synthetic fertilizers. Our high quality therapeutic grade Organic Essential Oils will make a perfect addition to your body care, aromatherapy and perfumery products.",
        breadcrumbHome: "Home",
        empty: "Our collection is currently being updated. Please check back soon.",
        topSellingTitle: "Best Selling Products",
        topSellingSubtitle: "Our most popular organic selections"
    };

    return (
        <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
            <InnerHero
                title={t.heroTitle}
                description={t.heroDesc}
                badge={dict.badge || "Premium Collection"}
                backgroundImage={heroImage}
            />

            {/* Top Selling Products Section */}
            {topProducts.length > 0 && (
                <section className="pt-20 pb-10 bg-[#fefcf8]">
                    <div className="container-main">
                        <motion.div
                            className="text-center max-w-4xl mx-auto mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-green-600 uppercase mb-6 tracking-tight">
                                {t.topSellingTitle}
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-4xl mx-auto font-medium">
                                {t.topSellingSubtitle}
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {topProducts.map((product, index) => (
                                <motion.div
                                    key={product.slug || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ProductCard
                                        image={product.image}
                                        title={product.title}
                                        description={product.description}
                                        badge={product.badge}
                                        badgeVariant="organic"
                                        slug={product.slug}
                                        id={product.id}
                                        price={product.price}
                                        volume={product.volume}
                                        showAddToCart={false}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Products List Section */}
            <section className="pt-10 pb-24 bg-[#fefcf8]">
                <div className="container-main">
                    {/* Section Header */}
                    <motion.div
                        className="text-center max-w-4xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 uppercase mb-6 tracking-tight">
                            {t.sectionTitle}
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-4xl mx-auto font-medium">
                            {t.sectionDesc}
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.slug || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard
                                    image={product.image}
                                    title={product.title}
                                    description={product.description}
                                    badge={product.badge}
                                    badgeVariant="premium"
                                    slug={product.slug}
                                    id={product.id}
                                    price={product.price}
                                    volume={product.volume}
                                    showAddToCart={false}
                                    basePath="organica"
                                />
                            </motion.div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="bg-white/50 rounded-3xl border-2 border-dashed border-emerald-900/10 p-20 text-center shadow-sm">
                            <p className="text-muted-foreground text-lg italic">
                                {t.empty}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
