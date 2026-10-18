'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appPath } from '@/lib/path';
import {
  Gauge,
  FileText,
  UserRound,
  Layers,
  MoreHorizontal,
  Stethoscope,
  ShieldCheck,
  BarChart2,
  KeyRound,
  FileCheck,
  DollarSign,
  Code2,
  HelpCircle,
  LifeBuoy,
  Settings2,
} from 'lucide-react';

const primary = [
  { name: 'Overview', href: '/', icon: Gauge },
  { name: 'Claims', href: '/claims', icon: FileText },
  { name: 'Front Desk', href: '/appointments', icon: UserRound },
  { name: 'Queues', href: '/queues', icon: Layers },
];

const moreLinks = [
  { name: 'Rounds', href: '/rounds', icon: Stethoscope },
  { name: 'Eligibility', href: '/eligibility', icon: ShieldCheck },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Prior Auth', href: '/prior-auth', icon: KeyRound },
  { name: 'Remits', href: '/remits', icon: FileCheck },
  { name: 'Patient Balances', href: '/collections', icon: DollarSign },
  { name: 'Developers', href: '/developers', icon: Code2 },
  { name: 'Tickets', href: '/tickets', icon: LifeBuoy },
  { name: 'Settings & configuration', href: '/settings', icon: Settings2 },
];

export default function MobileNav() {
  const pathname = appPath(usePathname());
  const [moreOpen, setMoreOpen] = useState(false);

  const itemClass = (active: boolean) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${
      active ? 'text-primary font-medium' : 'text-muted-foreground'
    }`;

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}
      {moreOpen && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-3 rounded-xl border border-border bg-background p-2 shadow-lg md:hidden">
          {moreLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  active ? 'bg-muted font-medium' : 'hover:bg-muted'
                }`}
              >
                <Icon className="size-4 text-muted-foreground" />
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/help"
            onClick={() => setMoreOpen(false)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              pathname === '/help' ? 'bg-muted font-medium' : 'hover:bg-muted'
            }`}
          >
            <HelpCircle className="size-4 text-muted-foreground" />
            Help center
          </Link>
        </div>
      )}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 flex border-t border-border/70 bg-background md:hidden">
        {primary.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={itemClass(active)}>
              <Icon className="size-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <button type="button" className={itemClass(moreOpen)} onClick={() => setMoreOpen((open) => !open)}>
          <MoreHorizontal className="size-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
