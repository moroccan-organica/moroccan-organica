"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const reviewImages = [
  "/images/reviews/moroccan organica review (1).webp",
  "/images/reviews/moroccan organica review (2).webp",
  "/images/reviews/moroccan organica review (3).webp",
  "/images/reviews/moroccan organica review (4).webp",
  "/images/reviews/moroccan organica review (5).webp",
  "/images/reviews/moroccan organica review (6).webp",
  "/images/reviews/moroccan organica review (7).webp",
  "/images/reviews/organica group review (1).webp",
  "/images/reviews/organica group review (2).webp",
  "/images/reviews/organica group review (3).webp",
];

interface SocialProofSectionProps {
  data?: {
    badge: string;
    title: string;
    highlight: string;
    rating: {
      label: string;
      score: string;
      source: string;
    };
  };
}

const SocialProofSection = ({ data }: SocialProofSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviewImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviewImages.length) % reviewImages.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  if (!data) return null;

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Decorative Leaves (Desktop only) */}
      <div className="absolute top-20 left-[3%] opacity-[0.03] pointer-events-none hidden lg:block rotate-[-15deg]">
        <svg width="200" height="200" viewBox="0 0 512 512" fill="currentColor" className="text-foreground">
          <path d="M413.97,183.25c-23.94-44.67-70.36-77.15-123.62-85.13c-53.26-7.98-106.26,9.86-145.11,47.34 c-38.85,37.48-58.05,91.04-51.07,144.3c6.98,53.26,39.46,99.68,84.13,123.62c44.67,23.94,96.8,21.92,139.5-5.3 c42.7-27.22,69.92-75.14,69.92-128.4C427.72,241.39,424.62,209.49,413.97,183.25z" />
        </svg>
      </div>

      <div className="container-main relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            {data.badge}
          </span>
          <h2 className="heading-section text-foreground mb-6">
            {data.title} <span className="text-primary italic font-serif">{data.highlight}</span>
          </h2>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="ml-3 font-bold text-lg text-foreground">{data.rating.label}</span>
              <span className="mx-2 text-border">|</span>
              <span className="text-muted-foreground font-medium">{data.rating.score}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 italic">{data.rating.source}</p>
          </div>
        </div>

        <div
          className="max-w-4xl mx-auto relative group px-6 sm:px-16"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Slider Container */}
          <div className="relative bg-card rounded-[2.5rem] shadow-card border border-border/50 p-4 sm:p-12 overflow-hidden">
            {/* Glossy Overlay effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="relative aspect-[3/1] sm:aspect-[4.5/1] w-full transform transition-all duration-700">
              <Image
                src={reviewImages[currentIndex]}
                alt={`Customer review snapshot ${currentIndex + 1}`}
                fill
                className="object-contain transition-all duration-700 brightness-[1.02]"
                priority
              />
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border border-border text-foreground flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 active:scale-90 z-20 md:-left-4"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border border-border text-foreground flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 active:scale-90 z-20 md:-right-4"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Premium Indicators */}
          <div className="flex justify-center gap-3 mt-12 mb-4">
            {reviewImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-500 rounded-full ${i === currentIndex
                  ? "w-10 h-2 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                  : "w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
