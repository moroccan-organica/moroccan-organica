"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface InnerHeroProps {
    title: string;
    description?: string;
    badge?: string;
    backgroundImage: string;
    titleTag?: "h1" | "h2";
    breadcrumbs?: Breadcrumb[];
}

export default function InnerHero({
    title,
    description,
    badge,
    backgroundImage,
    titleTag = "h1",
    breadcrumbs
}: InnerHeroProps) {
    const TitleTag = titleTag;
    return (
        <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/90 to-secondary/80" />
            </div>

            <div className="container-main relative z-10 py-16 md:py-24">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="flex items-center justify-center gap-2 mb-6 text-white/60 text-xs md:text-sm font-medium uppercase tracking-widest">
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={idx}>
                                    {crumb.href ? (
                                        <Link href={crumb.href} className="hover:text-white transition-colors">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white/40">{crumb.label}</span>
                                    )}
                                    {idx < breadcrumbs.length - 1 && (
                                        <span className="text-white/20">/</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                    {badge && !breadcrumbs && (
                        <span className="inline-block text-primary-foreground/60 font-semibold text-sm uppercase tracking-wider mb-4">
                            {badge}
                        </span>
                    )}
                    <TitleTag className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight uppercase tracking-tight text-center">
                        {title}
                    </TitleTag>
                    {description && (
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
