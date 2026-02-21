"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function ShopNotFound() {
    const pathname = usePathname();
    const lang = pathname?.startsWith('/ar') ? 'ar' : 'en';
    const isRTL = lang === 'ar';

    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-cream/30">
            {/* Background patterns and glows */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[10%] w-[35%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-gold/5 rounded-full blur-[80px]" />
            </div>

            <div className="container-main py-20 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "circOut" }}
                    className="relative mb-14"
                >
                    <div className="absolute -inset-4 bg-forest/5 rounded-[40px] rotate-3 blur-xl" />
                    <div className="relative size-28 md:size-36 rounded-[32px] bg-white shadow-xl flex items-center justify-center border border-emerald-50 backdrop-blur-md">
                        <ShoppingBag className="size-12 md:size-16 text-forest" strokeWidth={0.75} />
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-3 -right-3 size-10 md:size-12 rounded-2xl bg-gold flex items-center justify-center text-white shadow-lg"
                        >
                            <Search className="size-5 md:size-6" strokeWidth={2.5} />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-center space-y-8 max-w-2xl px-6"
                >
                    <div className="space-y-4">
                        <h1 className="heading-display text-emerald-950 text-4xl md:text-6xl">
                            {isRTL ? 'المنتج غير متوفر' : 'Product Not Found'}
                        </h1>
                        <div className="h-1 w-24 bg-gold mx-auto rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: [-100, 100] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="h-full w-1/3 bg-white/50"
                            />
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                        {isRTL
                            ? 'عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه. ربما نفدت الكمية من المخزون أو تم تغيير الرابط.'
                            : "We couldn't locate the artisanal piece you're looking for. It might be out of stock, moved to a new collection, or the link has changed."}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5"
                    >
                        <Link
                            href={`/${lang}/shop`}
                            className="btn-primary px-12 py-4 rounded-full text-lg font-medium group transition-all"
                        >
                            {isRTL ? 'العودة للمتجر' : 'Browse All Products'}
                        </Link>

                        <Link
                            href={`/${lang}/contact`}
                            className="px-12 py-4 rounded-full bg-white border border-emerald-100 text-forest font-semibold hover:shadow-lg transition-all"
                        >
                            {isRTL ? 'اتصل بنا للمساعدة' : 'Talk to an Expert'}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
