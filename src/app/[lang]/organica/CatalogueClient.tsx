"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";

interface CatalogueClientProps {
    pageData: any;
    products: any[];
    dict: any;
    lang: string;
}

export default function CatalogueClient({ pageData, products, dict, lang }: CatalogueClientProps) {
    const heroImage = pageData?.translation?.ogImage || "/images/slider/slide_2.webp";
    const isRTL = lang === 'ar';

    const t = {
        en: {
            badge: "Full Collection",
            title: "Organica Collection",
            subtitle: "Explore our complete range of certified organic ingredients",
            empty: "Our collection is currently being updated. Please check back soon."
        },
        ar: {
            badge: "المجموعة الكاملة",
            title: "مجموعة أورغانيكا",
            subtitle: "اكتشف مجموعتنا الكاملة من المكونات العضوية المعتمدة",
            empty: "يجري حالياً تحديث مجموعتنا. يرجى العودة قريباً."
        },
        fr: {
            badge: "Collection Complète",
            title: "Collection Organica",
            subtitle: "Explorez notre gamme complète d'ingrédients certifiés biologiques",
            empty: "Notre collection est en cours de mise à jour. Veuillez revenir bientôt."
        }
    }[lang as 'en' | 'ar' | 'fr'] || {
        badge: "Full Collection",
        title: "Organica Collection",
        subtitle: "Explore our complete range of certified organic ingredients",
        empty: "Our collection is currently being updated. Please check back soon."
    };

    return (
        <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={heroImage}
                        alt={t.title}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#606C38]/95 via-[#606C38]/90 to-[#606C38]/80" />
                </div>

                <div className="container-main relative z-10 py-16 md:py-24">
                    <motion.div
                        className="text-center max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block text-white/70 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/20 pb-1">
                            {t.badge}
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-tight uppercase tracking-tight">
                            {t.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {t.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products List Section */}
            <section className="section-padding bg-[#fefcf8]">
                <div className="container-main">
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
