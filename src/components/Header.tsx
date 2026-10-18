'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, PanelLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const TITLES: Record<string, string> = {
  '': 'Overview',
  appointments: 'Front Desk',
  rounds: 'Rounds',
  eligibility: 'Eligibility',
  reports: 'Reports',
  claims: 'Claims',
  queues: 'Queues',
  'prior-auth': 'Prior Auth',
  remits: 'Remits',
  collections: 'Patient balances',
  developers: 'Developers',
  help: 'Help center',
  tickets: 'Tickets',
  settings: 'Settings & configuration',
};

export default function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useApp();

  // Compute breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  
  let section = 'Practice';
  if (['reports', 'claims', 'queues', 'prior-auth', 'remits', 'collections'].includes(segments[0])) {
    section = 'Billing';
  } else if (['developers', 'settings', 'tickets'].includes(segments[0])) {
    section = 'Practice';
  }

  const pageTitle = TITLES[segments[0] || ''] || 'Overview';

  useEffect(() => {
    const title = segments.length > 1 && segments[0] === 'claims' ? 'Claim' : pageTitle;
    document.title = `${title} · Alder`;
  }, [pageTitle, segments]);

  return (
    <header className="flex min-h-14 sm:min-h-16 shrink-0 flex-wrap items-center justify-between gap-y-2 px-4 md:px-6 py-2 md:py-0 border-b border-border/70 bg-background/50 backdrop-blur-xs select-none">
      {/* Left: Sidebar Toggle + Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
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
