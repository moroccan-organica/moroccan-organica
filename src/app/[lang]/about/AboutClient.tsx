"use client";

import { useState } from "react";
import { motion, MotionProps, AnimatePresence } from "framer-motion";
import { Leaf, Handshake, Heart, Check, ArrowRight, LucideIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Principle {
    title: string;
    description: string;
}

interface TimelineItem {
    year: string;
    title: string;
    description: string;
}

interface Reason {
    title: string;
    description: string;
}

interface AboutPageData {
    hero: {
        title: string;
        subtitle: string;
        description: string;
        bgImage: string;
    };
    whoWeAre: {
        label: string;
        title: string;
        description: string;
        image: string;
    };
    values: {
        label: string;
        title: string;
        description: string;
        principles: Principle[];
    };
    journey: {
        label: string;
        title: string;
        timeline: TimelineItem[];
    };
    origins: {
        label: string;
        title: string;
        description: string;
    };
    cooperatives: {
        title: string;
        description: string;
        fairTitle: string;
        fairPrinciples: string[];
        paragraphs: string[];
    };
    promise: {
        label: string;
        title: string;
        reasons: Reason[];
    };
    offer: {
        label: string;
        title: string;
        description: string;
    };
    partnership: {
        label: string;
        title: string;
        description: string;
        cta: string;
        bgImage: string;
    };
}

interface AboutClientProps {
    data: AboutPageData;
    dict: Partial<AboutPageData>;
    lang: string;
}

const principleIcons: Record<string, LucideIcon> = {
    "Quality": Leaf,
    "Ethics": Handshake,
    "Authenticity": Heart,
};

const defaultIcons = [Leaf, Handshake, Heart];

export default function AboutClient({ data, dict, lang }: AboutClientProps) {
    const [openPromise, setOpenPromise] = useState<string | null>(null);

    const fadeInUp: MotionProps = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    // Safely merge mock data with dictionary
    const content = {
        hero: { ...data.hero, ...dict.hero },
        whoWeAre: { ...data.whoWeAre, ...dict.whoWeAre },
        values: { ...data.values, ...dict.values },
        journey: { ...data.journey, ...dict.journey },
        origins: { ...data.origins, ...dict.origins },
        cooperatives: { ...data.cooperatives, ...dict.cooperatives },
        promise: { ...data.promise, ...dict.promise },
        offer: { ...data.offer, ...dict.offer },
        partnership: { ...data.partnership, ...dict.partnership },
    };

    const renderWithHighlights = (text: string) => {
        const highlights = [
            "MoroccanOrganica",
            "premium Moroccan organic beauty products",
            "100% natural",
            "wholesale company",
            "Moroccan organic beauty industry",
            "Argan Oil",
            "Black Soap",
            "Rhassoul Clay",
            "Nila Powder",
            "authentic Moroccan beauty",
        ];

        const regex = new RegExp(`(${highlights.join("|")})`, "gi");
        return text.split(regex).map((part, idx) => {
            const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
            return isHighlight ? (
                <strong key={`hl-${idx}`} className="font-semibold text-foreground">
                    {part}
                </strong>
            ) : (
                <span key={`txt-${idx}`}>{part}</span>
            );
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Section A: Hero & Intro */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={content.hero.bgImage || "/images/about/hero-logistics.jpg"}
                        alt="Hero background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-secondary/55 via-secondary/35 to-secondary/15" />
                </div>

                <div className="container-main relative z-10 py-20 md:py-32">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {content.hero.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Section A2: Wholesale Statement */}
            <section className="bg-white">
                <div className="container-main py-3 md:py-4 text-center">
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-primary uppercase tracking-wide mb-3">
                        Wholesale of organic cosmetics products
                    </h2>
                    <p className="max-w-5xl mx-auto text-base md:text-xl text-muted-foreground leading-relaxed">
                        Our company provides different moroccan organic products, and services including private label for its worldwide customers we deals with international countries all over the world, in Europe, Asia, America, Australia and Africa.
                    </p>
                </div>
            </section>

            {/* Section B: Who We Are */}
            <section className="section-padding bg-card pt-10 md:pt-12">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <motion.div {...fadeInUp}>
                            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                                {content.whoWeAre.label}
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                {content.whoWeAre.title}
                            </h2>
                            <p className="text-body text-muted-foreground leading-relaxed text-lg">
                                {content.whoWeAre.description}
                            </p>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative overflow-hidden rounded-t-[100px] rounded-b-2xl shadow-xl">
                                <Image
                                    src={content.whoWeAre.image || "/images/about/argan-oil.jpg"}
                                    alt="Moroccan organic products"
                                    width={600}
                                    height={500}
                                    className="w-full h-[400px] md:h-[500px] object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section C: Our Principles */}
            <section className="section-padding bg-background">
                <div className="container-main">
                    <motion.div className="text-center mb-16" {...fadeInUp}>
                        <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                            {content.values.label}
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            {content.values.title}
                        </h2>
                        <p className="text-body text-muted-foreground max-w-2xl mx-auto text-lg">
                            {content.values.description}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {content.values.principles.map((principle: Principle, index: number) => {
                            const Icon = principleIcons[principle.title] || defaultIcons[index % defaultIcons.length];
                            return (
                                <motion.div
                                    key={principle.title}
                                    className="bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                                        {principle.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {principle.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section D: Timeline */}
            <section className="section-padding bg-muted/30">
                <div className="container-main">
                    <motion.div className="text-center mb-16" {...fadeInUp}>
                        <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                            {content.journey.label}
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                            {content.journey.title}
                        </h2>
                    </motion.div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-bronze/50 via-bronze to-bronze/50 -translate-x-1/2" />

                        <div className="space-y-6 md:space-y-0">
                            {content.journey.timeline.map((item: TimelineItem, index: number) => (
                                <motion.div
                                    key={item.year}
                                    className={`relative md:flex items-center md:min-h-[120px] ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                        }`}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                                        <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
                                            <span className="text-primary font-bold text-3xl font-serif">{item.year}</span>
                                            <h3 className="font-serif text-lg font-semibold text-foreground mt-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-bronze border-4 border-card shadow-lg z-10" />
                                    <div className="hidden md:block md:w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* Section E2: Cooperatives & Fair Trade */}
            <section className="section-padding bg-background">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        <motion.div className="space-y-6" {...fadeInUp}>
                            <div>
                                <h3 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                                    {content.cooperatives.title}
                                </h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {content.cooperatives.description}
                                </p>
                            </div>

                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h4 className="font-serif text-2xl font-semibold text-foreground mb-3">
                                    {content.cooperatives.fairTitle}
                                </h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    {content.cooperatives.fairPrinciples.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                                            <span className="text-base leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {content.cooperatives.paragraphs.map((paragraph, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <p className="text-base md:text-lg text-foreground leading-relaxed space-x-0">
                                        {renderWithHighlights(paragraph)}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section F: Why Choose Us */}
            <section className="section-padding bg-card">
                <div className="container-main">
                    <motion.div className="text-center mb-16" {...fadeInUp}>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                            {content.promise.title}
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
                        {content.promise.reasons.map((item: Reason, index: number) => {
                            const isOpen = openPromise === item.title;
                            return (
                                <motion.div
                                    key={item.title}
                                    layout
                                    className={`group rounded-2xl bg-background border transition-all duration-300 overflow-hidden cursor-pointer ${isOpen
                                        ? "border-primary shadow-lg ring-1 ring-primary/20"
                                        : "border-border hover:border-primary/50 hover:shadow-md"
                                        }`}
                                    onMouseEnter={() => setOpenPromise(item.title)}
                                    onMouseLeave={() => setOpenPromise(null)}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <div className="p-6 flex items-start gap-4">
                                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                            }`}>
                                            <Check className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <h3 className={`font-serif text-lg font-bold transition-colors duration-300 ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                                                    }`}>
                                                    {item.title}
                                                </h3>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
                                                        }`}
                                                />
                                            </div>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    >
                                                        <p className="text-muted-foreground leading-relaxed pt-2 pb-1 border-t border-border/50 mt-3">
                                                            {item.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section G: Our Products */}
            <section className="py-20 md:py-24 bg-background">
                <div className="container-main">
                    <motion.div className="max-w-4xl mx-auto text-center" {...fadeInUp}>
                        <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                            {content.offer.label}
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                            {content.offer.title}
                        </h2>
                        <p className="text-body text-muted-foreground leading-relaxed text-lg">
                            {content.offer.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section H: Wholesale CTA */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={content.partnership.bgImage || "/images/about/warehouse.jpg"}
                        alt="Wholesale warehouse"
                        fill
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-secondary/95 via-secondary/90 to-secondary/80" />
                </div>

                <div className="container-main relative z-10">
                    <motion.div className="text-center max-w-3xl mx-auto" {...fadeInUp}>
                        <span className="inline-block text-bronze font-semibold text-sm uppercase tracking-wider mb-4">
                            {content.partnership.label}
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            {content.partnership.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                            {content.partnership.description}
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={`/${lang}/contact`}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-bronze text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-bronze-dark transition-all duration-300"
                            >
                                {content.partnership.cta}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
