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
import { organizationSchema, localBusinessSchema, renderSchemas } from "@/lib/seo/schemas";

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
  const defaultDesc = globalSeo?.translation?.defaultMetaDesc || "Buy Moroccan Wholesale argan oil and organic cosmetics products company. Using traditional ingredients and natural products for beauty skincare haircare.";
  const keywords = globalSeo?.translation?.defaultKeywords || "Argan oil, Argan oil benefits for skin, prickly pear oil, argan oil for hair, argan oil for face, pure argan oil, argan oil for skin, argan oil price, 100%pure,  bulk, beauty products, argan oil of morocco, beauty products online, beauty, beauty brand, cosmetic";

  const baseUrl = 'https://www.moroccanorganica.com';
  const canonicalPath = lang === 'en' ? '' : `/${lang}`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteName,
      template: "%s",
    },
    description: defaultDesc,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': baseUrl,
        'fr': `${baseUrl}/fr`,
        'ar': `${baseUrl}/ar`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      type: 'website',
      siteName: siteName,
      title: siteName,
      description: defaultDesc,
      images: globalSeo?.ogImage ? [globalSeo.ogImage] : [],
      url: canonicalUrl,
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
  const dict = await getDictionary(lang, 'common') as any;
  const topProducts = await getTopSaleProducts(lang);

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cairo.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers lang={lang}>
          {/* Global Structured Data: WebSite + Organization + LocalBusiness */}
          <Script
            id="schema-org"
            strategy="afterInteractive"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: renderSchemas(
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "@id": "https://www.moroccanorganica.com/#website",
                  "name": "Moroccan Organica",
                  "alternateName": ["Organic Moroccan Beauty", "Argan Oil Wholesale Morocco"],
                  "url": `https://www.moroccanorganica.com/${lang === 'en' ? '' : lang}`,
                  "publisher": { "@id": "https://www.moroccanorganica.com/#organization" },
                  "inLanguage": lang === 'ar' ? 'ar' : (lang === 'fr' ? 'fr' : 'en'),
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": `https://www.moroccanorganica.com/${lang}/shop?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                  },
                  "hasPart": [
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Shop",
                      "url": `https://www.moroccanorganica.com/${lang}/shop`
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "About Us",
                      "url": `https://www.moroccanorganica.com/${lang}/organica/about-organica-group-sarl`
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Private Label",
                      "url": `https://www.moroccanorganica.com/${lang}/organica/argan-oil-private-label-manufacturer`
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "FAQ",
                      "url": `https://www.moroccanorganica.com/${lang}/faq`
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Contact",
                      "url": `https://www.moroccanorganica.com/${lang}/contact`
                    }
                  ]
                },
                organizationSchema(),
                localBusinessSchema()
              )
            }}
          />
          <LayoutContent dict={dict} lang={lang} topProducts={topProducts}>
            {children}
          </LayoutContent>
        </Providers>
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script id="google-analytics-inline" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
