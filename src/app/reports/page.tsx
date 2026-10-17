'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BarChart3,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import reportsData from '@/data/reports.json';

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const sampleQueries = [
    'What is our net collection rate this quarter?',
    'Show A/R aging buckets over 90 days',
    'Break down top denial reasons by CARC code',
    'Compare Aetna vs UHC average reimbursement latency'
  ];

  const handleRunQuery = (q: string) => {
    setQuery(q);
    if (q.includes('net collection')) {
      setActiveInsight(
        'Northstar Family Health achieved a 98.7% net collection rate in Q3 2026, exceeding the MGMA top-quartile benchmark of 95%. Total contractual adjustments were $651,000 against $1,006,100 in submitted gross charges.'
      );
    } else if (q.includes('aging')) {
      setActiveInsight(
        'A/R over 90 days accounts for $47,706 (7.9% of total A/R), with the majority tied to Medicaid CCO secondary claims awaiting payer cross-over adjudication.'
      );
    } else if (q.includes('denial')) {
      setActiveInsight(
        'The #1 denial reason is CARC CO-4 (Modifier missing or inconsistent) representing 18 claims ($4,200). Activating automated claim-scrubbing rule #88 reduces this to 0%.'
      );
    } else {
      setActiveInsight(
        `Analysis complete for "${q}": Average commercial payer payment turnaround is 18.2 days for Aetna, 21.4 days for BCBS, and 23.1 days for UnitedHealthcare.`
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="size-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Reports
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Ask about your claims, charges, A/R, and encounters, or open an executive report.
        </p>
      </div>

      {/* AI Query Bar */}
      <div className="bg-white dark:bg-neutral-850 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="relative">
          <Sparkles className="size-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && query && handleRunQuery(query)}
            placeholder="Ask anything about your clinic's billing performance (e.g. 'Show A/R aging buckets over 90 days')..."
            className="w-full pl-10 pr-24 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            onClick={() => query && handleRunQuery(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Query
          </button>
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-neutral-400">Suggestions:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleRunQuery(sq)}
              className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-600 dark:text-neutral-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-[11px] border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Insight Response */}
        {activeInsight && (
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="size-3.5" />
              <span>Taiga Intelligence Insight</span>
            </div>
            <p className="leading-relaxed">{activeInsight}</p>
          </div>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">Gross Collection Rate</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {reportsData.kpis.grossCollectionRate}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Top quartile benchmark</span>
        </div>
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">Net Collection Rate</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {reportsData.kpis.netCollectionRate}
          </div>
          <span className="text-[10px] text-neutral-400">Target &gt;95.0%</span>
        </div>
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">Days in A/R</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {reportsData.kpis.daysInAR}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">-3.2d vs last month</span>
        </div>
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">First-Pass Clean Rate</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {reportsData.kpis.firstPassCleanClaimRate}
          </div>
          <span className="text-[10px] text-neutral-400">968 of 1,000 clean</span>
        </div>
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">Denial Rate</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {reportsData.kpis.denialRate}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Industry avg ~8-10%</span>
        </div>
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">Bad Debt %</span>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {reportsData.kpis.badDebtPercentage}
          </div>
          <span className="text-[10px] text-neutral-400">Well under 3.0% cap</span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A/R Aging Buckets */}
        <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                A/R Aging Distribution
              </h3>
              <p className="text-xs text-neutral-400">Payer vs Patient balance by days outstanding</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              Total: $606,706
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {reportsData.agingBuckets.map((bucket, i) => {
              const maxVal = 400000;
              const widthPct = Math.min(100, Math.round((bucket.total / maxVal) * 100));
              return (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {bucket.bucket}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      ${bucket.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${(bucket.payerAmount / bucket.total) * widthPct}%` }}
                      title={`Payer: $${bucket.payerAmount.toLocaleString()}`}
                    />
                    <div
                      className="bg-sky-400 h-full"
                      style={{ width: `${(bucket.patientAmount / bucket.total) * widthPct}%` }}
                      title={`Patient: $${bucket.patientAmount.toLocaleString()}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Payer: ${bucket.payerAmount.toLocaleString()}</span>
                    <span>Patient: ${bucket.patientAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6-Month Collections & Charges Trend */}
        <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Monthly Cashflow & Charges
              </h3>
              <p className="text-xs text-neutral-400">Billed charges vs Cash collected over 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="size-2 rounded-full bg-emerald-600" /> Collected
              </span>
              <span className="flex items-center gap-1 text-neutral-400">
                <span className="size-2 rounded-full bg-neutral-400" /> Billed
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {reportsData.monthlyCollections.map((m, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 min-w-[80px]">
                  {m.month}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Gross Charges</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    ${m.billed.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Net Collected</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ${m.collected.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Denial Reason Breakdown by CARC Code */}
      <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Denials by Claim Adjustment Reason Code (CARC)
            </h3>
            <p className="text-xs text-neutral-400">Root cause distribution of non-payable line items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {reportsData.denialsByCarc.map((carc) => (
            <div
              key={carc.code}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 flex flex-col justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {carc.code}
                </span>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-2">
                  {carc.reason}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-neutral-400">{carc.count} claims</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">${carc.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
