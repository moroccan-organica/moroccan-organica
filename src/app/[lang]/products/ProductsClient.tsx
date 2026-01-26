"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";

interface ProductsClientProps {
    pageData: any;
    topProducts: any[];
    dict: any;
    lang: string;
}

export default function ProductsClient({ pageData, topProducts, dict, lang }: ProductsClientProps) {
    const heroImage = pageData?.translation?.ogImage || "/images/slider/slide_1.webp"; // Using high quality site image

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={heroImage}
                        alt={pageData?.translation?.h1 || "Our Products"}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/90 to-secondary/80" />
                </div>

                <div className="container-main relative z-10 py-20 md:py-28">
                    <motion.div
                        className="text-center max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block text-primary-foreground/60 font-semibold text-sm uppercase tracking-wider mb-4">
                            {dict.badge || "Premium Collection"}
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {pageData?.translation?.h1 || "Moroccan cosmetic wholesale"}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {pageData?.translation?.description || dict.content}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products List Section */}
            <section className="section-padding">
                <div className="container-main">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="heading-section mb-2">
                                {dict.topSellingTitle || "Best Selling Products"}
                            </h2>
                            <p className="text-muted-foreground">
                                {dict.topSellingSubtitle || "Our most popular organic selections"}
                            </p>
                        </motion.div>
                        <div className="h-px flex-grow bg-primary/10 mx-6 hidden lg:block" />
                    </div>

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
                                />
                            </motion.div>
                        ))}
                    </div>

                    {topProducts.length === 0 && (
                        <div className="bg-muted/30 rounded-3xl border-2 border-dashed border-muted-foreground/20 p-20 text-center">
                            <p className="text-muted-foreground text-lg italic">
                                Our top products are being refreshed. Please browse our shop for more options.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
