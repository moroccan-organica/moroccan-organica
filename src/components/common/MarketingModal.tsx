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

export function MarketingModal({ lang }: MarketingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = (copy as any)[lang] || copy.en;

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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleClose}
        >
            <div
                className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-primary py-4 px-6 relative flex items-center justify-center">
                    <h2 className="text-white font-bold text-lg font-serif">
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
                <div className="relative h-64 w-full">
                    <Image
                        src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop"
                        alt="Cosmetic product"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-6 text-center">
                        <p className="text-white font-semibold text-lg md:text-xl font-serif italic">
                            {t.heroText}
                        </p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-8 space-y-8 flex flex-col items-center text-center">
                    <p className="text-muted-foreground leading-relaxed text-base font-sans mt-2">
                        {t.bodyText}
                    </p>

                    <button
                        onClick={handleClose}
                        className="btn-accent w-full py-4 px-8 rounded-full font-bold transition-all text-white shadow-lg"
                    >
                        {t.cta}
                    </button>
                </div>
            </div>
        </div>
    );
}
