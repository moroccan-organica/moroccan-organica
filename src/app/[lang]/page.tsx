import Hero from "@/components/sections/Hero";
import TrustedSupplierSection from "@/components/sections/TrustedSupplierSection";
import ProductsSection from "@/components/sections/ProductsSection";
import PrivateLabelSection from "@/components/sections/PrivateLabelSection";
import PressFeatureSection from "@/components/sections/PressFeatureSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import TrustSection from "@/components/sections/TrustSection";
import InstagramSection from "@/components/sections/InstagramSection";
import RFQSection from "@/components/sections/RFQSection";
import { homePageData } from "@/data/home";
import { seoData } from "@/data/seo";
import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: seoData.openGraph,
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, 'home');

  // Merge localized content into data structures
  const heroData = {
    ...homePageData.hero,
    ...dict.hero,
    slides: homePageData.hero.slides.map((slide, i) => ({
      ...slide,
      ...dict.hero.slides[i]
    }))
  };
  const aboutData = { ...homePageData.about, ...dict.about };
  const categoriesData = {
    ...homePageData.categories,
    ...dict.categories,
    items: homePageData.categories.items.map((item, i) => ({
      ...item,
      ...dict.categories.items[i]
    }))
  };
  const productsData = {
    ...homePageData.productsSection,
    ...dict.productsSection,
    items: homePageData.productsSection.items.map((item, i) => ({
      ...item,
      ...dict.productsSection.items[i]
    }))
  };
  const trustData = {
    ...homePageData.trustSection,
    ...dict.trustSection,
    warehouse: { ...homePageData.trustSection.warehouse, ...dict.trustSection?.warehouse },
    bulk: { ...homePageData.trustSection.bulk, ...dict.trustSection?.bulk },
    stats: homePageData.trustSection.stats.map((stat, i) => ({
      ...stat,
      ...dict.trustSection?.stats?.[i]
    }))
  };
  const rfqData = {
    ...homePageData.rfq,
    ...dict.rfq,
    features: homePageData.rfq.features.map((feature, i) => ({
      ...feature,
      ...dict.rfq?.features?.[i]
    }))
  };
  const socialProofData = dict.socialProof;

  return (
    <main className="min-h-screen">
      <Hero data={heroData} lang={lang} />
      <PrivateLabelSection />
      <TrustedSupplierSection data={categoriesData} />
      <ProductsSection data={productsData} />
      <PressFeatureSection />
      <SocialProofSection data={socialProofData} />
      <TrustSection data={trustData} />
      <InstagramSection />
      <RFQSection data={rfqData} aboutData={aboutData} />
    </main>
  );
}
