'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  FileCode,
  UserCheck
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function QueuesPage() {
  const { queues, claims } = useApp();
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(queues[0]?.id || null);

  const selectedQueue = queues.find((q) => q.id === selectedQueueId) || queues[0];

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

  const totalAllClaims = queues.reduce((acc, q) => acc + q.totalClaims, 0);
  const totalAllBalance = queues.reduce((acc, q) => acc + q.totalBalance, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Work Queues
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Categorized operational queues to identify and prevent revenue leakage.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-white dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <span>Active Queue Claims: </span>
            <strong className="text-neutral-900 dark:text-neutral-100 font-bold ml-1">
              {totalAllClaims}
            </strong>
          </div>
          <div className="px-3 py-1.5 bg-white dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <span>At-Risk Balance: </span>
            <strong className="text-rose-600 dark:text-rose-400 font-bold ml-1">
              ${totalAllBalance.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Queues Table */}
      <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-3">Queue</th>
                <th className="py-2.5 px-3 text-right">Total claims</th>
                <th className="py-2.5 px-3 text-right">Total balance</th>
                <th className="py-2.5 px-3 text-center">Taiga review</th>
                <th className="py-2.5 px-3 text-center">Clinic action</th>
                <th className="py-2.5 px-3 text-right">Snoozed claims</th>
                <th className="py-2.5 px-3 text-right">Snoozed balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {queues.map((q) => {
                const isSelected = selectedQueueId === q.id;
                return (
                  <tr
                    key={q.id}
                    onClick={() => setSelectedQueueId(q.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {q.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 max-w-md truncate">
                        {q.description}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-neutral-900 dark:text-neutral-100">
                      {q.totalClaims}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      ${q.totalBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {q.taigaReview}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {q.clinicAction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-neutral-500 font-mono">
                      {q.snoozedClaims}
                    </td>
                    <td className="py-3 px-3 text-right text-neutral-400">
                      ${q.snoozedBalance.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Queue Claims Drilldown */}
      {selectedQueue && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                Active Queue Drilldown
              </span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                {selectedQueue.name}
              </h2>
              <p className="text-xs text-neutral-500">{selectedQueue.description}</p>
            </div>
            <Link
              href="/claims"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Open in Claims view</span>
              <ChevronRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {queueClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/claims/${claim.id}`}
                      className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-emerald-600 hover:underline"
                    >
                      {claim.patientName}
                    </Link>
                    <span className="font-mono text-neutral-400 text-[11px]">{claim.id}</span>
                    <StatusBadge status={claim.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {claim.payer} · DOS: {claim.serviceDate} · CPT: {claim.cptCode}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-neutral-400 text-[10px] block">Claim Balance</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      ${claim.claimBalance.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/claims/${claim.id}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
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
