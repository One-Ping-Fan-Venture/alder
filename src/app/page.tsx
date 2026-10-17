'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Banknote,
  Clock,
  AlertTriangle,
  Send,
  Calendar,
  Hourglass,
  ArrowUpRight,
  ChevronRight,
  Layers,
  FileText,
  Receipt,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function OverviewPage() {
  const { claims, remits, queues } = useApp();

  // Compute live aggregates from claims
  const paidClaims = claims.filter(c => c.status === 'paid' || c.status === 'finalized_paid');
  const deniedClaims = claims.filter(c => c.status === 'denied' || c.status === 'finalized_denied');
  const inFlightClaims = claims.filter(c => ['submitted_to_payer', 'biller_received', 'coded', 'era_received'].includes(c.status));
  const awaitingInfoClaims = claims.filter(c => ['missing_information', 'waiting_for_provider'].includes(c.status));

  const totalBilled = claims.reduce((acc, c) => acc + c.billed, 0);
  const totalPaid = paidClaims.reduce((acc, c) => acc + c.insurancePaid, 0);
  const totalPayerOutstanding = inFlightClaims.reduce((acc, c) => acc + c.claimBalance, 0);
  const totalPatientBalance = claims.reduce((acc, c) => acc + (c.patientResp - c.patientPaid), 0);

  const denialRate = ((deniedClaims.length / Math.max(1, paidClaims.length + deniedClaims.length)) * 100).toFixed(1);

  // Active open billing tasks
  const openTasks = [
    {
      id: 'tsk-1',
      title: 'Working denial',
      patient: 'Marcus Lee',
      payer: 'UnitedHealthcare',
      date: 'Sep 26, 2026',
      age: '20d ago',
      claimId: 'clm-1002',
      reason: 'Missing referral for physical therapy code 97110'
    },
    {
      id: 'tsk-2',
      title: 'Awaiting information from your clinic',
      patient: 'David Kim',
      payer: 'Aetna',
      date: 'Oct 5, 2026',
      age: '11d ago',
      claimId: 'clm-1004',
      reason: 'Rendering provider NPI missing on claim'
    },
    {
      id: 'tsk-3',
      title: 'Resolving rejection',
      patient: 'James Wong',
      payer: 'Blue Cross Blue Shield',
      date: 'Oct 2, 2026',
      age: '14d ago',
      claimId: 'clm-1007',
      reason: 'Clearinghouse rejected: subscriber member ID format'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Cash collected, claims submitted, and payer balances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/claims"
            className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <span>View All Claims</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 6 Top Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Paid */}
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Paid</span>
            <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              ${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              {paidClaims.length} payments posted
            </p>
          </div>
        </div>

        {/* Outstanding with payer */}
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Outstanding with payer</span>
            <Clock className="size-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              ${totalPayerOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              {inFlightClaims.length} awaiting response
            </p>
          </div>
        </div>

        {/* Denial rate */}
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Denial rate</span>
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {denialRate}%
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              Clean claim standard
            </p>
          </div>
        </div>

        {/* Submitted */}
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Submitted</span>
            <Send className="size-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              $1,006,100
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              1,061 claims submitted
            </p>
          </div>
        </div>

        {/* Aging over 30 days */}
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Aging over 30 days</span>
            <Calendar className="size-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              $184,146
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              178 unpaid &gt;30d
            </p>
          </div>
        </div>

        {/* Avg days to payment */}
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Avg days to payment</span>
            <Hourglass className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              20.0 d
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              Submission to 835 post
            </p>
          </div>
        </div>
      </div>

      {/* Book Snapshot & Outstanding Balance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Snapshot: Claims Mix */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Book snapshot
              </h2>
              <p className="text-xs text-neutral-500">
                Claims mix across {claims.length.toLocaleString()} active encounters
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              Live Ledger
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Paid</span>
              <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                {paidClaims.length}
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                47% of submitted book
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
              <span className="text-xs text-sky-700 dark:text-sky-400 font-medium">In flight</span>
              <div className="text-2xl font-bold text-sky-800 dark:text-sky-300 mt-1">
                {inFlightClaims.length}
              </div>
              <p className="text-[11px] text-sky-600/80 dark:text-sky-400/80 mt-0.5">
                Awaiting payer adjudication
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">Denied</span>
              <div className="text-2xl font-bold text-rose-800 dark:text-rose-300 mt-1">
                {deniedClaims.length}
              </div>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                Active appeal workflows
              </p>
            </div>
          </div>

          {/* Outstanding Balance split */}
          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Outstanding Balance Allocation
            </span>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-xs text-neutral-500">Payer Responsibility</span>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  $596,054
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-xs text-neutral-500">Patient Responsibility</span>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  $10,652
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '2%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Queue Pressure */}
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Queue pressure
                </h2>
              </div>
              <Link href="/queues" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-3 space-y-2.5">
              {queues.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {q.name}
                    </div>
                    <span className="text-[11px] text-neutral-400 truncate block">
                      ${q.totalBalance.toLocaleString()} in balance
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                      {q.totalClaims}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <Link
              href="/queues"
              className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span>Manage Work Queues</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Streams: Open Tasks & Recent Remits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Billing Tasks */}
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-500" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Open billing tasks
              </h2>
            </div>
            <span className="text-xs text-neutral-400">{openTasks.length} requiring clinic action</span>
          </div>

          <div className="mt-3 space-y-3">
            {openTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    {task.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">{task.age}</span>
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                  <span className="font-semibold">{task.patient}</span>
                  <span className="text-neutral-400">·</span>
                  <span>{task.payer}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-neutral-400">{task.date}</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{task.reason}</p>
                <div className="pt-1 flex items-center justify-end">
                  <Link
                    href={`/claims/${task.claimId}`}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Inspect Claim {task.claimId}</span>
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Remits (ERAs) */}
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Recent remits (835 ERA)
              </h2>
            </div>
            <Link href="/remits" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
              All remits
            </Link>
          </div>

          <div className="mt-3 space-y-2">
            {remits.slice(0, 5).map((remit) => (
              <div
                key={remit.id}
                className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {remit.checkNumber}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {remit.payer} · {remit.checkDate}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    ${remit.amount.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-medium text-neutral-400">
                    {remit.reconciliation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <Link
              href="/remits"
              className="text-xs text-center block text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium"
            >
              View 50 Remittances in Ledger →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
