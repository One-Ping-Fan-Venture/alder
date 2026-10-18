'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Search,
  Columns,
  ChevronDown,
  Info
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function QueuesPage() {
  const { queues, claims } = useApp();
  const [activeTab, setActiveTab] = useState<
    'coding' | 'pre_submission' | 'rejections' | 'denials' | 'stale' | 'other'
  >('coding');
  const [searchQueue, setSearchQueue] = useState('');
  const [hideEmpty, setHideEmpty] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(queues[0]?.id || null);

  const selectedQueue = queues.find((q) => q.id === selectedQueueId) || queues[0];

  // Category counts
  const categoryTabs = [
    { key: 'coding', label: 'Coding', count: 51 },
    { key: 'pre_submission', label: 'Pre-Submission', count: 102 },
    { key: 'rejections', label: 'Rejections', count: 40 },
    { key: 'denials', label: 'Denials', count: 3 },
    { key: 'stale', label: 'Stale Claims', count: null as number | null },
    { key: 'other', label: 'Other Post-Submission', count: 42 }
  ];

  // Filter queues based on tab & search
  const tabQueueIds: Record<string, string[]> = {
    coding: ['q-provider-followup', 'q-coding-validation'],
    pre_submission: [],
    rejections: [],
    denials: [],
    stale: [],
    other: [],
  };

  const filteredQueues = queues.filter((q) => {
    const ids = tabQueueIds[activeTab];
    if (ids && !ids.includes(q.id)) return false;
    if (hideEmpty && q.totalClaims === 0) return false;
    if (searchQueue.trim() && !q.name.toLowerCase().includes(searchQueue.toLowerCase())) return false;
    return true;
  });

  // Claims for selected queue
  const queueClaims = claims.filter((c) => {
    if (selectedQueue.id === 'q-provider-followup') return c.status === 'waiting_for_provider' || c.status === 'missing_information';
    if (selectedQueue.id === 'q-coding-validation') return c.status === 'coded' || c.id === 'clm-1002';
    if (selectedQueue.id === 'q-stale-claims') return c.status === 'submitted_to_payer';
    if (selectedQueue.id === 'q-clearinghouse-rejections') return c.status === 'rejected';
    if (selectedQueue.id === 'q-denials-appeal') return c.status === 'denied' || c.status === 'finalized_denied';
    if (selectedQueue.id === 'q-patient-hold') return c.status === 'held_by_customer' || c.status === 'not_billable';
    return true;
  }).slice(0, 8);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-4 max-w-[1600px] mx-auto text-foreground">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="size-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Queues
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Every work queue your claims move through — what Alder is working, what needs your team, and what&apos;s snoozed.
          </p>
        </div>
      </div>

      {/* Amber Notice Banner */}
      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 flex items-center gap-2.5 shadow-xs">
        <Info className="size-4 text-amber-400 shrink-0" />
        <span>
          This view may not reflect recent activity; the last refresh was more than 30 minutes ago.
        </span>
      </div>

      {/* 6 Category Tabs */}
      <div className="flex items-center gap-1 border-b border-border/70 overflow-x-auto text-xs font-medium pb-2 scrollbar-none">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-secondary text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count != null && <span className="text-[11px] opacity-75">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-card p-3 rounded-xl border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQueue}
            onChange={(e) => setSearchQueue(e.target.value)}
            placeholder="Search queue name..."
            className="w-full pl-8 pr-3 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Hide empty queues toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={hideEmpty}
              onChange={(e) => setHideEmpty(e.target.checked)}
              className="rounded accent-primary"
            />
            <span>Hide empty queues</span>
          </label>

          {/* Columns menu */}
          <button
            onClick={() => alert('Custom column ordering applied.')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground"
          >
            <Columns className="size-3.5 text-muted-foreground" />
            <span>Columns</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Queues Table */}
      <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Queue</th>
                <th className="py-2.5 px-3 text-right font-semibold">Total claims</th>
                <th className="py-2.5 px-3 text-right font-semibold">Total balance</th>
                <th className="py-2.5 px-3 text-center font-semibold">Alder review</th>
                <th className="py-2.5 px-3 text-center font-semibold">Clinic action</th>
                <th className="py-2.5 px-3 text-right font-semibold">Snoozed claims</th>
                <th className="py-2.5 px-3 text-right font-semibold">Snoozed balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredQueues.map((q) => {
                const isSelected = selectedQueueId === q.id;
                return (
                  <tr
                    key={q.id}
                    onClick={() => setSelectedQueueId(q.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-secondary text-foreground font-semibold border-l-2 border-primary'
                        : 'hover:bg-secondary/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">
                        {q.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground max-w-md truncate">
                        {q.description}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-foreground">
                      {q.totalClaims}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-foreground">
                      ${q.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {q.alderReview}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {q.clinicAction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground font-mono">
                      {q.snoozedClaims}
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      ${q.snoozedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Showing all {filteredQueues.length} queues.</p>

      {false && selectedQueue && (
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border/60">
            <div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Active Queue Drilldown
              </span>
              <h2 className="text-base font-bold text-foreground mt-0.5">
                {selectedQueue.name}
              </h2>
              <p className="text-xs text-muted-foreground">{selectedQueue.description}</p>
            </div>
            <Link
              href="/claims"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Open in Claims view</span>
              <ChevronRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {queueClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 rounded-lg border border-border/70 bg-secondary/30 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/claims/${claim.id}`}
                      className="font-bold text-foreground hover:text-primary hover:underline"
                    >
                      {claim.patientName}
                    </Link>
                    <span className="font-mono text-muted-foreground text-[11px]">{claim.id}</span>
                    <StatusBadge status={claim.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {claim.payer} · DOS: {claim.serviceDate} · CPT: {claim.cptCode}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-muted-foreground text-[10px] block">Claim Balance</span>
                    <span className="font-bold text-rose-400 text-sm">
                      ${claim.claimBalance.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/claims/${claim.id}`}
                    className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <span>Work Claim</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
