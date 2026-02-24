"use client";

import { motion, MotionProps } from "framer-motion";
import {
    Download,
    CheckCircle,
    Leaf,
    Sparkles,
    Droplets,
    Shield,
    ClipboardList,
    Palette,
    Cog,
    AlertTriangle,
    ArrowRight,
    Users,
    Award,
    DollarSign
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Stat {
    value: string;
    label: string;
}

interface Feature {
    title: string;
    description: string;
}

interface ProcessStep {
    step: string;
    title: string;
    description: string;
}

interface Condition {
    category: string;
    moq: string;
    unit: string;
    note: string;
}

interface PrivateLabelData {
    hero: {
        label: string;
        title: string;
        description: string;
        cta: string;
        bgImage: string;
    };
    stats: Stat[];
    intro: {
        label: string;
        title: string;
        description1: string;
        description2: string;
        images: string[];
    };
    expertise: {
        label: string;
        title: string;
        features: Feature[];
        sideImages: string[];
    };
    advantages: {
        title: string;
        list: string[];
        mainImage: string;
    };
    process: {
        label: string;
        title: string;
        steps: ProcessStep[];
    };
    terms: {
        label: string;
        title: string;
        conditions: Condition[];
        sideImages: string[];
    };
    compliance: {
        title: string;
        description: string;
    };
    cta: {
        title: string;
        description: string;
        buttonText: string;
    };
}

interface PrivateLabelClientProps {
    data: PrivateLabelData;
    dict: Partial<PrivateLabelData>;
    lang: string;
}

const statIcons = [Users, Award, DollarSign];
const featureIcons = [Leaf, Sparkles, Droplets, Shield];
const processIcons = [ClipboardList, Palette, Cog];

export default function PrivateLabelClient({ data, dict, lang }: PrivateLabelClientProps) {
    const fadeInUp: MotionProps = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    // Merge mock data with dictionary
    const content = {
        hero: { ...data.hero, ...dict.hero },
        stats: data.stats.map((s, i) => ({ ...s, ...(dict.stats?.[i] || {}) })),
        intro: { ...data.intro, ...dict.intro },
        expertise: {
            ...data.expertise,
            ...dict.expertise,
            features: data.expertise.features.map((f, i) => ({ ...f, ...(dict.expertise?.features?.[i] || {}) }))
        },
        advantages: {
            ...data.advantages,
            ...dict.advantages,
            list: dict.advantages?.list || data.advantages.list
        },
        process: {
            ...data.process,
            ...dict.process,
            steps: data.process.steps.map((s, i) => ({ ...s, ...(dict.process?.steps?.[i] || {}) }))
        },
        terms: {
            ...data.terms,
            ...dict.terms,
            conditions: data.terms.conditions.map((c, i) => ({ ...c, ...(dict.terms?.conditions?.[i] || {}) }))
        },
        compliance: { ...data.compliance, ...dict.compliance },
        cta: { ...data.cta, ...dict.cta },
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Section A: Hero */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={content.hero.bgImage}
                        alt="Manufacturing"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-secondary/60 via-secondary/40 to-secondary/25" />
                </div>

                <div className="container-main relative z-10 py-20 md:py-32">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                            {content.hero.label}
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {content.hero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-10">
                            {content.hero.description}
                        </p>
                        <button
                            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <Download className="mr-2 w-5 h-5" />
                            {content.hero.cta}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Section B: Stats Bar */}
            <section className="py-12 bg-primary">
                <div className="container-main">
                    <div className="grid md:grid-cols-3 gap-8">
                        {content.stats.map((stat, index) => {
                            const Icon = statIcons[index % statIcons.length];
                            return (
                                <motion.div
                                    key={stat.label}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <Icon className="w-6 h-6 text-white/80" />
                                        <span className="text-4xl md:text-5xl font-serif font-bold text-white">{stat.value}</span>
                                    </div>
                                    <p className="text-white/80 font-medium">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Product Intro with Images */}
            <section className="py-12 md:py-16 bg-background">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div className="text-center max-w-3xl mx-auto" {...fadeInUp}>
                            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                                {content.intro.label}
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                                {content.intro.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                                {content.intro.description1}
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {content.intro.description2}
                            </p>
                        </motion.div>

                        {/* Product Image */}
                        <motion.div
                            className="relative h-[360px] rounded-2xl overflow-hidden shadow-xl"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image src={content.intro.images[0]} alt="Private Label Products" fill className="object-cover" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section C2: Product Gallery */}
            <section className="py-12 md:py-16 bg-background">
                <div className="container-main">
                    <motion.div className="text-center mb-10" {...fadeInUp}>
                        <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                            {content.expertise.label}
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                            {content.expertise.title}
                        </h3>
                    </motion.div>

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {content.expertise.sideImages.map((image, idx) => (
                            <motion.div
                                key={image + idx}
                                className="relative rounded-2xl overflow-hidden shadow-xl bg-card break-inside-avoid"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.45 }}
                            >
                                <div className="relative w-full" style={{ height: idx % 2 === 0 ? "280px" : "360px" }}>
                                    <Image src={image} alt="Private label gallery" fill className="object-cover" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section C: Why Choose Us */}
            <section className="py-12 md:py-16 bg-muted/30">
                <div className="container-main">
                    <motion.div className="mb-10 text-center" {...fadeInUp}>
                        <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                            {content.expertise.label}
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {content.expertise.title}
                        </h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        {content.expertise.features.map((feature, index) => {
                            const Icon = featureIcons[index % featureIcons.length];
                            return (
                                <motion.div
                                    key={feature.title}
                                    className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Advantages Checklist with Image */}
            <section className="py-12 md:py-16 bg-background">
                <div className="container-main">
                    <motion.div className="text-center mb-10" {...fadeInUp}>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                            {content.advantages.title}
                        </h3>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Side */}
                        <motion.div
                            className="relative lg:order-1"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src={content.advantages.mainImage}
                                    alt="Private Label Products"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-xl">
                                <p className="text-3xl font-serif font-bold">100%</p>
                                <p className="text-sm font-medium">Organic</p>
                            </div>
                        </motion.div>

                        {/* Checklist Side */}
                        <motion.div className="lg:order-2" {...fadeInUp}>
                            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
                                {content.advantages.list.map((advantage, index) => (
                                    <motion.div
                                        key={advantage}
                                        className="flex items-center gap-4 bg-card rounded-xl p-5 md:p-6 border border-border h-full shadow-sm"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                    >
                                        <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 bg-primary/10 text-primary">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <span className="text-foreground text-base md:text-lg font-medium leading-snug">{advantage}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section D: How It Works */}
            <section className="py-12 md:py-16 bg-muted/30">
                <div className="container-main">
                    <motion.div className="text-center mb-16" {...fadeInUp}>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                            {content.process.title}
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-transparent via-primary/20 to-transparent" />

                        {content.process.steps.map((step, index) => {
                            const Icon = processIcons[index % processIcons.length];
                            return (
                                <motion.div
                                    key={step.title}
                                    className="relative text-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                >
                                    <div className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-foreground mt-2 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section E: Conditions & MOQs */}
            <section className="py-12 md:py-16 bg-card">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div className="text-center" {...fadeInUp}>
                            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                                {content.terms.label}
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                                {content.terms.title}
                            </h2>

                            <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm mx-auto">
                                <div className="grid grid-cols-3 bg-primary text-white p-4 font-semibold text-sm">
                                    <span>Category</span>
                                    <span className="text-center">MOQ</span>
                                    <span className="text-right">Details</span>
                                </div>
                                {content.terms.conditions.map((condition, index) => (
                                    <div
                                        key={condition.category}
                                        className={`grid grid-cols-3 p-4 items-center ${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                                    >
                                        <span className="font-medium text-foreground text-sm">{condition.category}</span>
                                        <span className="text-center">
                                            <span className="text-xl font-serif font-bold text-primary">{condition.moq}</span>
                                            {condition.unit && <span className="text-muted-foreground text-xs ml-1">{condition.unit}</span>}
                                        </span>
                                        <span className="text-right text-xs text-muted-foreground">{condition.note}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Side Images */}
                        <motion.div
                            className="grid grid-cols-2 gap-5"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative h-56 col-span-2 rounded-2xl overflow-hidden shadow-lg">
                                <Image src={content.terms.sideImages[0]} alt="Terms" fill className="object-cover" />
                            </div>
                            <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg">
                                <Image src={content.terms.sideImages[1]} alt="Terms" fill className="object-cover" />
                            </div>
                            <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg">
                                <Image src={content.terms.sideImages[2]} alt="Terms" fill className="object-cover" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section F: Compliance Alert */}
            <section className="py-12 bg-background">
                <div className="container-main">
                    <motion.div
                        className="max-w-3xl mx-auto bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 md:p-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex gap-4">
                            <div className="shrink-0">
                                <AlertTriangle className="w-8 h-8 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                                    {content.compliance.title}
                                </h3>
                                <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                                    {content.compliance.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section G: Final CTA */}
            <section className="relative py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={content.hero.bgImage}
                        alt="Manufacturing"
                        fill
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-secondary/60 via-secondary/45 to-secondary/30" />
                </div>

                <div className="container-main relative z-10">
                    <motion.div className="text-center max-w-3xl mx-auto" {...fadeInUp}>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            {content.cta.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                            {content.cta.description}
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={`/${lang}/contact`}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-primary transition-all duration-300"
                            >
                                {content.cta.buttonText}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
