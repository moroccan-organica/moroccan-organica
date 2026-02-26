import { getDictionary } from "@/lib/dictionaries";
import { getGlobalSeoSettings, getTopSaleProducts } from "@/lib/queries";
import { Metadata } from "next";
import InnerHero from "@/components/common/InnerHero";
import ProductsSection from "@/components/sections/ProductsSection";
import { homePageData } from "@/data/home";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const globalSeo = await getGlobalSeoSettings(lang);

    const title = lang === 'ar' ? "تجارة الجملة لمستحضرات التجميل المغربية" :
        lang === 'fr' ? "Vente en gros de cosmétiques marocains" :
            "Moroccan cosmetic wholesale";

    const description = lang === 'ar' ? "مستحضرات تجميل مغربية طبيعية مصنوعة من زيت الأركان والغاسول. تسوق منتجات العناية بالبشرة والشعر الفاخرة عبر الإنترنت." :
        lang === 'fr' ? "Cosmétiques de beauté marocains à base d'huile d'argan, de ghassoul et d'ingrédients naturels. Achetez en ligne des soins de la peau et des cheveux de qualité supérieure." :
            "Moroccan beauty cosmetics made with argan oil, ghassoul, and natural ingredients. Shop premium skincare & haircare online.";

    const keywords = "Argan oil, Argan oil benefits for skin, prickly pear oil, argan oil for hair, argan oil for face, pure argan oil, argan oil for skin, argan oil price, 100%pure, bulk, beauty products, argan oil of morocco, beauty products online, beauty, beauty brand, cosmetic";

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: globalSeo?.ogImage ? [globalSeo.ogImage] : [],
        },
    };
}

export default async function WholesaleSkincarePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'home');
    const topSaleProducts = await getTopSaleProducts(lang);

    const heroTitle = lang === 'ar' ? "تجارة الجملة لمستحضرات التجميل المغربية" :
        lang === 'fr' ? "Vente en gros de cosmétiques marocains" :
            "Moroccan cosmetic wholesale";

    const sectionTitle = lang === 'ar' ? "المنتجات الأكثر مبيعاً" :
        lang === 'fr' ? "Produits les plus vendus" :
            "TOP SELLING PRODUCTS";

    const productsData = {
        ...homePageData.productsSection,
        ...dict.productsSection,
        title: sectionTitle,
        highlight: "",
        description: "",
        items: topSaleProducts.length > 0 ? topSaleProducts : homePageData.productsSection.items.map((item, i) => ({
            ...item,
            ...dict.productsSection.items?.[i] || {}
        }))
    };

    return (
        <main className="min-h-screen bg-background">
            <InnerHero
                title={heroTitle}
                badge={lang === 'ar' ? "الأفضل" : lang === 'fr' ? "Meilleurs" : "Best Sale"}
                backgroundImage="/images/slider/slide_2.webp"
                breadcrumbs={[
                    { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: `/${lang}` },
                    { label: heroTitle, href: `/${lang}/wholesale-of-moroccan-skincare` }
                ]}
            />

            <ProductsSection data={productsData} />
        </main>
    );
}
