'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  User,
  Shield,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Paperclip,
  ExternalLink,
  Sparkles,
  Clock,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

function ClaimDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { claims, updateClaimStatus } = useApp();

  const claim = claims.find((c) => c.id.toLowerCase() === id.toLowerCase());

  const [leftTab, setLeftTab] = useState<
    'properties' | 'service_lines' | 'write_offs' | 'other_claims' | 'documentation'
  >('properties');

  const [rightTab, setRightTab] = useState<'tasks' | 'activity'>('tasks');
  const [resolveSuccess, setResolveSuccess] = useState(false);

  if (!claim) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Claim {id} Not Found</h2>
        <p className="text-sm text-muted-foreground">This claim does not exist in the active demo ledger.</p>
        <Link href="/claims" className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
          Back to Claims
        </Link>
      </div>
    );
  }

  // Other claims for the same patient
  const otherClaims = claims.filter((c) => c.patientId === claim.patientId && c.id !== claim.id);
  const openTasks = claim.tasks.filter((t) => t.status === 'open');

  const handleResolveTask = (taskTitle: string) => {
    updateClaimStatus(claim.id, 'submitted_to_payer', 'Referral attached & resubmitted to clearinghouse');
    setResolveSuccess(true);
    setTimeout(() => setResolveSuccess(false), 5000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1600px] mx-auto text-foreground">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/claims"
            className="font-medium hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Claims</span>
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/50" />
          <span className="font-semibold text-foreground">{claim.patientName}</span>
          <span className="font-mono text-[11px] text-muted-foreground/70">({claim.id.toUpperCase()})</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/claims/${claim.id}/cms-1500`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <FileText className="size-3.5 text-primary" />
            <span>View CMS-1500</span>
          </Link>
          <button
            onClick={() => router.push('/appointments')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <span>View patient</span>
            <ExternalLink className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Claim Header Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {claim.patientName}
              </h1>
              <StatusBadge status={claim.status} size="md" />
              {claim.status.toLowerCase() === 'denied' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="size-3 shrink-0" />
                  Owner: Needs your attention
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground mt-1.5">
              <span>Date of Service: <strong className="text-foreground">{claim.serviceDate}</strong></span>
              <span>•</span>
              <span>Primary Payer: <strong className="text-foreground">{claim.payer}</strong> ({claim.payerPlan})</span>
              <span>•</span>
              <span>Member ID: <span className="font-mono text-foreground">{claim.memberId}</span></span>
              <span>•</span>
              <span>Responsibility: <strong className="text-foreground">{claim.responsibility}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">EDI 837P #{claim.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Financial Badges Summary (6 Tiles) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Total Billed</span>
            <span className="text-base font-bold text-foreground mt-0.5 block">
              ${claim.billed.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Allowed Amount</span>
            <span className="text-base font-bold text-foreground mt-0.5 block">
              ${claim.allowed.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Insurance Paid</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              ${claim.insurancePaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Patient Resp.</span>
            <span className="text-base font-bold text-foreground mt-0.5 block">
              ${claim.patientResp.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Patient Paid</span>
            <span className="text-base font-bold text-foreground mt-0.5 block">
              ${claim.patientPaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Claim Balance</span>
            <span className={`text-base font-bold mt-0.5 block ${claim.claimBalance > 0 ? 'text-rose-400' : 'text-foreground'}`}>
              ${claim.claimBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Success toast after resolving task */}
        {resolveSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>Task resolved successfully! Missing referral attached and claim resubmitted to clearinghouse.</span>
          </div>
        )}
      </div>

      {/* 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)] gap-5 items-start">
        {/* Left Column: Tabbed Claim Details (~68% width) */}
        <div className="space-y-4 min-w-0">
          {/* Sub-tabs Navigation */}
          <div className="flex items-center gap-1 border-b border-border/70 overflow-x-auto text-xs font-medium pb-2 scrollbar-none">
            {[
              { key: 'properties', label: 'Claim properties' },
              { key: 'service_lines', label: 'Dx, Service lines & Remits' },
              { key: 'write_offs', label: 'Write offs & Patient payments' },
              { key: 'other_claims', label: `Other claims (${otherClaims.length})` },
              { key: 'documentation', label: 'Documentation' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setLeftTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs font-medium ${
                  leftTab === tab.key
                    ? 'bg-secondary text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Left Tab 1: Claim Properties */}
          {leftTab === 'properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Identity */}
              <div className="bg-card p-4 rounded-xl border border-border/80 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <User className="size-3.5 text-primary" />
                  Patient Identity
                </h3>
                <div className="space-y-2 text-xs divide-y divide-border/50">
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Legal Name</span>
                    <span className="font-semibold text-foreground">{claim.patientName}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Medical Record Number (MRN)</span>
                    <span className="font-mono font-medium text-foreground">{claim.patientMrn}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Date of Birth</span>
                    <span className="font-medium text-foreground">{claim.patientDob}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-right text-foreground">1428 Elm Street, Apt 4B, Portland, OR</span>
                  </div>
                </div>
              </div>

              {/* Insurance Plan & Subscriber */}
              <div className="bg-card p-4 rounded-xl border border-border/80 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Shield className="size-3.5 text-primary" />
                  Plan & Subscriber
                </h3>
                <div className="space-y-2 text-xs divide-y divide-border/50">
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Primary Payer</span>
                    <span className="font-semibold text-foreground">{claim.payer}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Payer Electronic ID</span>
                    <span className="font-mono text-foreground">{claim.payerId}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Member ID</span>
                    <span className="font-mono font-medium text-foreground">{claim.memberId}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Group Number</span>
                    <span className="font-mono text-foreground">{claim.groupNumber}</span>
                  </div>
                </div>
              </div>

              {/* Providers & Facility */}
              <div className="bg-card p-4 rounded-xl border border-border/80 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Building className="size-3.5 text-primary" />
                  Providers & Facility
                </h3>
                <div className="space-y-2 text-xs divide-y divide-border/50">
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Rendering Provider</span>
                    <span className="font-medium text-foreground">{claim.renderingProvider}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Rendering NPI</span>
                    <span className="font-mono text-foreground">{claim.renderingNpi}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Billing Entity</span>
                    <span className="text-foreground">{claim.billingProvider}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Place of Service</span>
                    <span className="font-medium text-foreground">{claim.placeOfService}</span>
                  </div>
                </div>
              </div>

              {/* Diagnoses */}
              <div className="bg-card p-4 rounded-xl border border-border/80 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="size-3.5 text-primary" />
                  Clinical Diagnoses (ICD-10)
                </h3>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/60 text-xs">
                  <div className="font-mono font-bold text-primary">
                    {claim.diagnosisCode}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {claim.diagnosisDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Left Tab 2: Dx, Service Lines & Remits */}
          {leftTab === 'service_lines' && (
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border/80 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="text-xs font-bold text-foreground">
                    Service Lines (CPT / HCPCS)
                  </h3>
                  <span className="text-[11px] text-muted-foreground">1 Itemized Line</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">CPT Code</th>
                        <th className="py-2.5 px-3">Modifiers</th>
                        <th className="py-2.5 px-3">Diagnoses</th>
                        <th className="py-2.5 px-3">POS</th>
                        <th className="py-2.5 px-3 text-right">Qty</th>
                        <th className="py-2.5 px-3 text-right">Billed</th>
                        <th className="py-2.5 px-3 text-right">Allowed</th>
                        <th className="py-2.5 px-3 text-right">Ins. Paid</th>
                        <th className="py-2.5 px-3 text-right">Pat. Resp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {claim.serviceLines.map((sl) => (
                        <tr key={sl.id} className="hover:bg-secondary/20">
                          <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">{sl.date}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-foreground">{sl.cpt}</span>
                            <div className="text-[11px] text-muted-foreground truncate max-w-xs">{sl.desc}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground">{sl.modifiers}</td>
                          <td className="py-3 px-3 font-mono text-primary font-bold">{sl.diagnoses}</td>
                          <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">{sl.pos}</td>
                          <td className="py-3 px-3 text-right text-muted-foreground">{sl.qty}</td>
                          <td className="py-3 px-3 text-right font-medium text-foreground">${sl.billed.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right text-muted-foreground">${sl.allowed.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-medium">${sl.insPaid.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right text-muted-foreground">${sl.patResp.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remittance Detail */}
              <div className="bg-card rounded-xl border border-border/80 p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-foreground">
                  Electronic Remittance Advice (835 ERA)
                </h3>
                {claim.status === 'paid' || claim.status === 'finalized_paid' ? (
                  <div className="p-3.5 rounded-lg bg-secondary/30 border border-border/60 text-xs space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Check Date</span>
                        <span className="font-semibold text-foreground">Sep 27, 2026</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Check / EFT Number</span>
                        <span className="font-mono font-semibold text-foreground">AET-558201</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">ERA Batch ID</span>
                        <span className="font-mono font-semibold text-foreground">era-9001</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Payer Adjudication</span>
                        <span className="text-emerald-400 font-bold">Paid in Full</span>
                      </div>
                    </div>
                  </div>
                ) : claim.status === 'denied' ? (
                  <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
                    <span className="font-bold text-rose-300">
                      Adjudicated Denial Reason (CARC Code):
                    </span>
                    <p className="text-rose-400 font-mono text-[11px]">
                      CO-16: Claim/service lacks information or has submission/billing error(s). Missing prior authorization or specialist referral.
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Payer Claim ID: 26E00100200. Check the Tasks tab on the right to resolve and resubmit.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-2">
                    No ERA posted yet. Claim is currently awaiting payer response.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Left Tab 3: Write offs & Patient Payments */}
          {leftTab === 'write_offs' && (
            <div className="bg-card p-5 rounded-xl border border-border/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground">
                  Payment & Adjustment History
                </h3>
                <button className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20">
                  Post Payment / Adjustment
                </button>
              </div>

              {claim.patientPaid > 0 ? (
                <div className="p-3 rounded-lg border border-border/70 bg-secondary/30 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-foreground">
                      Point-of-Service Patient Copay
                    </span>
                    <div className="text-muted-foreground text-[11px]">Paid via Credit Card · Sep 13, 2026</div>
                  </div>
                  <span className="font-bold text-emerald-400">${claim.patientPaid.toFixed(2)}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No write-offs or patient payments recorded yet for this claim.
                </p>
              )}
            </div>
          )}

          {/* Left Tab 4: Other Claims */}
          {leftTab === 'other_claims' && (
            <div className="bg-card p-5 rounded-xl border border-border/80 space-y-3">
              <h3 className="text-xs font-bold text-foreground">
                Other Claims for {claim.patientName}
              </h3>
              {otherClaims.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4">No other claims on file for this patient.</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {otherClaims.map((oc) => (
                    <div key={oc.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <Link href={`/claims/${oc.id}`} className="font-bold text-primary hover:underline">
                          {oc.id}
                        </Link>
                        <span className="text-muted-foreground ml-2">DOS: {oc.serviceDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={oc.status} size="sm" />
                        <span className="font-medium text-foreground">${oc.billed.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Left Tab 5: Documentation */}
          {leftTab === 'documentation' && (
            <div className="bg-card p-5 rounded-xl border border-border/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground">
                  Attached Medical Records & Documentation
                </h3>
                <button className="px-2.5 py-1 text-xs font-medium bg-secondary hover:bg-secondary/80 rounded-lg flex items-center gap-1.5 text-foreground">
                  <Paperclip className="size-3 text-muted-foreground" />
                  <span>Attach File</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border border-border/70 bg-secondary/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-primary shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">
                        Clinical Encounter Note — Dr. Priya Nair
                      </div>
                      <span className="text-[10px] text-muted-foreground">PDF Document · 245 KB · Signed Oct 17</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-primary font-semibold cursor-pointer hover:underline">
                    View Note
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Persistent Activity & Tasks Sidebar (~32% width) */}
        <div className="space-y-4 min-w-0">
          <div className="bg-card rounded-xl border border-border/80 p-4 shadow-xs space-y-4">
            {/* Header with Segmented Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-lg border border-border/60">
                <button
                  onClick={() => setRightTab('tasks')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    rightTab === 'tasks'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tasks ({openTasks.length})
                </button>
                <button
                  onClick={() => setRightTab('activity')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    rightTab === 'activity'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Activity ({claim.activity.length})
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">Live Sync</span>
            </div>

            {/* Right Tab Content: Tasks */}
            {rightTab === 'tasks' && (
              <div className="space-y-3">
                {claim.tasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                    <CheckCircle2 className="size-5 text-emerald-400 mx-auto mb-2" />
                    <p className="font-medium text-foreground">No open tasks</p>
                    <p className="text-[11px]">This claim has no active rejections or pending action items.</p>
                  </div>
                ) : (
                  claim.tasks.map((task) => {
                    const isOpen = task.status === 'open';
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-3 ${
                          isOpen
                            ? 'border-amber-500/30 bg-amber-500/10'
                            : 'border-emerald-500/30 bg-emerald-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className={`size-3.5 ${isOpen ? 'text-amber-400' : 'text-emerald-400'}`} />
                            <span className="font-bold text-foreground">
                              {task.title}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOpen ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {task.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          {task.description}
                        </p>

                        {task.carc && (
                          <div className="p-2 rounded bg-background/80 border border-border/60 text-[11px] font-mono text-muted-foreground">
                            {task.carc}
                          </div>
                        )}

                        {/* Copilot Recommendation Box */}
                        {isOpen && (
                          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-[11px] space-y-1.5">
                            <div className="flex items-center gap-1.5 font-semibold text-primary">
                              <Sparkles className="size-3 text-primary" />
                              <span>Alder Copilot Recommendation</span>
                            </div>
                            <p className="text-muted-foreground text-[10.5px]">
                              Found signed physician referral in EHR documents. Auto-attach to Box 17 and resubmit EDI 837P.
                            </p>
                          </div>
                        )}

                        {isOpen && (
                          <div className="pt-1 flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleResolveTask(task.title)}
                              className="w-full py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Resolve & Resubmit</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Right Tab Content: Activity */}
            {rightTab === 'activity' && (
              <div className="space-y-4 pl-2 text-xs">
                <div className="relative pl-4 border-l border-border/80 space-y-4">
                  {claim.activity.map((act, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-primary ring-4 ring-card" />
                      <div className="flex items-center gap-2 text-[10.5px] font-mono text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{act.date}</span>
                      </div>
                      <p className="text-foreground font-medium text-xs mt-0.5">{act.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading claim details...</div>}>
      <ClaimDetailContent {...props} />
    </React.Suspense>
  );
}
