'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ChevronRight, Search, Sun, Moon, Compass, Shield } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme, setTourOpen, setCommandPaletteOpen } = useApp();

  // Compute breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  
  let section = 'Practice';
  if (['reports', 'claims', 'queues', 'prior-auth', 'remits', 'collections'].includes(segments[0])) {
    section = 'Billing';
  } else if (['developers', 'settings', 'tickets'].includes(segments[0])) {
    section = 'System';
  }

  const pageTitle = segments.length === 0
    ? 'Overview'
    : segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace('-', ' ');

  return (
    <header className="h-14 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="font-medium text-neutral-400 dark:text-neutral-500">{section}</span>
        <ChevronRight className="size-3.5 text-neutral-300 dark:text-neutral-600" />
        <Link
          href={`/${segments[0] || ''}`}
          className={`font-semibold transition-colors ${
            segments.length <= 1
              ? 'text-neutral-900 dark:text-neutral-100'
              : 'hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          {pageTitle}
        </Link>
        {segments.length > 1 && (
          <>
            <ChevronRight className="size-3.5 text-neutral-300 dark:text-neutral-600" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[150px] sm:max-w-[240px]">
              {segments[1]}
            </span>
          </>
        )}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 rounded-md border border-neutral-200 dark:border-neutral-700 transition-colors"
        >
          <Search className="size-3.5" />
          <span>Quick search</span>
          <kbd className="px-1 text-[10px] bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setTourOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-md border border-emerald-200 dark:border-emerald-800 transition-colors font-medium"
        >
          <Compass className="size-3.5" />
          <span className="hidden sm:inline">Tour</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
        >
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
      </div>
    </header>
  );
}
