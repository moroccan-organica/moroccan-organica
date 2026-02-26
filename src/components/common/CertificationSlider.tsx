"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const logos = [
    "/images/slider/1.webp",
    "/images/slider/2.webp",
    "/images/slider/3.webp",
    "/images/slider/4.webp",
    "/images/slider/5.webp",
    "/images/slider/6.webp",
];

export default function CertificationSlider() {
    return (
        <section className="bg-muted/30 py-8">
            <div className="container-main">
                <div className="w-full rounded-2xl bg-white/95 py-6 md:py-8 px-0 md:px-2 shadow-sm overflow-hidden relative">
                    <div className="w-full">
                        <motion.div
                            className="flex flex-nowrap items-center gap-4 sm:gap-5 min-w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                        >
                            {[...logos, ...logos].map((logoSrc, idx) => (
                                <div
                                    key={`${logoSrc}-${idx}`}
                                    className="relative h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28 lg:h-24 lg:w-32 shrink-0"
                                >
                                    <Image
                                        src={logoSrc}
                                        alt={
                                            logoSrc.includes("1.webp") ? "moroccan organic USDA certified" :
                                                logoSrc.includes("2.webp") ? "moroccan organic AB certified" :
                                                    logoSrc.includes("3.webp") ? "moroccan organic FDA certified" :
                                                        logoSrc.includes("4.webp") ? "moroccan organic Chamber of Commerce and Industry and Trade Marrakech certified" :
                                                            logoSrc.includes("5.webp") ? "moroccan organic EACCE certified" :
                                                                logoSrc.includes("6.webp") ? "moroccan organic certified" :
                                                                    `Certification logo ${idx + 1}`
                                        }
                                        fill
                                        className="object-contain"
                                        sizes="(min-width: 1024px) 128px, 80vw"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                    {/* Edge fade */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-white to-transparent" />
                </div>
            </div>
        </section>
    );
}
