'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  X,
  FileText,
  User,
  ArrowRight,
  Gauge,
  Users,
  ShieldCheck,
  BarChart3,
  Layers,
  KeyRound,
  Receipt,
  CircleDollarSign,
  Settings2,
  Code2
} from 'lucide-react';
import StatusBadge from './StatusBadge';

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  status?: string;
  href: string;
  icon: any;
  type: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, claims, patients } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global key listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Quick navigation items
  const staticNav: CommandItem[] = useMemo(
    () => [
      { id: 'nav-overview', label: 'Overview Dashboard', href: '/', icon: Gauge, type: 'Page' },
      { id: 'nav-appointments', label: 'Front Desk & Copays', href: '/appointments', icon: Users, type: 'Page' },
      { id: 'nav-claims', label: 'Claims Management', href: '/claims', icon: FileText, type: 'Page' },
      { id: 'nav-eligibility', label: 'Eligibility Check (270/271)', href: '/eligibility', icon: ShieldCheck, type: 'Page' },
      { id: 'nav-reports', label: 'Reports & A/R Analytics', href: '/reports', icon: BarChart3, type: 'Page' },
      { id: 'nav-queues', label: 'Work Queues', href: '/queues', icon: Layers, type: 'Page' },
      { id: 'nav-prior-auth', label: 'Prior Authorization', href: '/prior-auth', icon: KeyRound, type: 'Page' },
      { id: 'nav-remits', label: 'Remittances (835 ERA)', href: '/remits', icon: Receipt, type: 'Page' },
      { id: 'nav-collections', label: 'Patient Balances', href: '/collections', icon: CircleDollarSign, type: 'Page' },
      { id: 'nav-developers', label: 'Developer Portal & API', href: '/developers', icon: Code2, type: 'Page' },
      { id: 'nav-settings', label: 'Settings & Providers', href: '/settings', icon: Settings2, type: 'Page' }
    ],
    []
  );

  // Filtered results
  const results: CommandItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return staticNav.slice(0, 7);
    }

    // Match pages
    const matchedPages = staticNav.filter((p) => p.label.toLowerCase().includes(q));

    // Match claims
    const matchedClaims: CommandItem[] = claims
      .filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.payer.toLowerCase().includes(q) ||
          c.patientMrn.toLowerCase().includes(q)
      )
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        label: `${c.id} - ${c.patientName}`,
        sublabel: `${c.payer} · $${c.billed.toFixed(2)} · ${c.serviceDate}`,
        status: c.status,
        href: `/claims/${c.id}`,
        icon: FileText,
        type: 'Claim'
      }));

    return [...matchedPages, ...matchedClaims];
  }, [query, staticNav, claims]);

  const handleSelect = (item: (typeof results)[0]) => {
    setCommandPaletteOpen(false);
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="size-4 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a claim ID (e.g. clm-1001), patient name, or command..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="size-3.5" />
            </button>
          )}
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200"
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-850">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No matching claims, patients, or pages found.
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-neutral-900 dark:text-white'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate">{item.label}</span>
                      {'sublabel' in item && (
                        <span className="text-[11px] text-neutral-400 truncate">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {'status' in item && item.status && (
                      <StatusBadge status={item.status as string} size="sm" />
                    )}
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                      {item.type}
                    </span>
                    <ArrowRight className="size-3 text-neutral-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-850 text-[11px] text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded">↑</kbd>{' '}
              <kbd className="px-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded">↵</kbd> to select
            </span>
          </div>
          <span>1,546 Claims Indexed</span>
        </div>
      </div>
    </div>
  );
}
