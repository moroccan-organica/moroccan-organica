'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  Menu,
  X,
  LogOut,
  Archive,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Image from 'next/image';

export type BlogViewType = 'dashboard' | 'posts' | 'media' | 'categories' | 'archives' | 'settings';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarItemExtendedProps extends SidebarItemProps {
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemExtendedProps> = ({
  icon: Icon,
  label,
  href,
  active = false,
  onClick,
  collapsed = false,
}) => {
  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300',
        active
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
        collapsed && 'justify-center px-0'
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-primary")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-bold border-none bg-secondary text-white rounded-lg px-3 py-1.5 text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

interface BlogLayoutProps {
  children: React.ReactNode;
  currentView: BlogViewType;
  translations: {
    sidebar: Record<string, string>;
    views: Record<string, { title: string; subtitle: string }>;
    logout: string;
  };
  blogger?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

const navItemsConfig: { labelKey: string; view: BlogViewType; icon: React.ElementType; href: string }[] = [
  { labelKey: 'dashboard', view: 'dashboard', icon: LayoutDashboard, href: '/blog/admin' },
  { labelKey: 'posts', view: 'posts', icon: FileText, href: '/blog/admin/posts' },
  { labelKey: 'media', view: 'media', icon: ImageIcon, href: '/blog/admin/media' },
  { labelKey: 'categories', view: 'categories', icon: FolderOpen, href: '/blog/admin/categories' },
  { labelKey: 'archives', view: 'archives', icon: Archive, href: '/blog/admin/archives' },
  { labelKey: 'settings', view: 'settings', icon: Settings, href: '/blog/admin/settings' },
];

export function BlogLayout({
  children,
  currentView,
  translations,
  blogger,
}: BlogLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      // Logic for mobile state if needed in future
    };
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    // Implement logout logic or redirect
    router.push('/login');
  };

  const title = translations.views[currentView]?.title || 'Blog Admin';
  const subtitle = translations.views[currentView]?.subtitle || 'Manage your content';

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-background overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 border-r border-slate-100 bg-white transition-all duration-500 ease-in-out flex flex-col',
          'z-50',
          isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full',
          'lg:h-screen lg:translate-x-0 lg:z-10 shadow-xl lg:shadow-none',
          isSidebarCollapsed ? 'lg:w-24' : 'lg:w-72'
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          'flex h-20 items-center justify-between border-b border-slate-50 shrink-0',
          isSidebarCollapsed ? 'lg:px-4' : 'px-8'
        )}>
          <Link
            href="/blog/admin"
            className="flex items-center gap-3 group transition-all duration-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 shrink-0 transition-transform group-hover:scale-110">
              <span className="text-lg font-playfair font-bold text-white">O</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-playfair font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">ORGANICA</span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-primary transition-all duration-300 hidden lg:block"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8">
          <nav className="flex flex-col gap-2">
            <TooltipProvider delayDuration={0}>
              {navItemsConfig.map((item) => (
                <SidebarItem
                  key={item.view}
                  icon={item.icon}
                  label={translations.sidebar[item.labelKey] || item.labelKey}
                  href={item.href}
                  active={currentView === item.view}
                  onClick={() => setIsMobileMenuOpen(false)}
                  collapsed={isSidebarCollapsed}
                />
              ))}
            </TooltipProvider>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <div className={cn(
            "flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100 transition-all duration-300",
            isSidebarCollapsed && "justify-center px-2"
          )}>
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-background shrink-0 border-2 border-white shadow-sm relative">
              {blogger?.avatar_url ? (
                <Image
                  src={blogger.avatar_url}
                  alt={blogger.name || 'Admin'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                  {blogger?.name?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 leading-tight">
                  {blogger?.name || 'Admin'}
                </p>
                <p className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  {blogger?.email || 'admin@organica.com'}
                </p>
              </div>
            )}
            {!isSidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                title={translations.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-x-hidden transition-all duration-500 ease-in-out relative z-0',
          isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-72'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 shadow-sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-playfair font-bold text-primary lg:text-2xl truncate">{title}</h1>
              <p className="hidden text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] lg:block mt-0.5">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Additional Header Actions (Language, etc) could go here */}
            <div className="h-10 w-px bg-slate-100 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-accent font-bold hover:bg-accent/5 gap-2"
              asChild
            >
              <Link href="/blog" target="_blank">
                <span className="hidden sm:inline">View Blog</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default BlogLayout;
