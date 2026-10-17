'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { KeyRound, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function PriorAuthPage() {
  const { priorAuths } = useApp();
  const [filter, setFilter] = useState<'all' | 'needs_info' | 'pending' | 'approved' | 'denied'>('all');
  const [search, setSearch] = useState('');

  const filtered = priorAuths.filter((pa) => {
    if (filter === 'approved' && pa.status !== 'Approved') return false;
    if (filter === 'pending' && pa.status !== 'Pending payer') return false;
    if (filter === 'needs_info' && pa.status !== 'Needs information') return false;
    if (filter === 'denied' && pa.status !== 'Denied') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        pa.patientName.toLowerCase().includes(q) ||
        pa.authNumber.toLowerCase().includes(q) ||
        pa.serviceName.toLowerCase().includes(q) ||
        pa.serviceCode.toLowerCase().includes(q) ||
        pa.payer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: priorAuths.length,
    needs_info: priorAuths.filter((p) => p.status === 'Needs information').length,
    pending: priorAuths.filter((p) => p.status === 'Pending payer').length,
    approved: priorAuths.filter((p) => p.status === 'Approved').length,
    denied: priorAuths.filter((p) => p.status === 'Denied').length
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-4 max-w-[1600px] mx-auto text-foreground">
      {/* Top Header Row (Read-only tracking board matching demo) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <KeyRound className="size-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Prior Auth
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tracking prior authorization status and payer approvals
          </p>
        </div>
      </div>

      {/* 5 Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-border/70 overflow-x-auto text-xs font-medium pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'needs_info', label: 'Needs information', count: counts.needs_info },
          { key: 'pending', label: 'Pending payer', count: counts.pending },
          { key: 'approved', label: 'Approved', count: counts.approved },
          { key: 'denied', label: 'Denied', count: counts.denied }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
              filter === tab.key
                ? 'bg-secondary text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[11px] opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-card p-3 rounded-xl border border-border/80 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authorizations, patients, CPT..."
            className="w-full pl-8 pr-3 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <span className="text-muted-foreground font-mono text-[11px]">
          {filtered.length} Authorizations
        </span>
      </div>

      {/* 5-Column Table */}
      <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Patient</th>
                <th className="py-2.5 px-3 font-semibold">Service</th>
                <th className="py-2.5 px-3 font-semibold">Payer</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                    No prior authorizations match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((pa) => (
                  <tr key={pa.id} className="hover:bg-secondary/20 transition-colors">
                    {/* 1. Patient */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">
                        {pa.patientName}
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {pa.authNumber}
                      </span>
                    </td>

                    {/* 2. Service */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-primary">
                        {pa.serviceCode}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{pa.serviceName}</div>
                    </td>

                    {/* 3. Payer */}
                    <td className="py-3 px-3 font-medium text-foreground">
                      <div>{pa.payer}</div>
                      <div className="text-[10px] text-muted-foreground">{pa.plan}</div>
                    </td>

                    {/* 4. Status */}
                    <td className="py-3 px-3">
                      <StatusBadge status={pa.status} size="sm" />
                    </td>

                    {/* 5. Submitted */}
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {pa.submittedDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
