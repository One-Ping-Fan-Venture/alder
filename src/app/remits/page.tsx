'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Receipt,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Building2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function RemitsPage() {
  const { remits } = useApp();
  const [tab, setTab] = useState<'all' | 'posted' | 'snoozed'>('all');

  // Filter form state
  const [checkNum, setCheckNum] = useState('');
  const [checkDate, setCheckDate] = useState('');
  const [checkAmount, setCheckAmount] = useState('');
  const [payer, setPayer] = useState('all');
  const [payeeId, setPayeeId] = useState('');
  const [postingStatus, setPostingStatus] = useState('all');
  const [snoozed, setSnoozed] = useState('all');

  const [page, setPage] = useState(1);
  const pageSize = 50;

  const filtered = remits.filter((r) => {
    if (tab === 'posted' && r.postingStatus !== 'Posted') return false;
    if (tab === 'snoozed' && r.postingStatus !== 'Snoozed') return false;

    if (checkNum.trim() && !r.checkNumber.toLowerCase().includes(checkNum.toLowerCase())) return false;
    if (checkDate.trim() && !r.checkDate.includes(checkDate)) return false;
    if (checkAmount.trim() && !r.amount.toString().includes(checkAmount)) return false;
    if (payer !== 'all' && r.payer !== payer) return false;
    if (payeeId.trim() && !r.payeeNpi.includes(payeeId)) return false;
    if (postingStatus !== 'all' && r.postingStatus !== postingStatus) return false;

    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDownloadERAs = () => {
    alert('Exporting 835 EDI ERA files as .zip archive.');
  };

  const handleDownloadEOBs = () => {
    alert('Exporting adjudicated EOB statements as PDF archive.');
  };

  const handleUploadPaperRemit = () => {
    alert('Paper remit OCR ingestion modal opened. Drop EOB scan or check stub.');
  };

  const handleClearFilters = () => {
    setCheckNum('');
    setCheckDate('');
    setCheckAmount('');
    setPayer('all');
    setPayeeId('');
    setPostingStatus('all');
    setSnoozed('all');
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-4 max-w-[1600px] mx-auto text-foreground">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Receipt className="size-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Remits
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Electronic remittances from payers. Taiga reconciles these against your claims automatically. Filter to investigate a specific check or posting status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleUploadPaperRemit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <Upload className="size-3.5 text-muted-foreground" />
            <span>Upload paper remit</span>
          </button>
          <button
            onClick={handleDownloadERAs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Download ERAs</span>
          </button>
          <button
            onClick={handleDownloadEOBs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <FileText className="size-3.5 text-muted-foreground" />
            <span>Download EOBs</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/70 overflow-x-auto text-xs font-medium pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'All', count: remits.length },
          { key: 'posted', label: 'Posted', count: remits.filter((r) => r.postingStatus === 'Posted').length },
          { key: 'snoozed', label: 'Snoozed', count: remits.filter((r) => r.postingStatus === 'Snoozed').length }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key as any);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
              tab === t.key
                ? 'bg-secondary text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[11px] opacity-75">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Check Filters Form Container */}
      <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs space-y-3 text-xs">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Check Filters
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. Check number */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Check number</label>
            <input
              type="text"
              placeholder="e.g. AET-558201"
              value={checkNum}
              onChange={(e) => setCheckNum(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 2. Check date */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Check date</label>
            <input
              type="text"
              placeholder="Sep 27, 2026"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 3. Check amount */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Check amount</label>
            <input
              type="text"
              placeholder="$0.00"
              value={checkAmount}
              onChange={(e) => setCheckAmount(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 4. Payer */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Payer</label>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground cursor-pointer focus:outline-none"
            >
              <option value="all">All payers</option>
              <option value="Aetna">Aetna</option>
              <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
              <option value="UnitedHealthcare">UnitedHealthcare</option>
              <option value="Cigna">Cigna</option>
              <option value="Oregon Health Plan">Oregon Health Plan</option>
            </select>
          </div>

          {/* 5. Payee identifier */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Payee identifier</label>
            <input
              type="text"
              placeholder="NPI / TIN"
              value={payeeId}
              onChange={(e) => setPayeeId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 6. Posting status */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Posting status</label>
            <select
              value={postingStatus}
              onChange={(e) => setPostingStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground cursor-pointer focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="Posted">Posted</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* 7. Snoozed */}
          <div>
            <label className="text-muted-foreground text-[11px] block mb-1">Snoozed</label>
            <select
              value={snoozed}
              onChange={(e) => setSnoozed(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground cursor-pointer focus:outline-none"
            >
              <option value="all">All</option>
              <option value="snoozed">Snoozed only</option>
              <option value="active">Active only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
          <button
            onClick={handleClearFilters}
            className="px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground"
          >
            Clear filters
          </button>
          <button
            onClick={() => setPage(1)}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Remits Dense Table */}
      <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Check number</th>
                <th className="py-2.5 px-3 font-semibold">Check date</th>
                <th className="py-2.5 px-3 font-semibold">Payer</th>
                <th className="py-2.5 px-3 font-semibold">Payee identifier</th>
                <th className="py-2.5 px-3 text-right font-semibold">Check amount</th>
                <th className="py-2.5 px-3 font-semibold">Posting status</th>
                <th className="py-2.5 px-3 font-semibold">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No remits match your filter parameters.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {r.checkNumber}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {r.checkDate}
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">
                      {r.payer}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                      {r.payeeNpi}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                      ${r.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-medium text-foreground">
                        {r.postingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.reconciliation === 'Reconciled'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {r.reconciliation}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filtered.length)} of{' '}
            {filtered.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-40 text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-2 font-medium text-foreground">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-40 text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
