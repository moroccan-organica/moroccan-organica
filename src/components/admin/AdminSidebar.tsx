'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  Search,
  BookOpen,
  Users,
  Flame,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  {
    label: 'Products',
    path: '/admin/products',
    icon: Package,
    children: [
      { label: 'Shop Products', path: '/admin/products', icon: Package },
      { label: 'Top Sale', path: '/admin/products/topsale', icon: Flame },
      { label: 'Featured', path: '/admin/products/featured', icon: Star },
      { label: 'Add Product', path: '/admin/products?add=true', icon: Plus },
      { label: 'Categories', path: '/admin/categories', icon: Tags },
    ],
  },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'CRM Customers', path: '/admin/customers', icon: Users },
  { label: 'Blog', path: '/admin/blog', icon: FileText },
  { label: 'SEO Settings', path: '/admin/seo', icon: Search },
  { label: 'Static Pages', path: '/admin/static-pages', icon: BookOpen },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  lang?: string;
}

export function AdminSidebar({ collapsed = false, onToggle, lang = 'en' }: AdminSidebarProps) {
  const pathname = usePathname();

  const getHref = (path: string) => `/${lang}${path}`;

  const isActive = (path: string) => {
    const href = getHref(path);
    if (path === '/admin') {
      return pathname === href || pathname === `/${lang}/admin`;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-secondary text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex h-16 items-center border-b border-border/10 px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-auto overflow-hidden flex items-center justify-start relative">
              <img src="/images/logo.png" alt="Logo" className="h-full w-auto object-contain" />
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-9 w-9 overflow-hidden flex items-center justify-center">
            <img src="/images/logo.png" alt="Logo" className="h-full w-auto object-contain" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const childActive = item.children?.some((child) => isActive(child.path));
          const showChildren = !collapsed && (active || childActive);

          return (
            <div key={item.path} className="space-y-2">
              <Link
                href={getHref(item.path)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  active || childActive
                    ? 'bg-linear-to-r from-primary to-primary/80 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  collapsed && 'justify-center px-3'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('h-5 w-5 shrink-0', (active || childActive) && 'text-white')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>

              {showChildren && item.children && (
                <div className="ml-8 space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childIsActive = isActive(child.path);
                    return (
                      <Link
                        key={child.path}
                        href={getHref(child.path)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                          childIsActive
                            ? 'bg-white/10 text-white'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <ChildIcon className={cn('h-4 w-4 shrink-0', childIsActive && 'text-white')} />
                        <span>{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/10 p-4">
        <button
          onClick={() => signOut({ callbackUrl: `/${lang}/login` })}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer',
            collapsed && 'justify-center px-3'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
