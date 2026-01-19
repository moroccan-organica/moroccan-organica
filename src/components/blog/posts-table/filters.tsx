'use client';

import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}

export function FilterCheckbox({ label, checked, onChange, count }: FilterCheckboxProps) {
  return (
    <label
      className="flex items-center justify-between py-2 cursor-pointer group select-none"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-4 w-4 rounded border flex items-center justify-center transition-all duration-200',
            checked
              ? 'bg-[#606C38] border-[#606C38]'
              : 'bg-white border-slate-300 group-hover:border-[#606C38]'
          )}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
        <span
          className={cn(
            'text-sm transition-colors',
            checked ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'
          )}
        >
          {label}
        </span>
      </div>
      {count !== undefined && <span className="text-[10px] font-bold text-slate-400 font-mono">{count}</span>}
    </label>
  );
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  activeCount?: number;
}

export function FilterSection({ title, isOpen, onToggle, children, activeCount }: FilterSectionProps) {
  return (
    <div className="border-b border-slate-100 last:border-0 py-2">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left text-sm font-bold text-slate-900 hover:text-[#606C38] transition-colors group"
      >
        <div className="flex items-center gap-2">
          {title}
          {activeCount ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#606C38]/10 text-[10px] font-bold text-[#606C38]">
              {activeCount}
            </span>
          ) : null}
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-[#606C38]" /> : <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-[#606C38]" />}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-64 opacity-100 mb-2' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pt-1 pl-1">{children}</div>
      </div>
    </div>
  );
}
