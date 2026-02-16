import Hero from "@/features/home/components/Hero";
import TrustedSupplierSection from "@/features/home/components/TrustedSupplierSection";
import ProductsSection from "@/features/home/components/ProductsSection";
import PrivateLabelSection from "@/features/home/components/PrivateLabelSection";
import PressFeatureSection from "@/features/home/components/PressFeatureSection";
import SocialProofSection from "@/features/home/components/SocialProofSection";
import TrustSection from "@/features/home/components/TrustSection";
import InstagramSection from "@/features/home/components/InstagramSection";
import RFQSection from "@/features/home/components/RFQSection";
import { homePageData } from "@/data/home";
import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { getStaticPageBySystemName } from "@/features/static-pages/actions";
import { getGlobalSeoSettings } from "@/features/seo/actions";
import { getProducts } from "@/features/shop/actions";

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
    },
    alternates: {
      canonical: page?.translation?.canonical || undefined,
    }
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // Parallel Fetching
  const [dict, page, featuredResult, topSaleResult] = await Promise.all([
    getDictionary(lang, 'home'),
    getStaticPageBySystemName('HOME', lang),
    getProducts({ isFeatured: true, limit: 10 }),
    getProducts({ isTopSale: true, limit: 6 })
  ]);

  const featuredProducts = featuredResult.products.map(p => ({
    image: p.image,
    title: p.name,
    subtitle: p.category
  }));

  const topSaleProducts = topSaleResult.products.map(p => ({
    id: p.id,
    title: p.name,
    desc: p.description,
    description: p.description,
    badge: "Top Seller",
    image: p.image,
    price: p.price,
    volume: p.volume,
    name: p.name,
    slug: p.slug
  }));

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

  const aboutData = { ...homePageData.about, ...dict.about };

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
    </main>
  );
}
