import { getDictionary } from '@/lib/dictionaries'
import Hero from "@/components/shop/Hero";
import AboutSection from "@/components/shop/AboutSection";
import ProductCategoryCarousel from "@/components/shop/ProductCategoryCarousel";
import ProductsSection from "@/components/shop/ProductsSection";
import PressFeatureSection from "@/components/shop/PressFeatureSection";
import SocialProofSection from "@/components/shop/SocialProofSection";
import TrustSection from "@/components/shop/TrustSection";
import InstagramSection from "@/components/shop/InstagramSection";
import RFQSection from "@/components/shop/RFQSection";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen">
      <Hero dict={dict} lang={lang} />
      <AboutSection dict={dict} />
      <ProductCategoryCarousel dict={dict} />
      <ProductsSection dict={dict} />
      <PressFeatureSection />
      <SocialProofSection />
      <TrustSection dict={dict} />
      <InstagramSection />
      <RFQSection />
    </main>
  );
}
