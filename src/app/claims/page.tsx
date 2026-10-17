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
  ArrowUpDown,
  Download,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function ClaimsPage() {
  const router = useRouter();
  const { claims } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [payerFilter, setPayerFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [sortField, setSortField] = useState<'serviceDate' | 'billed' | 'claimBalance'>('serviceDate');
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
      if (statusFilter === 'paid') {
        result = result.filter((c) => c.status === 'paid' || c.status === 'finalized_paid');
      } else if (statusFilter === 'denied') {
        result = result.filter((c) => c.status === 'denied' || c.status === 'finalized_denied');
      } else if (statusFilter === 'awaiting_info') {
        result = result.filter((c) => ['missing_information', 'waiting_for_provider'].includes(c.status));
      } else {
        result = result.filter((c) => c.status === statusFilter);
      }
    }

    if (ownerFilter !== 'all') {
      result = result.filter((c) => c.responsibility.toLowerCase() === ownerFilter.toLowerCase());
    }

    if (payerFilter !== 'all') {
      result = result.filter((c) => c.payer === payerFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'billed') cmp = a.billed - b.billed;
      else if (sortField === 'claimBalance') cmp = a.claimBalance - b.claimBalance;
      else cmp = a.id.localeCompare(b.id);
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [claims, search, statusFilter, ownerFilter, payerFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredClaims.length / pageSize);
  const paginated = filteredClaims.slice((page - 1) * pageSize, page * pageSize);

  const totalFilteredBilled = filteredClaims.reduce((acc, c) => acc + c.billed, 0);
  const totalFilteredBalance = filteredClaims.reduce((acc, c) => acc + c.claimBalance, 0);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Claims
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Status of every claim Taiga is working on across clearinghouses and payers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <span>
              Total Billed:{' '}
              <strong className="text-neutral-900 dark:text-neutral-100 font-bold">
                ${totalFilteredBilled.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </span>
            <span className="text-neutral-300">|</span>
            <span>
              In Balance:{' '}
              <strong className="text-rose-600 dark:text-rose-400 font-bold">
                ${totalFilteredBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-neutral-850 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by patient, ID, or MRN..."
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid & Finalized</option>
            <option value="denied">Denied (Active appeal)</option>
            <option value="submitted_to_payer">Submitted to Payer</option>
            <option value="awaiting_info">Awaiting info / Clinic Action</option>
            <option value="coded">Coded</option>
            <option value="rejected">Rejected (Clearinghouse)</option>
            <option value="era_received">ERA Received</option>
            <option value="paid_incorrectly">Underpaid</option>
          </select>

          {/* Owner filter */}
          <select
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium"
          >
            <option value="all">Any owner</option>
            <option value="clinic">Clinic Action</option>
            <option value="taiga">Taiga Review</option>
            <option value="payer">Payer</option>
            <option value="none">None (Settled)</option>
          </select>

          {/* Payer filter */}
          <select
            value={payerFilter}
            onChange={(e) => {
              setPayerFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium hidden sm:block"
          >
            <option value="all">All payers</option>
            <option value="Aetna">Aetna</option>
            <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
            <option value="Cigna">Cigna</option>
            <option value="UnitedHealthcare">UnitedHealthcare</option>
            <option value="Oregon Health Plan">Oregon Health Plan</option>
          </select>
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-2">
          {/* Columns menu */}
          <div className="relative">
            <button
              onClick={() => setIsColMenuOpen(!isColMenuOpen)}
              className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Columns className="size-3.5 text-neutral-500" />
              <span>Columns</span>
            </button>
            {isColMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-2 z-30 space-y-1 text-xs">
                {Object.keys(visibleCols).map((col) => (
                  <label key={col} className="flex items-center gap-2 px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleCols[col as keyof typeof visibleCols]}
                      onChange={(e) =>
                        setVisibleCols({
                          ...visibleCols,
                          [col]: e.target.checked
                        })
                      }
                      className="rounded"
                    />
                    <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <span className="text-neutral-400 font-mono text-[11px]">
            {filteredClaims.length.toLocaleString()} claims
          </span>
        </div>
      </div>

      {/* Dense Table Container */}
      <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium select-none">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Patient name</th>
                {visibleCols.serviceDate && (
                  <th
                    onClick={() => toggleSort('serviceDate')}
                    className="py-2.5 px-3 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Service date</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}
                {visibleCols.lastUpdated && <th className="py-2.5 px-3 whitespace-nowrap">Last updated</th>}
                {visibleCols.payer && <th className="py-2.5 px-3 whitespace-nowrap">Primary payer</th>}
                {visibleCols.payerId && <th className="py-2.5 px-3 whitespace-nowrap">Payer ID</th>}
                {visibleCols.status && <th className="py-2.5 px-3 whitespace-nowrap">Status</th>}
                {visibleCols.billed && (
                  <th
                    onClick={() => toggleSort('billed')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-800 whitespace-nowrap"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Billed</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}
                {visibleCols.allowed && <th className="py-2.5 px-3 text-right whitespace-nowrap">Allowed</th>}
                {visibleCols.insBal && <th className="py-2.5 px-3 text-right whitespace-nowrap">Ins. balance</th>}
                {visibleCols.patResp && <th className="py-2.5 px-3 text-right whitespace-nowrap">Patient resp.</th>}
                {visibleCols.patPaid && <th className="py-2.5 px-3 text-right whitespace-nowrap">Patient paid</th>}
                {visibleCols.claimBal && (
                  <th
                    onClick={() => toggleSort('claimBalance')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-800 whitespace-nowrap"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Claim balance</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}
                {visibleCols.responsibility && (
                  <th className="py-2.5 px-3 whitespace-nowrap">Responsibility</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-xs text-neutral-400">
                    No claims match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((claim) => (
                  <tr
                    key={claim.id}
                    onClick={() => router.push(`/claims/${claim.id}`)}
                    className="hover:bg-emerald-50/40 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
                  >
                    {/* Patient Name */}
                    <td className="py-2.5 px-3 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                      <div>{claim.patientName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{claim.id}</div>
                    </td>

                    {visibleCols.serviceDate && (
                      <td className="py-2.5 px-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                        {claim.serviceDate}
                      </td>
                    )}

                    {visibleCols.lastUpdated && (
                      <td className="py-2.5 px-3 whitespace-nowrap text-neutral-400">
                        {claim.lastUpdated}
                      </td>
                    )}

                    {visibleCols.payer && (
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-neutral-800 dark:text-neutral-200">
                        {claim.payer}
                      </td>
                    )}

                    {visibleCols.payerId && (
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-neutral-400">
                        {claim.payerId}
                      </td>
                    )}

                    {visibleCols.status && (
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={claim.status} size="sm" />
                      </td>
                    )}

                    {visibleCols.billed && (
                      <td className="py-2.5 px-3 text-right font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        ${claim.billed.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.allowed && (
                      <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        ${claim.allowed.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.insBal && (
                      <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        ${claim.insuranceBalance.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.patResp && (
                      <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        ${claim.patientResp.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.patPaid && (
                      <td className="py-2.5 px-3 text-right text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        ${claim.patientPaid.toFixed(2)}
                      </td>
                    )}

                    {visibleCols.claimBal && (
                      <td className="py-2.5 px-3 text-right font-bold whitespace-nowrap">
                        <span
                          className={
                            claim.claimBalance > 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-neutral-400'
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
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : claim.responsibility === 'Taiga'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : claim.responsibility === 'Payer'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                              : 'text-neutral-400'
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

        {/* Pagination footer */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <div>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filteredClaims.length)} of{' '}
            {filteredClaims.length.toLocaleString()} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-2 font-medium text-neutral-800 dark:text-neutral-200">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
