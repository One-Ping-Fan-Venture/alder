'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { easternDateLabel } from '@/lib/eastern';
import {
  Gauge,
  CreditCard,
  Landmark,
  Percent,
  Send,
  Calendar,
  Hourglass,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function OverviewPage() {
  const { remits } = useApp();

  // Metrics matching live Taiga Billing demo
  const kpis = [
    {
      id: 'paid',
      label: 'Paid',
      value: '$287,303',
      subtext: 'Payments posted in the last 30 days',
      icon: CreditCard,
      sparkline: 'M0,15 L30,12 L60,18 L90,8 L120,5'
    },
    {
      id: 'outstanding',
      label: 'Outstanding with payer',
      value: '$227,005',
      subtext: '211 claims awaiting a payer response',
      icon: Landmark
    },
    {
      id: 'denial-rate',
      label: 'Denial rate',
      value: '0.6%',
      subtext: 'Share of finalized, non-snoozed claims that were denied',
      icon: Percent
    },
    {
      id: 'submitted',
      label: 'Submitted',
      value: '$1,006,100',
      subtext: '1,061 claims submitted in the last 30 days',
      icon: Send,
      sparkline: 'M0,18 L30,16 L60,10 L90,14 L120,4'
    },
    {
      id: 'aging',
      label: 'Aging over 30 days',
      value: '$184,146',
      subtext: '178 claims unpaid for more than 30 days',
      icon: Calendar
    },
    {
      id: 'days-to-payment',
      label: 'Avg days to payment',
      value: '20.0 d',
      subtext: 'Average days from submission to payment',
      icon: Hourglass
    }
  ];

  const tasks = [
    {
      id: 't-1',
      title: 'Working denial',
      meta: `Marcus Lee · UnitedHealthcare · ${easternDateLabel(-20)}`,
      age: '20d ago',
      claimId: 'clm-1002'
    },
    {
      id: 't-2',
      title: 'Awaiting information from your clinic',
      meta: `David Kim · Aetna · ${easternDateLabel(-11)}`,
      age: '11d ago',
      claimId: 'clm-1003'
    },
    {
      id: 't-3',
      title: 'Resolving rejection',
      meta: `James Wong · Blue Cross Blue Shield · ${easternDateLabel(-3)}`,
      age: '3d ago',
      claimId: 'clm-1007'
    },
    {
      id: 't-4',
      title: 'Following up with payer',
      meta: `Grace Howard · Blue Cross Blue Shield · ${easternDateLabel(-7)}`,
      age: '7d ago',
      claimId: 'clm-1011'
    },
    {
      id: 't-5',
      title: 'Resolving rejection',
      meta: 'Layla Greer · Aetna · Jul 29, 2026',
      age: 'Jul 30, 2026',
      claimId: 'clm-1015'
    }
  ];

  const recentRemits = [
    { payer: 'Aetna', amount: '$190.08' },
    { payer: 'Aetna', amount: '$142.56' },
    { payer: 'Oregon Health Plan', amount: '$237.60' },
    { payer: 'Aetna', amount: '$249.48' },
    { payer: 'Aetna', amount: '$89.10' }
  ];

  const queuePressure = [
    { name: 'Missing informati...', pct: '88%' },
    { name: 'Provider follow-up', pct: '82%' },
    { name: 'On hold', pct: '76%' },
    { name: 'Rejections', pct: '64%' },
    { name: 'ERA review', pct: '32%' }
  ];

  return (
    <div className="pb-mobile-nav flex min-h-0 flex-1 flex-col px-4 pt-4 sm:px-6 md:pb-6 claim-board-scrollbar overflow-y-auto gap-6 select-none max-w-7xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Gauge className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Cash collected, claims submitted, and payer balances.
        </p>
      </div>

      {/* 6 Top Metric KPI Cards (3x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-xs text-card-foreground flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{kpi.label}</span>
                <Icon className="size-4 text-muted-foreground/80" />
              </div>

              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {kpi.value}
                </span>
                {kpi.sparkline && (
                  <svg className="w-24 h-6 text-muted-foreground/80" viewBox="0 0 130 24" fill="none">
                    <path d={kpi.sparkline} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="120" cy="5" r="3" fill="currentColor" />
                  </svg>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {kpi.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Warning Banner */}
      <div className="text-[11px] text-muted-foreground space-y-1">
        <div>Updated 1h ago</div>
        <div className="flex items-center gap-1.5 text-amber-500/90 font-medium">
          <AlertTriangle className="size-3.5 shrink-0" />
          <span>This view may not reflect recent activity; the last refresh was more than 30 minutes ago.</span>
        </div>
      </div>

      {/* Book Snapshot Card */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs text-card-foreground">
        <h2 className="text-sm font-semibold text-foreground mb-4">Book snapshot</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Claims Mix Donut */}
          <div>
            <div className="text-xs font-medium text-foreground mb-3">Claims mix</div>
            <div className="flex items-center gap-6">
              {/* Donut representation */}
              <div className="relative size-32 shrink-0 flex items-center justify-center">
                <svg className="size-32 -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" stroke="currentColor" className="text-muted/40" strokeWidth="12" fill="none" />
                  {/* In flight: 764 (59.6%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#475569"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="238.7"
                    strokeDashoffset="96"
                  />
                  {/* Paid: 515 (40.1%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#10b981"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="238.7"
                    strokeDashoffset="143"
                  />
                  {/* Denied: 3 (0.2%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#ef4444"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="238.7"
                    strokeDashoffset="237"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-foreground leading-none">1,282</span>
                  <span className="text-[9px] tracking-wider text-muted-foreground uppercase mt-0.5 font-semibold">CLAIMS</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-xs bg-emerald-500" />
                  <span className="text-muted-foreground w-14">Paid</span>
                  <span className="font-semibold text-foreground">515</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-xs bg-rose-500" />
                  <span className="text-muted-foreground w-14">Denied</span>
                  <span className="font-semibold text-foreground">3</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-xs bg-slate-500" />
                  <span className="text-muted-foreground w-14">In flight</span>
                  <span className="font-semibold text-foreground">764</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Outstanding Balance */}
          <div>
            <div className="text-xs font-medium text-foreground mb-3">Outstanding balance</div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex">
              <div className="bg-foreground h-full" style={{ width: '98%' }} />
              <div className="bg-muted-foreground/60 h-full" style={{ width: '2%' }} />
            </div>
            <div className="flex items-center justify-between text-xs mt-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-xs bg-foreground" />
                <span className="text-muted-foreground">Payer</span>
                <span className="font-semibold text-foreground">$596,054</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-xs bg-muted-foreground/60" />
                <span className="text-muted-foreground">Patient</span>
                <span className="font-semibold text-foreground">$10,652</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs text-card-foreground space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Activity</h2>
          <div className="text-xs text-muted-foreground mt-1 font-medium">Open billing tasks</div>
        </div>

        <div className="divide-y divide-border/60">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/claims/${task.claimId}`}
              className="py-3 flex items-center justify-between hover:bg-muted/30 px-2 rounded-lg transition-colors group"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {task.title}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {task.meta}
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-4">
                {task.age}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Row: Recent Remits & Queue Pressure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent remits */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-foreground">Recent remits</h2>
            <Link
              href="/remits"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium transition-colors"
            >
              <span>All remits</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            {recentRemits.map((r, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <span className="text-foreground">{r.payer}</span>
                <span className="font-semibold text-foreground">{r.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Queue pressure */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-foreground">Queue pressure</h2>
            <Link
              href="/queues"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium transition-colors"
            >
              <span>Work queues</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {queuePressure.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-36 text-muted-foreground truncate">{q.name}</span>
                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-foreground/90 h-full rounded-full transition-all"
                    style={{ width: q.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
