"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, HelpCircle, Package, Truck, MessageSquare, Award, Tag, DollarSign, Building2 } from "lucide-react";
import InnerHero from "@/components/common/InnerHero";
import CertificationSlider from "@/components/common/CertificationSlider";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
}

interface FaqClientProps {
  lang: string;
  dict: {
    title: string;
    description: string;
    keywords: string;
    hero: {
      kick: string;
      title: string;
      description: string;
    };
    intro: string;
    items: FAQItem[];
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
}

export default function FaqClient({ lang, dict }: FaqClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const isAr = lang === "ar";
  const isFr = lang === "fr";

  const homeLabel = isAr ? "الصفحة الرئيسية" : isFr ? "Accueil" : "Home";
  const faqLabel = isAr ? "الأسئلة الشائعة" : "FAQ";

  // Category labels based on language
  const categories = useMemo(() => {
    if (isAr) {
      return [
        { id: "all", label: "الكل", icon: HelpCircle },
        { id: "products", label: "المنتجات والشركة", icon: Building2 },
        { id: "orders", label: "الطلب والأسعار", icon: DollarSign },
        { id: "privatelabel", label: "العلامات التجارية الخاصة والتغليف", icon: Tag },
        { id: "shipping", label: "الشهادات والتصدير", icon: Award },
      ];
    } else if (isFr) {
      return [
        { id: "all", label: "Tous", icon: HelpCircle },
        { id: "products", label: "Produits & Entreprise", icon: Building2 },
        { id: "orders", label: "Commande & Prix", icon: DollarSign },
        { id: "privatelabel", label: "Marque Blanche & Emballage", icon: Tag },
        { id: "shipping", label: "Certifications & Export", icon: Award },
      ];
    } else {
      return [
        { id: "all", label: "All", icon: HelpCircle },
        { id: "products", label: "Products & Company", icon: Building2 },
        { id: "orders", label: "Ordering & Pricing", icon: DollarSign },
        { id: "privatelabel", label: "Private Label & Packaging", icon: Tag },
        { id: "shipping", label: "Certifications & Export", icon: Award },
      ];
    }
  }, [isAr, isFr]);

  // Mapping the new 12 questions to categories
  const getCategoryForItem = (index: number): string => {
    if ([0, 1, 2].includes(index)) return "products";
    if ([3, 4, 5, 6].includes(index)) return "orders";
    if ([7, 8].includes(index)) return "privatelabel";
    return "shipping";
  };

  const filteredItems = useMemo(() => {
    return dict.items
      .map((item, idx) => ({ ...item, originalIndex: idx }))
      .filter((item) => {
        const matchesCategory =
          activeCategory === "all" || getCategoryForItem(item.originalIndex) === activeCategory;
        const matchesSearch =
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [dict.items, activeCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data (JSON-LD)
  const faqSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": dict.items.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a,
        },
      })),
    };
  }, [dict.items]);

  const breadcrumbSchema = useMemo(() => {
    const canonicalBase = "https://www.moroccanorganica.com";
    const localizedPath = lang === "en" ? "" : `/${lang}`;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": homeLabel,
          "item": `${canonicalBase}${localizedPath || "/"}`,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": faqLabel,
          "item": `${canonicalBase}${localizedPath}/faq`,
        },
      ],
    };
  }, [lang, homeLabel, faqLabel]);

  return (
    <div className="min-h-screen bg-background">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <InnerHero
        title={dict.hero.title}
        description={dict.hero.description}
        backgroundImage="/images/slider/hero-authentic-argan-oil.webp"
        breadcrumbs={[
          { label: homeLabel, href: `/${lang}` },
          { label: faqLabel },
        ]}
      />

      <section className="py-16 md:py-24" dir={isAr ? "rtl" : "ltr"}>
        <div className="container-main max-w-4xl mx-auto px-4">
          
          {/* Intro Text */}
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl text-muted-foreground italic max-w-2xl mx-auto">
              {dict.intro}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-10 group">
            <div className={`absolute inset-y-0 ${isAr ? "left-4" : "right-4"} flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors`}>
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder={isAr ? "البحث عن سؤال..." : isFr ? "Rechercher une question..." : "Search for a question..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-card border border-border rounded-full py-3.5 ${isAr ? "pr-6 pl-12" : "pl-6 pr-12"} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-sm text-foreground transition-all duration-300`}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(null); // Reset open accordion on tab change
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm border ${
                    isActive
                      ? "bg-primary text-white border-primary scale-105"
                      : "bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isOpen = openIndex === item.originalIndex;
                  return (
                    <motion.div
                      key={item.originalIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleAccordion(item.originalIndex)}
                        className="w-full flex items-center justify-between p-6 md:p-7 text-left font-serif text-base md:text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer gap-4"
                        style={{ textAlign: isAr ? "right" : "left" }}
                      >
                        <span className={`${isAr ? "text-right" : "text-left"} leading-snug`}>{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 md:px-7 md:pb-7 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/40 pt-4 bg-muted/10">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-muted-foreground italic"
                >
                  {isAr
                    ? "لم يتم العثور على نتائج للبحث."
                    : isFr
                    ? "Aucune question trouvée pour votre recherche."
                    : "No questions found matching your search."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Call to Action Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-12 mt-16 text-center shadow-xl relative overflow-hidden border border-border/10"
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'url(/images/footer/footer-map-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                {dict.cta.title}
              </h3>
              <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed italic">
                {dict.cta.description}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="inline-block btn-accent hover:scale-105 transition-all text-white font-bold py-3.5 px-8 rounded-full shadow-lg text-sm uppercase tracking-wider"
              >
                {dict.cta.button} &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <CertificationSlider />
    </div>
  );
}
