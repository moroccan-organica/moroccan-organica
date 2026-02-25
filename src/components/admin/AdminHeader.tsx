'use client';

import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Admin';
  const userEmail = session?.user?.email || 'admin@organica.ma';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
          <div className="h-9 w-9 rounded-full bg-linear-to-br from-[#606C38] to-[#BC6C25] flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
