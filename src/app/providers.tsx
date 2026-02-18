'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import '../lib/i18n';
import i18n from '../lib/i18n';
import { useEffect } from 'react';
import { CartProvider } from '@/components/shop/CartContext';

export function Providers({ children, lang }: { children: React.ReactNode, lang?: string }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));

    useEffect(() => {
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang]);

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider basePath="/api/auth">
                <CartProvider>{children}</CartProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
