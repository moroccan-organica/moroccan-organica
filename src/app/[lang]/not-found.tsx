"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function GeneralNotFound() {
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';
    const isRTL = lang === 'ar';

    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-cream-dark/20">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-forest/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-3xl" />
            </div>

            <div className="container-main relative z-10 py-24 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative mb-12"
                >
                    <div className="absolute inset-0 bg-gold/10 rounded-full blur-2xl animate-pulse" />
                    <div className="relative size-24 md:size-32 rounded-3xl bg-white shadow-card flex items-center justify-center border border-emerald-100/50 backdrop-blur-sm">
                        <Home className="size-10 md:size-14 text-forest" strokeWidth={1} />
                        <div className="absolute -bottom-2 -right-2 size-8 md:size-10 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            404
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-6 max-w-2xl px-4"
                >
                    <h1 className="heading-display text-emerald-950">
                        {isRTL ? 'عفواً! الصفحة مفقودة' : 'Lost in the Atlas?'}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {isRTL
                            ? 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها إلى موقع جديد أو مسحها تماماً.'
                            : "The page you're searching for seems to have vanished into the mist. It might have been moved, renamed, or no longer exists."}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href={`/${lang}`}
                            className="btn-accent px-10 py-4 rounded-full flex items-center gap-3 group"
                        >
                            <ArrowLeft className={`size-5 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                            <span className="font-semibold">{isRTL ? 'العودة للرئيسية' : 'Return Home'}</span>
                        </Link>

                        <Link
                            href={`/${lang}/shop`}
                            className="px-10 py-4 rounded-full border border-forest/20 bg-white/50 backdrop-blur-sm text-forest font-semibold hover:border-forest hover:bg-white transition-all duration-300"
                        >
                            {isRTL ? 'تصفح المتجر' : 'Visit Shop'}
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Brand visual tag */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 md:mt-32 uppercase tracking-[0.5em] text-[10px] md:text-[12px] text-forest font-bold"
                >
                    Moroccan Organica • Excellence in Nature
                </motion.div>
            </div>
        </main>
    );
}
