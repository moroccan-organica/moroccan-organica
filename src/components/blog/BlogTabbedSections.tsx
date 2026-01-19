"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  recentPosts: React.ReactNode;
  quickActions: React.ReactNode;
  translations: {
    sectionsLabel: string;
    recentPosts: string;
    recentPostsShort: string;
    quickActions: string;
    quickActionsShort: string;
  };
}

export function BlogTabbedSections({ recentPosts, quickActions, translations }: Props) {
  const [tab, setTab] = useState<"recentPosts" | "quickActions">("recentPosts");
  const tablistRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tabs = ["recentPosts", "quickActions"] as const;
      const currentIndex = tabs.indexOf(tab);
      
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        setTab(tabs[nextIndex]);
        const nextButton = tablistRef.current?.querySelector(`#${tabs[nextIndex]}-tab`) as HTMLButtonElement;
        nextButton?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setTab(tabs[prevIndex]);
        const prevButton = tablistRef.current?.querySelector(`#${tabs[prevIndex]}-tab`) as HTMLButtonElement;
        prevButton?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setTab(tabs[0]);
        const firstButton = tablistRef.current?.querySelector(`#${tabs[0]}-tab`) as HTMLButtonElement;
        firstButton?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        setTab(tabs[tabs.length - 1]);
        const lastButton = tablistRef.current?.querySelector(`#${tabs[tabs.length - 1]}-tab`) as HTMLButtonElement;
        lastButton?.focus();
      }
    };
    
    const tablist = tablistRef.current;
    tablist?.addEventListener('keydown', handleKeyDown);
    return () => tablist?.removeEventListener('keydown', handleKeyDown);
  }, [tab]);

  return (
    <div className="mt-8">
      {/* Tabs bar */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={translations.sectionsLabel}
        className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 text-sm"
      >
        <button
          id="recentPosts-tab"
          role="tab"
          aria-selected={tab === "recentPosts"}
          aria-controls="recentPosts-panel"
          tabIndex={tab === "recentPosts" ? 0 : -1}
          className={cn(
            "rounded-xl py-3 px-4 transition-all duration-300 ease-in-out cursor-pointer text-slate-400 font-bold uppercase tracking-wider text-[10px]",
            tab === "recentPosts" &&
              "bg-[#606C38] text-white shadow-lg shadow-[#606C38]/20"
          )}
          onClick={() => setTab("recentPosts")}
        >
          <span className="hidden sm:block truncate">{translations.recentPosts}</span>
          <span className="block sm:hidden truncate">{translations.recentPostsShort}</span>
        </button>
        <button
          id="quickActions-tab"
          role="tab"
          aria-selected={tab === "quickActions"}
          aria-controls="quickActions-panel"
          tabIndex={tab === "quickActions" ? 0 : -1}
          className={cn(
            "rounded-xl py-3 px-4 transition-all duration-300 ease-in-out cursor-pointer text-slate-400 font-bold uppercase tracking-wider text-[10px]",
            tab === "quickActions" &&
              "bg-[#606C38] text-white shadow-lg shadow-[#606C38]/20"
          )}
          onClick={() => setTab("quickActions")}
        >
          <span className="hidden sm:block truncate">{translations.quickActions}</span>
          <span className="block sm:hidden truncate">{translations.quickActionsShort}</span>
        </button>
      </div>

      {/* Panels */}
      <div className="mt-8">
        <div
          id="recentPosts-panel"
          role="tabpanel"
          aria-labelledby="recentPosts-tab"
          hidden={tab !== "recentPosts"}
          tabIndex={0}
          className="outline-none"
        >
          {recentPosts}
        </div>
        <div
          id="quickActions-panel"
          role="tabpanel"
          aria-labelledby="quickActions-tab"
          hidden={tab !== "quickActions"}
          tabIndex={0}
          className="outline-none"
        >
          {quickActions}
        </div>
      </div>
    </div>
  );
}
