'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, PanelLeft } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  // Compute breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  
  let section = 'Practice';
  if (['reports', 'claims', 'queues', 'prior-auth', 'remits', 'collections'].includes(segments[0])) {
    section = 'Billing';
  } else if (['developers', 'settings', 'tickets'].includes(segments[0])) {
    section = 'Practice';
  }

  const pageTitle = segments.length === 0
    ? 'Overview'
    : segments[0] === 'appointments'
      ? 'Front Desk'
      : segments[0] === 'collections'
        ? 'Patient Balances'
        : segments[0] === 'prior-auth'
          ? 'Prior Auth'
          : segments[0] === 'settings'
            ? 'Settings & configuration'
            : segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace('-', ' ');

  return (
    <header className="flex min-h-14 sm:min-h-16 shrink-0 flex-wrap items-center justify-between gap-y-2 px-4 md:px-6 py-2 md:py-0 border-b border-border/70 bg-background/50 backdrop-blur-xs select-none">
      {/* Left: Sidebar Toggle + Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <PanelLeft className="size-4" />
        </button>

        <div className="h-4 w-px bg-border/70 mx-1" />

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium">{section}</span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <Link
            href={`/${segments[0] || ''}`}
            className={`font-semibold transition-colors ${
              segments.length <= 1
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {pageTitle}
          </Link>
          {segments.length > 1 && (
            <>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[240px]">
                {segments[1]}
              </span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
