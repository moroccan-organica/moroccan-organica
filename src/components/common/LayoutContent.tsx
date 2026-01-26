'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

interface LayoutContentProps {
  children: React.ReactNode;
  dict: Record<string, unknown>;
  lang: string;
  topProducts?: { title: string; slug: string }[];
}

export function LayoutContent({ children, dict, lang, topProducts = [] }: LayoutContentProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin') || pathname?.includes('/login');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header dict={dict} lang={lang} topProducts={topProducts} />
      {children}
      <Footer dict={dict} />
      <WhatsAppButton />
    </>
  );
}
