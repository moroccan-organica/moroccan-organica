import "../globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo } from "next/font/google";
import { Providers } from "@/app/providers";
import { getDictionary } from '@/lib/dictionaries';
import { LayoutContent } from "@/components/common/LayoutContent";
import { getTopSaleProducts, getGlobalSeoSettings } from "@/lib/queries";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

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

  const siteName = globalSeo?.translation?.siteName || "Argan oil wholesale company - in Bulk - Morocco";
  const titleSuffix = globalSeo?.translation?.titleSuffix || " | Organica Group";
  const defaultDesc = globalSeo?.translation?.defaultMetaDesc || "Buy Moroccan Wholesale argan oil and organic cosmetics products company. Using traditional ingredients and natural products for beauty skincare haircare.";
  const keywords = globalSeo?.translation?.defaultKeywords || "Argan oil, Argan oil benefits for skin, prickly pear oil, argan oil for hair, argan oil for face, pure argan oil, argan oil for skin, argan oil price, 100%pure,  bulk, beauty products, argan oil of morocco, beauty products online, beauty, beauty brand, cosmetic";

  return {
    metadataBase: new URL('https://www.moroccanorganica.com'),
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
      url: `https://www.moroccanorganica.com/${lang}`,
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
    authors: [{ name: "Organica group" }],
    robots: "index, follow",
    other: {
      "revisit-after": "1 days",
      "X-UA-Compatible": "IE=edge",
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
  const topProducts = await getTopSaleProducts(lang);

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
        <Analytics />
        <SpeedInsights />
        {/* <Script
          id="google-analytics"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-9GZDT6JY9C`}
        />
        <Script id="google-analytics-inline" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9GZDT6JY9C');
          `}
        </Script> */}
      </body>
    </html>
  );
}
