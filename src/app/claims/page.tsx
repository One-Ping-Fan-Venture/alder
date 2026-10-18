'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Search,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Download,
  Plus,
  Tag,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function ClaimsPage() {
  const router = useRouter();
  const { claims } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [payerFilter, setPayerFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [taskCategory, setTaskCategory] = useState('all');
  const [taskType, setTaskType] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 65;

  const [sortField, setSortField] = useState<'none' | 'serviceDate' | 'billed' | 'claimBalance'>('none');
  const [sortAsc, setSortAsc] = useState(false);

  // Column visibility state
  const [visibleCols, setVisibleCols] = useState({
    serviceDate: true,
    lastUpdated: true,
    payer: true,
    payerId: true,
    status: true,
    billed: true,
    allowed: true,
    insBal: true,
    patResp: true,
    patPaid: true,
    claimBal: true,
    responsibility: true
  });
  const [isColMenuOpen, setIsColMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Filtered & Sorted claims
  const filteredClaims = useMemo(() => {
    let result = claims;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.payer.toLowerCase().includes(q) ||
          c.patientMrn.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (ownerFilter !== 'all') {
      result = result.filter((c) => c.responsibility.toLowerCase() === ownerFilter.toLowerCase());
    }

    if (payerFilter !== 'all') {
      result = result.filter((c) => c.payer === payerFilter);
    }

    if (sortField !== 'none') {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortField === 'billed') cmp = a.billed - b.billed;
        else if (sortField === 'claimBalance') cmp = a.claimBalance - b.claimBalance;
        else cmp = a.serviceDate.localeCompare(b.serviceDate);
        return sortAsc ? cmp : -cmp;
      });
    }

    return result;
  }, [claims, search, statusFilter, ownerFilter, payerFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredClaims.length / pageSize);
  const paginated = filteredClaims.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExport = () => {
    alert(`Exporting ${filteredClaims.length} claims as CSV format.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-4 max-w-[1600px] mx-auto flex flex-col h-full text-foreground">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="size-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Claims
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Every claim Taiga has touched, with current status and money flowing through. This view is read-only; our ops team works the queue on your behalf.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Export</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => router.push('/claims/clm-1002')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>New claim</span>
          </button>
        </div>
      </div>

      {/* 2-Row Dense Filter and Control Bar */}
      <div className="bg-card p-3 rounded-xl border border-border/80 shadow-xs space-y-2.5 text-xs">
        {/* Row 1: Search + 7 Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Search Input */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search claims, patients, IDs..."
              className="w-full pl-8 pr-3 py-1.5 bg-background border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 1. Primary Payer Name */}
          <select
            value={payerFilter}
            onChange={(e) => {
              setPayerFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground cursor-pointer focus:outline-none"
          >
            <option value="all">Primary payer name</option>
            <option value="Aetna">Aetna</option>
            <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
            <option value="Cigna">Cigna</option>
            <option value="UnitedHealthcare">UnitedHealthcare</option>
            <option value="Oregon Health Plan">Oregon Health Plan</option>
            <option value="Self-pay">Self-pay</option>
          </select>

          {/* 2. All Statuses */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground cursor-pointer focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Denied">Denied</option>
            <option value="Submitted">Submitted</option>
            <option value="Awaiting info">Awaiting info</option>
            <option value="ERA received">ERA received</option>
            <option value="Coded">Coded</option>
            <option value="Rejected">Rejected</option>
            <option value="Waiting on provider">Waiting on provider</option>
            <option value="In intake">In intake</option>
            <option value="Paid (incorrect)">Paid (incorrect)</option>
            <option value="On hold">On hold</option>
            <option value="ERA review">ERA review</option>
            <option value="Not billable">Not billable</option>
          </select>

          {/* 3. Tags */}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground cursor-pointer focus:outline-none"
          >
            <option value="all">Tags</option>
            <option value="high_dollar">High Dollar (&gt;$500)</option>
            <option value="urgent">Urgent Appeal</option>
            <option value="telehealth">Telehealth</option>
          </select>

          {/* 4. Service Date */}
          <button
            onClick={() => alert('Date Range Picker: Oct 01, 2026 – Oct 17, 2026')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/50 cursor-pointer"
          >
            <Calendar className="size-3 text-muted-foreground" />
            <span>Service date</span>
          </button>

          {/* 5. Any Owner */}
          <select
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground cursor-pointer focus:outline-none"
          >
            <option value="all">Any owner</option>
            <option value="clinic">Clinic Action</option>
            <option value="taiga">Taiga Ops</option>
            <option value="payer">Payer</option>
          </select>

          {/* 6. Task Categories */}
          <select
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground cursor-pointer focus:outline-none hidden md:block"
          >
            <option value="all">Task categories</option>
            <option value="denials">Denials & Appeals</option>
            <option value="missing_info">Missing Documents</option>
            <option value="coding">Coding & Modifiers</option>
          </select>

          {/* 7. Task Types */}
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-xs font-medium text-foreground cursor-pointer focus:outline-none hidden lg:block"
          >
            <option value="all">Task types</option>
            <option value="carc_16">Referral Required</option>
            <option value="carc_4">Modifier Review</option>
            <option value="prior_auth">Prior Auth Sync</option>
          </select>

          {/* + Add Filter */}
          <button
            onClick={() => alert('Additional filters: Provider NPI, Facility, POS, ERA Batch ID.')}
            className="px-2 py-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground text-xs"
          >
            + Add
          </button>
        </div>

        {/* Row 2: Sort, Columns, Total Count */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {/* Default Sort */}
            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 hover:bg-secondary border border-border/80 rounded-lg text-xs font-medium text-foreground"
              >
                <span>Default sort</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>
              {isSortMenuOpen && (
                <div className="absolute left-0 mt-1 w-44 bg-card border border-border rounded-xl shadow-xl p-1.5 z-30 text-xs space-y-1">
                  <button
                    onClick={() => {
                      setSortField('serviceDate');
                      setIsSortMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-secondary text-foreground"
                  >
                    Service Date (Newest)
                  </button>
                  <button
                    onClick={() => {
                      setSortField('billed');
                      setIsSortMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-secondary text-foreground"
                  >
                    Billed Amount (Highest)
                  </button>
                  <button
                    onClick={() => {
                      setSortField('claimBalance');
                      setIsSortMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-secondary text-foreground"
                  >
                    Claim Balance (Highest)
                  </button>
                </div>
              )}
            </div>

            {/* Columns Menu */}
            <div className="relative">
              <button
                onClick={() => setIsColMenuOpen(!isColMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 hover:bg-secondary border border-border/80 rounded-lg text-xs font-medium text-foreground"
              >
                <Columns className="size-3 text-muted-foreground" />
                <span>Columns</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>
              {isColMenuOpen && (
                <div className="absolute left-0 mt-1 w-52 bg-card border border-border rounded-xl shadow-xl p-2 z-30 space-y-1 text-xs">
                  {Object.keys(visibleCols).map((col) => (
                    <label key={col} className="flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded cursor-pointer text-foreground">
                      <input
                        type="checkbox"
                        checked={visibleCols[col as keyof typeof visibleCols]}
                        onChange={(e) =>
                          setVisibleCols({
                            ...visibleCols,
                            [col]: e.target.checked
                          })
                        }
                        className="rounded accent-primary"
                      />
                      <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <span className="text-muted-foreground font-mono text-[11px]">
            {filteredClaims.length.toLocaleString()} claims
          </span>
        </div>
      </div>

      {/* Dense Table Container */}
      <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium select-none">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap font-semibold">Patient name</th>
                {visibleCols.serviceDate && (
                  <th
                    onClick={() => toggleSort('serviceDate')}
                    className="py-2.5 px-3 cursor-pointer hover:text-foreground whitespace-nowrap font-semibold"
                  >
                    <div className="flex items-center gap-1">
                      <span>Service date</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}
                {visibleCols.lastUpdated && <th className="py-2.5 px-3 whitespace-nowrap font-semibold">Last updated</th>}
                {visibleCols.payer && <th className="py-2.5 px-3 whitespace-nowrap font-semibold">Primary payer</th>}
                {visibleCols.payerId && <th className="py-2.5 px-3 whitespace-nowrap font-semibold">Payer ID</th>}
                {visibleCols.status && <th className="py-2.5 px-3 whitespace-nowrap font-semibold">Status</th>}
                {visibleCols.billed && (
                  <th
                    onClick={() => toggleSort('billed')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-foreground whitespace-nowrap font-semibold"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Billed</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}
                {visibleCols.allowed && <th className="py-2.5 px-3 text-right whitespace-nowrap font-semibold">Allowed</th>}
                {visibleCols.insBal && <th className="py-2.5 px-3 text-right whitespace-nowrap font-semibold">Insurance balance</th>}
                {visibleCols.patResp && <th className="py-2.5 px-3 text-right whitespace-nowrap font-semibold">Patient resp.</th>}
                {visibleCols.patPaid && <th className="py-2.5 px-3 text-right whitespace-nowrap font-semibold">Patient paid</th>}
                {visibleCols.claimBal && (
                  <th
                    onClick={() => toggleSort('claimBalance')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-foreground whitespace-nowrap font-semibold"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Claim balance</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}
                {visibleCols.responsibility && (
                  <th className="py-2.5 px-3 whitespace-nowrap font-semibold">Responsibility</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-xs text-muted-foreground">
                    No claims match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((claim) => (
                  <tr
                    key={claim.id}
                    onClick={() => router.push(`/claims/${claim.id}`)}
                    className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  >
                    {/* Patient Name */}
                    <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                      <div>{claim.patientName}</div>
                    </td>

                    {visibleCols.serviceDate && (
                      <td className="py-2.5 px-3 whitespace-nowrap text-muted-foreground">
                        {claim.serviceDate}
                      </td>
                    )}

                    {visibleCols.lastUpdated && (
                      <td className="py-2.5 px-3 whitespace-nowrap text-muted-foreground">
                        {claim.lastUpdated}
                      </td>
                    )}

                    {visibleCols.payer && (
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-foreground">
                        {claim.payer}
                      </td>
                    )}

                    {visibleCols.payerId && (
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-muted-foreground">
                        {claim.payerId}
                      </td>
                    )}

                    {visibleCols.status && (
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={claim.status} size="sm" />
                      </td>
                    )}

                    {visibleCols.billed && (
                      <td className="py-2.5 px-3 text-right font-medium text-foreground whitespace-nowrap">
                        ${claim.billed.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.allowed && (
                      <td className="py-2.5 px-3 text-right text-muted-foreground whitespace-nowrap">
                        ${claim.allowed.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.insBal && (
                      <td className="py-2.5 px-3 text-right text-muted-foreground whitespace-nowrap">
                        ${claim.insuranceBalance.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.patResp && (
                      <td className="py-2.5 px-3 text-right text-muted-foreground whitespace-nowrap">
                        ${claim.patientResp.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.patPaid && (
                      <td className="py-2.5 px-3 text-right text-muted-foreground whitespace-nowrap">
                        ${claim.patientPaid.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.claimBal && (
                      <td className="py-2.5 px-3 text-right font-bold whitespace-nowrap">
                        <span
                          className={
                            claim.claimBalance > 0
                              ? 'text-rose-400'
                              : 'text-muted-foreground'
                          }
                        >
                          ${claim.claimBalance.toFixed(2)}
                        </span>
                      </td>
                    )}

                    {visibleCols.responsibility && (
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            claim.responsibility === 'Clinic'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : claim.responsibility === 'Taiga'
                              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                              : claim.responsibility === 'Payer'
                              ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {claim.responsibility}
                        </span>
                      </td>
                    )}
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
            {Math.min(page * pageSize, filteredClaims.length)} of{' '}
            {filteredClaims.length.toLocaleString()} entries
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
