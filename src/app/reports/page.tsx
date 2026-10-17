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
        'The #1 denial reason is CARC CO-16 (Missing referral) and CO-4 (Modifier missing or inconsistent) representing 21 claims ($5,320). Activating automated claim-scrubbing rule #88 reduces this to 0%.'
      );
    } else {
      setActiveInsight(
        `Analysis complete for "${q}": Average commercial payer payment turnaround is 18.2 days for Aetna, 21.4 days for BCBS, and 23.1 days for UnitedHealthcare.`
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1600px] mx-auto text-foreground">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <BarChart3 className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Reports
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Ask about your claims, charges, A/R, and encounters, or open an executive report
        </p>
      </div>

      {/* AI Query Bar */}
      <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-3">
        <div className="relative">
          <Sparkles className="size-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && query && handleRunQuery(query)}
            placeholder="Ask anything about your clinic's billing performance (e.g. 'Show A/R aging buckets over 90 days')..."
            className="w-full pl-10 pr-24 py-2.5 bg-background border border-border/80 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => query && handleRunQuery(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Query
          </button>
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Suggestions:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleRunQuery(sq)}
              className="px-2.5 py-1 rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground text-[11px] border border-border/60 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Insight Response */}
        {activeInsight && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-primary">
              <Sparkles className="size-3.5" />
              <span>Taiga Intelligence Insight</span>
            </div>
            <p className="leading-relaxed text-muted-foreground">{activeInsight}</p>
          </div>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground">Gross Collection Rate</span>
          <div className="text-xl font-bold text-foreground mt-1">
            {reportsData.kpis.grossCollectionRate}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Top quartile benchmark</span>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground">Net Collection Rate</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {reportsData.kpis.netCollectionRate}
          </div>
          <span className="text-[10px] text-muted-foreground">Target &gt;95.0%</span>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground">Days in A/R</span>
          <div className="text-xl font-bold text-foreground mt-1">
            {reportsData.kpis.daysInAR}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">-3.2d vs last month</span>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground">First-Pass Clean Rate</span>
          <div className="text-xl font-bold text-foreground mt-1">
            {reportsData.kpis.firstPassCleanClaimRate}
          </div>
          <span className="text-[10px] text-muted-foreground">968 of 1,000 clean</span>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground">Denial Rate</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {reportsData.kpis.denialRate}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Industry avg ~8-10%</span>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground">Bad Debt %</span>
          <div className="text-xl font-bold text-foreground mt-1">
            {reportsData.kpis.badDebtPercentage}
          </div>
          <span className="text-[10px] text-muted-foreground">Well under 3.0% cap</span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* A/R Aging Buckets */}
        <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                A/R Aging Distribution
              </h3>
              <p className="text-xs text-muted-foreground">Payer vs Patient balance by days outstanding</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-foreground border border-border/60">
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
                    <span className="font-semibold text-foreground">
                      {bucket.bucket}
                    </span>
                    <span className="font-bold text-foreground">
                      ${bucket.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-secondary/80 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${(bucket.payerAmount / bucket.total) * widthPct}%` }}
                      title={`Payer: $${bucket.payerAmount.toLocaleString()}`}
                    />
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: `${(bucket.patientAmount / bucket.total) * widthPct}%` }}
                      title={`Patient: $${bucket.patientAmount.toLocaleString()}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Payer: ${bucket.payerAmount.toLocaleString()}</span>
                    <span>Patient: ${bucket.patientAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6-Month Collections & Charges Trend */}
        <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Monthly Cashflow & Charges
              </h3>
              <p className="text-xs text-muted-foreground">Billed charges vs Cash collected over 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="size-2 rounded-full bg-emerald-400" /> Collected
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-muted-foreground" /> Billed
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {reportsData.monthlyCollections.map((m, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-secondary/30 border border-border/60 flex items-center justify-between text-xs">
                <div className="font-semibold text-foreground min-w-[80px]">
                  {m.month}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Gross Charges</span>
                  <span className="font-medium text-foreground">
                    ${m.billed.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Net Collected</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ${m.collected.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Denial Reason Breakdown by CARC Code */}
      <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Denials by Claim Adjustment Reason Code (CARC)
            </h3>
            <p className="text-xs text-muted-foreground">Root cause distribution of non-payable line items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {reportsData.denialsByCarc.map((carc) => (
            <div
              key={carc.code}
              className="p-3.5 rounded-xl border border-border/70 bg-secondary/30 flex flex-col justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {carc.code}
                </span>
                <p className="text-xs font-semibold text-foreground mt-2">
                  {carc.reason}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{carc.count} claims</span>
                <span className="font-bold text-rose-400">${carc.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
