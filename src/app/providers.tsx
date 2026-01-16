'use client'

import { SessionProvider } from 'next-auth/react'
import '../lib/i18n';
import i18n from '../lib/i18n';
import { useEffect } from 'react';
import { CartProvider } from '@/components/shop/CartContext';

export function Providers({ children, lang }: { children: React.ReactNode, lang?: string }) {
    useEffect(() => {
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang]);

    return (
        <SessionProvider>
            <CartProvider>{children}</CartProvider>
        </SessionProvider>
    );
}
