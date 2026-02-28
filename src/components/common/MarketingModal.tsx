"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface MarketingModalProps {
    lang: string;
}

const copy = {
    en: {
        title: "MOROCCAN ORGANICA",
        heroText: "Quality Moroccan Argan oil & cosmetic products for your brand",
        bodyText: "Discover authentic Moroccan beauty crafted for your brand. Add your own label and access premium-quality products made with traditional expertise and modern standards. Bring the essence of Morocco to your customers.",
        cta: "Start Your Brand",
    },
    ar: {
        title: "موروكان أورغانيكا",
        heroText: "منتجات تجميل وزيت أركان مغربي عالي الجودة لعلامتك التجارية",
        bodyText: "اكتشف الجمال المغربي الأصيل المصمم لعلامتك التجارية. أضف شعارك الخاص واحصل على منتجات ذات جودة متميزة مصنوعة بخبرة تقليدية ومعايير حديثة. اجلب جوهر المغرب لعملائك.",
        cta: "ابدأ علامتك التجارية",
    },
    fr: {
        title: "MOROCCAN ORGANICA",
        heroText: "Produits cosmétiques et huile d'argan marocaine de qualité pour votre marque",
        bodyText: "Découvrez la beauté marocaine authentique conçue pour votre marque. Ajoutez votre propre label et accédez à des produits de qualité premium fabriqués avec un savoir-faire traditionnel et des normes modernes. Apportez l'essence du Maroc à vos clients.",
        cta: "Lancez Votre Marque",
    }
} as const;

type LangKey = keyof typeof copy;

export function MarketingModal({ lang }: MarketingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = copy[(lang as LangKey)] || copy.en;

    const openWhatsApp = () => {
        const phoneNumber = "212648273228";
        const message = "Hello! I'm interested in your products.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
        setIsOpen(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    const handleClose = () => setIsOpen(false);

    return (
        <>
            <div
                className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleClose}
            >
                <div
                    className="relative bg-white max-w-[660px] sm:max-w-[700px] w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                {/* Header - Ultra Compact */}
                <div className="bg-primary py-3 px-4 flex items-center justify-center relative">
                    <h2 className="text-white font-bold text-sm sm:text-base md:text-lg font-serif tracking-tight">
                        {t.title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Hero Image Section - Optimized for vertical space */}
                <div className="relative h-72 sm:h-80 md:h-[420px] w-full shrink-0">
                    <Image
                        src="/images/slider/popup_organica.jpg"
                        alt="Moroccan Organica"
                        fill
                        className="object-cover will-change-transform"
                        style={{ animation: "marketingImageZoom 1500ms ease-out forwards" }}
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent flex items-end justify-center p-5 sm:p-6 text-center">
                        <p className="text-white font-semibold text-base sm:text-xl md:text-2xl font-serif italic max-w-2xl leading-tight">
                            {t.heroText}
                        </p>
                    </div>
                </div>

                {/* Body Content - Tighter spacing to avoid scroll */}
                <div className="p-8 sm:p-9 md:p-10 space-y-6 flex flex-col items-center text-center">
                    <p className="text-muted-foreground leading-snug text-sm sm:text-base md:text-lg font-sans max-w-3xl">
                        {t.bodyText}
                    </p>

                    <button
                        onClick={openWhatsApp}
                        className="w-full sm:w-auto min-w-[220px] py-3.5 px-7 md:py-4 md:px-12 rounded-full font-bold transition-all text-white shadow-md bg-primary hover:bg-primary/90 text-sm sm:text-base md:text-lg cursor-pointer mt-3"
                    >
                        {t.cta}
                    </button>
                </div>
            </div>
            </div>
            <style jsx global>{`
                @keyframes marketingImageZoom {
                    from { transform: scale(1.08); }
                    to { transform: scale(1); }
                }
            `}</style>
        </>
    );
}
