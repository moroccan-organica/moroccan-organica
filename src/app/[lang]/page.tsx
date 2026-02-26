import Hero from "@/components/sections/Hero";
import TrustedSupplierSection from "@/components/sections/TrustedSupplierSection";
import ProductsSection from "@/components/sections/ProductsSection";
import PrivateLabelSection from "@/components/sections/PrivateLabelSection";
import PressFeatureSection from "@/components/sections/PressFeatureSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import TrustSection from "@/components/sections/TrustSection";
import ProfessionalCTASection from "@/components/sections/ProfessionalCTASection";
import VisionSection from "@/components/sections/VisionSection";
import InstagramSection from "@/components/sections/InstagramSection";
import RFQSection from "@/components/sections/RFQSection";
import { homePageData } from "@/data/home";
import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName, getGlobalSeoSettings, getFeaturedProducts, getTopSaleProducts } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getStaticPageBySystemName('HOME', lang);
  const globalSeo = await getGlobalSeoSettings(lang);

  const title = page?.translation?.metaTitle || page?.translation?.h1 || globalSeo?.translation?.siteName || "Moroccan Organica";
  const description = page?.translation?.metaDesc || globalSeo?.translation?.defaultMetaDesc || "";
  const keywords = page?.translation?.keywords || globalSeo?.translation?.defaultKeywords || "";

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      images: page?.translation?.ogImage ? [page.translation.ogImage] : (globalSeo?.ogImage ? [globalSeo.ogImage] : []),
      type: 'website',
      url: `https://www.moroccanorganica.com/${lang}`,
    },
    alternates: {
      canonical: page?.translation?.canonical || `https://www.moroccanorganica.com/${lang}`,
    }
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, 'home');
  const page = await getStaticPageBySystemName('HOME', lang);
  const featuredProducts = await getFeaturedProducts(lang);
  const topSaleProducts = await getTopSaleProducts(lang);

  // Merge localized content into data structures
  const heroData = {
    ...homePageData.hero,
    ...dict.hero,
    slides: homePageData.hero.slides.map((slide, i) => {
      if (i === 0 && page?.translation) {
        return {
          ...slide,
          ...dict.hero.slides[i],
          heading: page.translation.h1 || slide.heading,
          description: page.translation.description || slide.description
        };
      }
      return {
        ...slide,
        ...dict.hero.slides[i]
      };
    })
  };

  const categoriesData = {
    ...homePageData.categories,
    ...dict.categories,
    items: featuredProducts.length > 0 ? featuredProducts : homePageData.categories.items.map((item, i) => ({
      ...item,
      ...dict.categories.items[i]
    }))
  };

  const productsData = {
    ...homePageData.productsSection,
    ...dict.productsSection,
    items: topSaleProducts.length > 0 ? topSaleProducts : homePageData.productsSection.items.map((item, i) => ({
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
  const pressFeatureData = dict.pressFeature;
  const privateLabelData = dict.privateLabel;
  const professionalCtaData = { ...homePageData.professionalCta, ...dict.professionalCta };
  const visionData = { ...homePageData.vision, ...dict.vision };

  return (
    <main className="min-h-screen">
      <Hero data={heroData} lang={lang} />

      <PrivateLabelSection data={privateLabelData} />
      <TrustedSupplierSection data={categoriesData} />
      <ProductsSection data={productsData} />
      <PressFeatureSection data={pressFeatureData} />
      <SocialProofSection data={socialProofData} />
      <TrustSection data={trustData} />
      <InstagramSection data={dict.instagram} />
      <RFQSection data={rfqData} aboutData={dict.about} />
      <ProfessionalCTASection data={professionalCtaData} />
      <VisionSection data={visionData} />
    </main>
  );
}
