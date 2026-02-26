"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface MarketingModalProps {
    lang: string;
}

const copy = {
    en: {
        title: "Moroccan Organica",
        heroText: "Discover authentic Moroccan beauty for your brand",
        bodyText: "Discover authentic Moroccan beauty crafted for your brand. Add your own label and access premium-quality products made with traditional expertise and modern standards. Bring the essence of Morocco to your customers.",
        cta: "Start Your Brand",
    },
    ar: {
        title: "موروكان أورغانيكا",
        heroText: "اكتشف الجمال المغربي الأصيل لعلامتك التجارية",
        bodyText: "اكتشف الجمال المغربي الأصيل المصمم خصيصًا لعلامتك التجارية. أضف شعارك الخاص واحصل على منتجات متميزة الجودة مصنوعة بخبرة تقليدية ومعايير حديثة. اجلب جوهر المغرب لعملائك.",
        cta: "ابدأ علامتك التجارية",
    },
    fr: {
        title: "Moroccan Organica",
        heroText: "Découvrez la beauté marocaine authentique pour votre marque",
        bodyText: "Découvrez la beauté marocaine authentique conçue pour votre marque. Ajoutez votre propre label et accédez à des produits de qualité premium fabriqués avec une expertise traditionnelle et des standards modernes. Apportez l'essence du Maroc à vos clients.",
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
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleClose}
        >
            <div
                className="relative bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-primary py-3 px-4 relative flex items-center justify-center">
                    <h2 className="text-white font-bold text-base md:text-lg font-serif">
                        {t.title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="absolute right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/15 text-white hover:bg-black/25 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Hero Image Section */}
                <div className="relative h-64 md:h-80 w-full">
                    <Image
                        src="/images/slider/popup_organica.jpg"
                        alt="Moroccan Organica Cosmetic Products"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-6 text-center">
                        <p className="text-white font-semibold text-base md:text-xl font-serif italic">
                            {t.heroText}
                        </p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 space-y-6 flex flex-col items-center text-center">
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-sans mt-1">
                        {t.bodyText}
                    </p>

                    <button
                        onClick={openWhatsApp}
                        className="w-full py-3 md:py-4 px-6 md:px-8 rounded-full font-bold transition-all text-white shadow-lg bg-primary hover:bg-primary/90 text-sm md:text-base"
                    >
                        {t.cta}
                    </button>
                </div>
            </div>
        </div>
    );
}
