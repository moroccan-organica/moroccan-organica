import "../globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo } from "next/font/google";
import { Providers } from "@/app/providers";
import { getDictionary } from '@/lib/dictionaries';
import { LayoutContent } from "@/components/common/LayoutContent";

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

export const metadata: Metadata = {
  title: "Moroccan Organica - Premium Organic Products from Morocco",
  description: "Discover authentic Moroccan organic products. Shop natural argan oil, rose water, and traditional beauty products.",
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
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

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cairo.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers lang={lang}>
          <LayoutContent dict={dict} lang={lang}>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
