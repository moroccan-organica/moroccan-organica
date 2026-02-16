"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Globe, Truck, Shield, Leaf, Award } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import Image from "next/image";

// Helper to get icon component or default
const getIcon = (index: number) => {
    const icons = [Globe, Leaf, Award, Truck, Shield];
    return icons[index % icons.length];
}

interface HeroSlide {
    badge: string;
    heading: string;
    highlight: string;
    description: string;
    image: string;
}

interface HeroTrust {
    logistics: string;
    certified: string;
    moq: string;
}

interface HeroCta {
    quote: string;
    view: string;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
    trust: HeroTrust;
    cta: HeroCta;
    lang: string;
}

const HeroCarousel = ({ slides, trust, cta, lang }: HeroCarouselProps) => {
    const isRtl = lang === 'ar';
    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full h-full relative min-h-screen">
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{ loop: true, direction: isRtl ? 'rtl' : 'ltr' }}
            >
                <CarouselContent className="h-full">
                    {slides.map((slide, index) => {
                        const Icon = getIcon(index);
                        return (
                            <CarouselItem key={index} className="h-full">
                                <div className="relative min-h-screen flex items-center justify-center">
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={slide.image}
                                            alt={slide.heading}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-r from-secondary/70 via-secondary/50 to-secondary/35" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 container-main text-center py-20 md:py-32">
                                        <div className="max-w-4xl mx-auto animate-fade-in">
                                            {/* Badge */}
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
                                                <Icon className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium text-primary-foreground/90">
                                                    {slide.badge}
                                                </span>
                                            </div>

                                            {/* Main Heading */}
                                            {(() => {
                                                const headingText = slide.heading?.trim() || "";
                                                const highlightText = slide.highlight?.trim() || "";
                                                const hasHighlight = highlightText.length > 0;

                                                if (!hasHighlight) {
                                                    return (
                                                        <h1 className="heading-display text-primary-foreground mb-6 leading-tight">
                                                            {headingText}
                                                        </h1>
                                                    );
                                                }

                                                const lowerHeading = headingText.toLowerCase();
                                                const lowerHighlight = highlightText.toLowerCase();
                                                const matchIndex = lowerHeading.indexOf(lowerHighlight);

                                                if (matchIndex !== -1) {
                                                    const before = headingText.slice(0, matchIndex);
                                                    const match = headingText.slice(matchIndex, matchIndex + highlightText.length);
                                                    const after = headingText.slice(matchIndex + highlightText.length);
                                                    return (
                                                        <h1 className="heading-display text-primary-foreground mb-6 leading-tight">
                                                            {before}
                                                            <span className="text-primary">{match}</span>
                                                            {after}
                                                        </h1>
                                                    );
                                                }

                                                return (
                                                    <h1 className="heading-display text-primary-foreground mb-6 leading-tight">
                                                        {headingText} <span className="text-primary">{highlightText}</span>
                                                    </h1>
                                                );
                                            })()}

                                            {/* Subheading */}
                                            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                                                {slide.description}
                                            </p>

                                            {/* CTA Buttons */}
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                                                <Button asChild className="btn-accent text-lg px-8 py-6 font-semibold group">
                                                    <Link href={`/${lang}/contact`}>
                                                        {cta.quote}
                                                        {isRtl ? (
                                                            <ArrowLeft className="me-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                                        ) : (
                                                            <ArrowRight className="ms-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        )}
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="text-lg px-8 py-6 border-2 border-primary/50 text-primary-foreground bg-transparent hover:bg-primary/20 hover:border-primary"
                                                >
                                                    <Link href={`/${lang}/shop`}>
                                                        {cta.view}
                                                    </Link>
                                                </Button>
                                            </div>

                                            {/* Trust Indicators */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                                                    <Truck className="w-6 h-6 text-primary" />
                                                    <span className="text-primary-foreground/90 font-medium">
                                                        {trust.logistics}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                                                    <Shield className="w-6 h-6 text-primary" />
                                                    <span className="text-primary-foreground/90 font-medium">
                                                        {trust.certified}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
                                                    <Globe className="w-6 h-6 text-primary" />
                                                    <span className="text-primary-foreground/90 font-medium">
                                                        {trust.moq}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>

                {/* Navigation Arrows */}
                <CarouselPrevious className={`${isRtl ? 'right-4 md:right-8 left-auto' : 'left-4 md:left-8'} bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 h-12 w-12`} />
                <CarouselNext className={`${isRtl ? 'left-4 md:left-8 right-auto' : 'right-4 md:right-8'} bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 h-12 w-12`} />
            </Carousel>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1">
                    <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
