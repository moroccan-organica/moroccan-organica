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
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleClose}
        >
            <div
                className="relative bg-white max-w-[95%] sm:max-w-md md:max-w-lg w-full rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Ultra Compact */}
                <div className="bg-primary py-1.5 px-3 flex items-center justify-center relative">
                    <h2 className="text-white font-bold text-[10px] sm:text-xs md:text-sm font-serif tracking-tight">
                        {t.title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>

                {/* Hero Image Section - Optimized for vertical space */}
                <div className="relative h-24 sm:h-32 md:h-40 w-full shrink-0">
                    <Image
                        src="/images/slider/popup_organica.jpg"
                        alt="Moroccan Organica"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent flex items-end justify-center p-2 sm:p-3 text-center">
                        <p className="text-white font-semibold text-[11px] sm:text-sm md:text-base font-serif italic max-w-sm leading-tight">
                            {t.heroText}
                        </p>
                    </div>
                </div>

                {/* Body Content - Tighter spacing to avoid scroll */}
                <div className="p-3 sm:p-4 md:p-5 space-y-2.5 flex flex-col items-center text-center">
                    <p className="text-muted-foreground leading-snug text-[10px] sm:text-[12px] md:text-sm font-sans max-w-md">
                        {t.bodyText}
                    </p>

                    <button
                        onClick={openWhatsApp}
                        className="w-full sm:w-auto min-w-[140px] py-2 px-5 md:py-2.5 md:px-8 rounded-full font-bold transition-all text-white shadow-sm bg-primary hover:bg-primary/90 text-[10px] sm:text-xs md:text-sm cursor-pointer mt-1"
                    >
                        {t.cta}
                    </button>
                </div>
            </div>
        </div>
    );
}
