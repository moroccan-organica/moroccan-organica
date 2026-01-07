"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import machineProcessing from "@/assets/machine-processing.jpg";
import indigoBulk from "@/assets/indigo-bulk.jpg";

const reviews = [
  {
    text: "Exceptional quality Argan oil. The consistency of supply and certification documentation made our procurement process seamless.",
    author: "Sarah M.",
    company: "NaturaCare UK",
  },
  {
    text: "We've been sourcing saffron from them for 3 years. Best price-to-quality ratio in the market, with reliable shipping.",
    author: "Marco L.",
    company: "Gourmet Italia",
  },
  {
    text: "Their Ghassoul clay meets all EU cosmetic regulations. Fast response times and excellent customer service.",
    author: "Dr. Anna K.",
    company: "BioCosmetics GmbH",
  },
  {
    text: "Professional team, organic certifications in order, and they handle all export documentation. Highly recommended.",
    author: "James T.",
    company: "Pure Beauty Co.",
  },
];

const SocialProofSection = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-main">
        {/* Trustpilot-style Widget */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-background border-2 border-primary rounded-xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-foreground">Excellent</span>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-primary flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Based on <span className="font-semibold text-foreground">247 reviews</span>
              </p>
            </div>

            {/* Review Carousel */}
            <div className="relative">
              <div className="min-h-[120px] flex items-center">
                <button
                  onClick={prevReview}
                  className="absolute left-0 z-10 p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>

                <div className="px-12 text-center">
                  <p className="text-foreground italic mb-4">
                    "{reviews[currentReview].text}"
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {reviews[currentReview].author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reviews[currentReview].company}
                  </p>
                </div>

                <button
                  onClick={nextReview}
                  className="absolute right-0 z-10 p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentReview ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturing Images */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-card group">
            <Image
              src={machineProcessing}
              alt="Machine processing raw materials"
              className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-serif text-xl font-semibold text-primary-foreground mb-1">
                Precision Processing
              </h3>
              <p className="text-sm text-primary-foreground/80">
                State-of-the-art extraction and refinement
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-card group">
            <Image
              src={indigoBulk}
              alt="Blue indigo powder in bulk bins"
              className="w-full h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-serif text-xl font-semibold text-primary-foreground mb-1">
                Bulk Production
              </h3>
              <p className="text-sm text-primary-foreground/80">
                Quality-controlled storage and packaging
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
