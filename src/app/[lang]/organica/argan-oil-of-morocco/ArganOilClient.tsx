"use client";

import { motion, MotionProps } from "framer-motion";
import Image from "next/image";
import { arganOilPageData } from "@/data/argan-oil";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";

interface ArganOilClientProps {
    lang: string;
    pageData?: {
        translation?: {
            h1?: string;
            description?: string;
        };
    } | null;
}

const fadeInUp: MotionProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: "easeOut" },
};

export default function ArganOilClient({ lang, pageData }: ArganOilClientProps) {
    const data = arganOilPageData;
    const heroTitle = pageData?.translation?.h1 || data.hero.title;

    return (
        <div className="min-h-screen bg-background">

            {/* Hero */}
            <InnerHero
                title={heroTitle}
                description={data.hero.description}
                backgroundImage={data.hero.bgImage}
                titleTag="h2"
                breadcrumbs={[
                    { label: "Home", href: `/${lang}` },
                    { label: "Organica", href: `/${lang}/organica` },
                    { label: "Argan Oil of Morocco" },
                ]}
            />

            {/* ── Intro: image + bars  |  heading + text ── */}
            <section className="py-14 md:py-20 bg-white">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                        {/* Left: image + progress bars */}
                        <motion.div className="space-y-6" {...fadeInUp}>
                            <div className="relative overflow-hidden rounded-2xl shadow-xl">
                                <Image
                                    src={data.intro.image}
                                    alt="argan in bulk"
                                    width={600}
                                    height={440}
                                    className="w-full h-[340px] md:h-[420px] object-cover"
                                    priority
                                />
                            </div>

                            {/* Coloured progress bars (UX/UI refined: compact & premium) */}
                            <div className="space-y-3">
                                {data.stats.map((stat, idx) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.12, duration: 0.45 }}
                                    >
                                        <div
                                            className="relative w-full rounded-lg bg-[#f0f0f0] overflow-hidden shadow-sm"
                                            style={{ height: "36px" }}
                                        >
                                            <motion.div
                                                className={`absolute inset-y-0 left-0 ${stat.color}`}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${stat.value}%` }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.12 + 0.25, duration: 0.9, ease: "easeOut" }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-between px-4">
                                                <span className="text-white text-xs md:text-[13px] font-bold uppercase tracking-wider">
                                                    {stat.label}
                                                </span>
                                                <span className="text-white text-xs md:text-[13px] font-bold">
                                                    {stat.value}%
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: h1 + body + differentiator */}
                        <motion.div className="space-y-6" {...fadeInUp}>
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                                {data.intro.heading}
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {data.intro.body}
                            </p>
                            <h3 className="font-serif text-xl font-bold text-foreground">
                                {data.intro.differentiatorHeading}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {data.intro.differentiatorBody}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Order Processing & Shipment ── */}
            <section className="py-14 md:py-20 bg-muted/30">
                <div className="container-main">
                    <motion.div className="text-center mb-10" {...fadeInUp}>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
                            {data.shipping.heading}
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* Left: FAQ blocks */}
                        <motion.div className="space-y-5" {...fadeInUp}>
                            {data.shipping.leftCol.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                                >
                                    <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                                    <p className="text-muted-foreground leading-relaxed text-sm">{faq.a}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Right: paragraphs */}
                        <motion.div
                            className="space-y-5"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {data.shipping.rightCol.map((para, idx) => (
                                <div
                                    key={idx}
                                    className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                                >
                                    <p className="text-foreground leading-relaxed text-sm">{para}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <CertificationSlider />
        </div>
    );
}
