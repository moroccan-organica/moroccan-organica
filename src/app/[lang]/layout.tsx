import "../globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo } from "next/font/google";
import { Providers } from "@/app/providers";
import { getDictionary } from '@/lib/dictionaries';
import { LayoutContent } from "@/components/shared/LayoutContent";
import { getGlobalSeoSettings } from "@/features/seo/actions";
import { getProducts } from "@/features/shop/actions";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const globalSeo = await getGlobalSeoSettings(lang);

  const siteName = globalSeo?.translation?.siteName || "Moroccan Organica";
  const titleSuffix = globalSeo?.translation?.titleSuffix || " | Premium Organic Products from Morocco";
  const defaultDesc = globalSeo?.translation?.defaultMetaDesc || "Discover authentic Moroccan organic products. Shop natural argan oil, rose water, and traditional beauty products.";
  const keywords = globalSeo?.translation?.defaultKeywords || "argan oil, morocco, organic, beauty, wholesale";

  return {
    title: {
      default: siteName,
      template: `%s${titleSuffix}`,
    },
    description: defaultDesc,
    keywords: keywords,
    openGraph: {
      type: 'website',
      siteName: siteName,
      title: siteName,
      description: defaultDesc,
      images: globalSeo?.ogImage ? [globalSeo.ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: globalSeo?.twitterHandle || undefined,
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon.png', type: 'image/png' },
      ],
      apple: '/favicon.png',
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }, { lang: 'fr' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang, 'common');
  const productsResult = await getProducts({ isTopSale: true, limit: 6 });
  const topProducts = productsResult.products.map(p => ({
    title: p.name,
    slug: p.slug
  }));

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cairo.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers lang={lang}>
          <LayoutContent dict={dict} lang={lang} topProducts={topProducts}>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
