'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Receipt,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export default function RemitsPage() {
  const { remits } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const filtered = remits.filter((r) => {
    const matchesSearch =
      r.checkNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.payer.toLowerCase().includes(search.toLowerCase());
    if (filter === 'reconciled') return matchesSearch && r.reconciliation === 'Reconciled';
    if (filter === 'unreconciled') return matchesSearch && r.reconciliation === 'Unreconciled';
    return matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalAmount = remits.reduce((acc, r) => acc + r.amount, 0);
  const reconciledAmount = remits
    .filter((r) => r.reconciliation === 'Reconciled')
    .reduce((acc, r) => acc + r.amount, 0);
  const unreconciledAmount = totalAmount - reconciledAmount;

  const handleDownloadEOBs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Check Number,Check Date,Amount,Payer,Payee NPI,Reconciliation,Posting']
        .concat(
          remits.map(
            (r) =>
              `${r.checkNumber},${r.checkDate},${r.amount},${r.payer},${r.payeeNpi},${r.reconciliation},${r.postingStatus}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Taiga_Remits_835_EOB_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Remits
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Electronic Remittance Advice (835 ERA) check ledger and bank reconciliation.
          </p>
        </div>

        <button
          onClick={handleDownloadEOBs}
          className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="size-4 text-emerald-600" />
          <span>Download EOBs</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500">Total 835 Remits Posted</span>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-neutral-400 mt-0.5 block">{remits.length} checks received</span>
        </div>

        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-emerald-600 font-medium">Reconciled to Bank</span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            ${reconciledAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">
            Deposit matched via EFT
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-amber-600 font-medium">Unreconciled / In Transit</span>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            ${unreconciledAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-600/80 mt-0.5 block">Pending settlement</span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="size-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by check # or payer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter('reconciled');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                filter === 'reconciled'
                  ? 'bg-emerald-600 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              Reconciled
            </button>
            <button
              onClick={() => {
                setFilter('unreconciled');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                filter === 'unreconciled'
                  ? 'bg-amber-600 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              Unreconciled
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-3">Check no.</th>
                <th className="py-2.5 px-3">Check date</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Payer</th>
                <th className="py-2.5 px-3 font-mono">Payee NPI</th>
                <th className="py-2.5 px-3 text-center">Claims</th>
                <th className="py-2.5 px-3">Reconciliation</th>
                <th className="py-2.5 px-3">Posting</th>
                <th className="py-2.5 px-3">Received</th>
                <th className="py-2.5 px-3">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {paginated.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {r.checkNumber}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {r.checkDate}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    ${r.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                    {r.payer}
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-400 text-[11px] whitespace-nowrap">
                    {r.payeeNpi}
                  </td>
                  <td className="py-3 px-3 text-center font-medium">{r.claimsCount}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.reconciliation === 'Reconciled'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {r.reconciliation}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {r.postingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400 whitespace-nowrap">{r.receivedDate}</td>
                  <td className="py-3 px-3 text-neutral-400 whitespace-nowrap">{r.postedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of{' '}
            {filtered.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-semibold">
              {page} / {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
