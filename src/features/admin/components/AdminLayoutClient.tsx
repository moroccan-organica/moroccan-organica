'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';
import { ProductsProvider } from '@/contexts/ProductsContext';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  lang?: string;
}

export function AdminLayoutClient({ children, lang = 'en' }: AdminLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProductsProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} lang={lang} />
        <main
          className={cn(
            'min-h-screen transition-all duration-300',
            collapsed ? 'ml-20' : 'ml-64'
          )}
        >
          {children}
        </main>
      </div>
    </ProductsProvider>
  );
}
