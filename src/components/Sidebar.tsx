'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Gauge,
  UserRound,
  Stethoscope,
  ShieldCheck,
  BarChart2,
  FileText,
  Layers,
  KeyRound,
  FileCheck,
  DollarSign,
  Compass,
  Code2,
  HelpCircle,
  LifeBuoy,
  Settings2,
  Search,
  Sun,
  Moon
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme, setTourOpen, setCommandPaletteOpen, sidebarCollapsed: collapsed } = useApp();

  const practiceNav = [
    { name: 'Overview', href: '/', icon: Gauge, dataTour: 'overview' },
    { name: 'Front Desk', href: '/appointments', icon: UserRound, dataTour: 'patients' },
    { name: 'Rounds', href: '/rounds', icon: Stethoscope },
    { name: 'Eligibility', href: '/eligibility', icon: ShieldCheck }
  ];

  const billingNav = [
    { name: 'Reports', href: '/reports', icon: BarChart2, dataTour: 'reports' },
    { name: 'Claims', href: '/claims', icon: FileText, dataTour: 'claims' },
    { name: 'Queues', href: '/queues', icon: Layers, dataTour: 'queues' },
    { name: 'Prior Auth', href: '/prior-auth', icon: KeyRound },
    { name: 'Remits', href: '/remits', icon: FileCheck },
    { name: 'Patient Balances', href: '/collections', icon: DollarSign }
  ];

  const openTicketsCount = 3;

  return (
    <aside
      data-sidebar="sidebar"
      className={`group peer hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 z-30 select-none shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Clinic Branding */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 overflow-hidden group w-full">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-xs">
            N
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              Northstar Family Health
            </span>
          )}
        </Link>
      </div>

      {/* Global Search button */}
      <div className="px-3 py-1.5" data-tour="search">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open search"
          className="flex min-h-9 w-full items-center justify-start gap-2 rounded-lg bg-background px-2.5 py-1.5 text-xs font-normal text-muted-foreground shadow-xs border border-border/80 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
        >
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">Search claims</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border border-border/80 bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
                ⌘ K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs">
        {/* Practice Group */}
        <div>
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[11px] font-semibold text-muted-foreground">
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
                  data-tour={item.dataTour}
                  className={`peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left transition-colors duration-150 h-8 text-sm ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={item.name}
                >
                  <Icon className={`size-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Billing Group */}
        <div>
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[11px] font-semibold text-muted-foreground">
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
                  data-tour={item.dataTour}
                  className={`peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left transition-colors duration-150 h-8 text-sm ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={item.name}
                >
                  <Icon className={`size-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Take a Tour */}
        <div className="pt-2 border-t border-sidebar-border/60">
          <button
            onClick={() => setTourOpen(true)}
            data-tour="tour-btn"
            className={`peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150 h-8 text-sm cursor-pointer ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Compass className="size-4 shrink-0 text-muted-foreground" />
            {!collapsed && <span className="truncate">Take a Tour</span>}
          </button>
        </div>

        {/* Bottom Platform Links */}
        <div className="space-y-0.5">
          <Link
            href="/developers"
            className={`peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left h-8 text-sm transition-colors duration-150 ${
              pathname === '/developers'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Developers"
          >
            <Code2 className="size-4 shrink-0 text-muted-foreground" />
            {!collapsed && <span className="truncate">Developers</span>}
          </Link>

          <Link
            href="/help"
            className={`peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left h-8 text-sm transition-colors duration-150 ${
              pathname === '/help'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Help center"
          >
            <HelpCircle className="size-4 shrink-0 text-muted-foreground" />
            {!collapsed && <span className="truncate">Help center</span>}
          </Link>

          <Link
            href="/tickets"
            className={`peer/menu-button group/menu-button flex w-full items-center justify-between gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left h-8 text-sm transition-colors duration-150 ${
              pathname === '/tickets'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Tickets"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LifeBuoy className="size-4 shrink-0 text-muted-foreground" />
              {!collapsed && <span className="truncate">Tickets</span>}
            </div>
            {!collapsed && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {openTicketsCount}
              </span>
            )}
          </Link>

          <Link
            href="/settings"
            className={`peer/menu-button group/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left h-8 text-sm transition-colors duration-150 ${
              pathname === '/settings'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Settings & configuration"
          >
            <Settings2 className="size-4 shrink-0 text-muted-foreground" />
            {!collapsed && <span className="truncate">Settings & configuration</span>}
          </Link>
        </div>
      </div>

      {/* User Footer Profile & Theme Toggle */}
      <div className="p-3 border-t border-sidebar-border/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-7 rounded-md bg-secondary text-secondary-foreground font-semibold flex items-center justify-center shrink-0 text-xs">
            D
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-sidebar-foreground truncate">
                Demo visitor
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Change theme"
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors cursor-pointer"
          title="Change theme"
        >
          {theme === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </aside>
  );
}
