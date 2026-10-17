'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Gauge,
  FileText,
  KeyRound,
  Stethoscope,
  MapPin,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, claims } = useApp();
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

  // Default Quick Links
  const quickLinks: PaletteItem[] = [
    { id: 'goto-overview', title: 'Overview', href: '/', icon: Gauge, group: 'Go to' },
    { id: 'goto-claims', title: 'Claims', href: '/claims', icon: FileText, group: 'Go to' },
    { id: 'goto-prior-auth', title: 'Prior Auth', href: '/prior-auth', icon: KeyRound, group: 'Go to' },
    { id: 'goto-providers', title: 'Providers', href: '/settings?tab=providers', icon: Stethoscope, group: 'Go to' },
    { id: 'goto-facilities', title: 'Facilities', href: '/settings?tab=facilities', icon: MapPin, group: 'Go to' },
    { id: 'claims-submitted', title: 'Submitted claims', href: '/claims?status=Submitted', icon: Clock, group: 'Claims' },
    { id: 'claims-paid', title: 'Paid claims', href: '/claims?status=Paid', icon: CheckCircle2, group: 'Claims' },
  ];

  // Dynamic filtered results
  const filteredClaims = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return claims
      .filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.payer.toLowerCase().includes(q) ||
          (c.cptCode && c.cptCode.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [claims, query]);

  const allItems: PaletteItem[] = useMemo(() => {
    if (!query.trim()) {
      return quickLinks;
    }
    return filteredClaims.map(c => ({
      id: c.id,
      title: `${c.id} - ${c.patientName}`,
      subtitle: `${c.payer} • $${c.billed.toFixed(2)} • ${c.status}`,
      href: `/claims/${c.id}`,
      icon: FileText,
      group: 'Matching Claims'
    }));
  }, [query, filteredClaims, quickLinks]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        setCommandPaletteOpen(false);
        router.push(selected.href);
      }
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Dialog Card */}
      <div className="relative z-50 w-full max-w-md rounded-xl bg-popover text-popover-foreground shadow-2xl border border-border/80 overflow-hidden mx-4">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/70">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type to search claims, or jump to a page..."
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground outline-none"
          />
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center rounded border border-border/70 bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-1.5 space-y-3">
          {!query.trim() ? (
            <>
              {/* Go to Group */}
              <div>
                <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  Go to
                </div>
                <div className="space-y-0.5">
                  {quickLinks
                    .filter(item => item.group === 'Go to')
                    .map((item, idx) => {
                      const Icon = item.icon;
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCommandPaletteOpen(false);
                            router.push(item.href);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-muted text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Claims Group */}
              <div>
                <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  Claims
                </div>
                <div className="space-y-0.5">
                  {quickLinks
                    .filter(item => item.group === 'Claims')
                    .map((item, idx) => {
                      const offsetIdx = 5 + idx;
                      const Icon = item.icon;
                      const isSelected = selectedIndex === offsetIdx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCommandPaletteOpen(false);
                            router.push(item.href);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-muted text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                Matching claims ({allItems.length})
              </div>
              {allItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching claims or pages found.
                </div>
              ) : (
                <div className="space-y-0.5">
                  {allItems.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCommandPaletteOpen(false);
                          router.push(item.href);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-muted text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="size-3.5 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-foreground">{item.title}</span>
                            {'subtitle' in item && item.subtitle && (
                              <p className="text-[10px] text-muted-foreground truncate">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
