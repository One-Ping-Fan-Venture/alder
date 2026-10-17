'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Gauge,
  Users,
  Stethoscope,
  ShieldCheck,
  BarChart3,
  FileText,
  Layers,
  KeyRound,
  Receipt,
  CircleDollarSign,
  Compass,
  Code2,
  LifeBuoy,
  Settings2,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme, setTourOpen, setCommandPaletteOpen, persona } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const practiceNav = [
    { name: 'Overview', href: '/', icon: Gauge },
    { name: 'Front Desk', href: '/appointments', icon: Users },
    { name: 'Rounds', href: '/rounds', icon: Stethoscope },
    { name: 'Eligibility', href: '/eligibility', icon: ShieldCheck }
  ];

  const billingNav = [
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Claims', href: '/claims', icon: FileText },
    { name: 'Queues', href: '/queues', icon: Layers },
    { name: 'Prior Auth', href: '/prior-auth', icon: KeyRound },
    { name: 'Remits', href: '/remits', icon: Receipt },
    { name: 'Patient Balances', href: '/collections', icon: CircleDollarSign }
  ];

  const footerNav = [
    { name: 'Developers', href: '/developers', icon: Code2 },
    { name: 'Help center', href: 'https://docs.taigabilling.com', icon: HelpCircle, external: true },
    { name: 'Tickets', href: '/tickets', icon: LifeBuoy },
    { name: 'Settings & configuration', href: '/settings', icon: Settings2 }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Clinic Branding */}
      <div className="p-3 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="size-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm group-hover:bg-emerald-500 transition-colors">
            N
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                Northstar Family Health
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                Billing transparency
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-200/50 dark:hover:bg-neutral-800 hidden sm:block"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Global Search trigger */}
      <div className="p-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xs hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
        >
          <Search className="size-3.5 shrink-0 text-neutral-400" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">Search claims & patients</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-100 dark:bg-neutral-700 text-neutral-500 rounded border border-neutral-300 dark:border-neutral-600">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-xs font-medium">
        {/* Practice Group */}
        <div>
          {!collapsed && (
            <div className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              Practice
            </div>
          )}
          <nav className="space-y-0.5">
            {practiceNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                  title={item.name}
                >
                  <Icon className={`size-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Billing Group */}
        <div>
          {!collapsed && (
            <div className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              Billing
            </div>
          )}
          <nav className="space-y-0.5">
            {billingNav.map((item) => {
              const isActive = pathname === item.href || (item.href === '/claims' && pathname.startsWith('/claims'));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                  title={item.name}
                >
                  <Icon className={`size-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tour Guide Button */}
        <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <button
            onClick={() => setTourOpen(true)}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-lg text-xs transition-colors"
          >
            <Compass className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {!collapsed && <span>Take a Tour</span>}
          </button>
        </div>

        {/* Platform Footer Links */}
        <div className="space-y-0.5">
          {footerNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-lg text-xs transition-colors"
                  title={item.name}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </a>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                title={item.name}
              >
                <Icon className="size-3.5 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Footer Profile & Theme Toggle */}
      <div className="p-2 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-7 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold flex items-center justify-center shrink-0 text-xs">
            {persona.avatar}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {persona.name}
              </span>
              <span className="text-[10px] text-neutral-500 truncate">
                {persona.title}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
        >
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
      </div>
    </aside>
  );
}
