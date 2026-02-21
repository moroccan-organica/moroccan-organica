"use client";

import Link from "next/link";
import { FileText, ArrowLeft, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function BlogNotFound() {
    const pathname = usePathname();
    const lang = pathname?.startsWith('/ar') ? 'ar' : 'en';
    const isRTL = lang === 'ar';

    return (
        <main dir={isRTL ? "rtl" : "ltr"} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
            {/* Editorial aesthetic background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-cream)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest)_3%,transparent_30%)] opacity-[0.03]" />

            <div className="container-main relative z-10 py-24 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 relative"
                >
                    <div className="absolute inset-0 bg-forest/5 blur-3xl rounded-full" />
                    <div className="relative size-24 md:size-32 rounded-full border border-forest/10 flex items-center justify-center bg-white shadow-soft">
                        <BookOpen className="size-10 md:size-14 text-forest" strokeWidth={1} />
                        <motion.div
                            initial={{ rotate: 15 }}
                            animate={{ rotate: [15, -15, 15] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute -top-1 -right-1 size-8 md:size-10 rounded-full bg-bronze flex items-center justify-center text-white shadow-lg"
                        >
                            <FileText className="size-4 md:size-5" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-3xl text-center space-y-8 px-6"
                >
                    <div className="space-y-4">
                        <span className="text-xs md:text-sm font-bold tracking-[0.4em] text-bronze uppercase">
                            {isRTL ? 'الصحافة العضوية' : 'The Organic Journal'}
                        </span>
                        <h1 className="heading-display text-emerald-950 text-4xl md:text-6xl italic">
                            {isRTL ? 'هذا المقال غير موجود حالياً' : 'A Story Yet Untold'}
                        </h1>
                    </div>

                    <p className="text-lg md:text-xl text-muted-foreground font-serif leading-relaxed max-w-xl mx-auto">
                        {isRTL
                            ? 'يبدو أن المقال الذي تبحث عنه قد تم حذفه أو أن الرابط غير صحيح. استمر في اكتشاف مدونتنا للحصول على مزيد من الإلهام.'
                            : "The chronicle you're seeking hasn't been written yet or has passed into history. Explore our collection for more insights into Moroccan wellness."}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href={`/${lang}/blog`}
                            className="px-12 py-4 bg-forest text-white rounded-lg font-serif italic text-lg hover:bg-forest-dark transition-all shadow-xl group flex items-center gap-3"
                        >
                            <span className="font-semibold">{isRTL ? 'العودة للمقالات' : 'Back to Magazine'}</span>
                            <ArrowLeft className={`size-5 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                        </Link>

                        <Link
                            href={`/${lang}`}
                            className="px-8 py-4 border-b-2 border-transparent hover:border-forest text-forest font-medium transition-all"
                        >
                            {isRTL ? 'الرئيسية' : 'Home Page'}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
