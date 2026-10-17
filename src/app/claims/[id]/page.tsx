'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  User,
  Shield,
  Building,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Paperclip,
  History,
  CheckSquare,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

function ClaimDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { claims, updateClaimStatus } = useApp();

  const claim = claims.find((c) => c.id.toLowerCase() === id.toLowerCase());

  const [activeTab, setActiveTab] = useState<
    'properties' | 'service_lines' | 'write_offs' | 'other_claims' | 'documentation' | 'activity' | 'tasks'
  >('properties');

  const [resolveSuccess, setResolveSuccess] = useState(false);

  if (!claim) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Claim {id} Not Found</h2>
        <p className="text-sm text-neutral-500">This claim does not exist in the active demo ledger.</p>
        <Link href="/claims" className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg">
          Back to Claims
        </Link>
      </div>
    );
  }

  // Other claims for the same patient
  const otherClaims = claims.filter((c) => c.patientId === claim.patientId && c.id !== claim.id);

  const handleResolveTask = (taskTitle: string) => {
    updateClaimStatus(claim.id, 'submitted_to_payer', 'Referral attached & resubmitted to clearinghouse');
    setResolveSuccess(true);
    setTimeout(() => setResolveSuccess(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Claim ID bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/claims"
          className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Claims</span>
        </Link>

        <span className="font-mono text-xs text-neutral-400">
          EDI 837P Transaction #{claim.id.toUpperCase()}
        </span>
      </div>

      {/* Main Claim Header Card */}
      <div className="bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {claim.patientName}
              </h1>
              <StatusBadge status={claim.status} size="md" />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Date of Service: <strong className="text-neutral-800 dark:text-neutral-200">{claim.serviceDate}</strong> · Primary Payer:{' '}
              <strong className="text-neutral-800 dark:text-neutral-200">{claim.payer}</strong> ({claim.payerPlan})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Responsibility:</span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {claim.responsibility}
            </span>
          </div>
        </div>

        {/* Financial Badges Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Total Billed</span>
            <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
              ${claim.billed.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Allowed Amount</span>
            <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
              ${claim.allowed.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Insurance Paid</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              ${claim.insurancePaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Patient Resp.</span>
            <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
              ${claim.patientResp.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Patient Paid</span>
            <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
              ${claim.patientPaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
            <span className="text-neutral-400 text-[11px] block">Claim Balance</span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
              ${claim.claimBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Success toast after resolving task */}
        {resolveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Task resolved successfully! Claim status updated to Submitted to Payer.</span>
          </div>
        )}
      </div>

      {/* 7 Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto text-xs font-semibold pb-1">
        {[
          { key: 'properties', label: 'Claim properties' },
          { key: 'service_lines', label: 'Dx, Service lines & Remits' },
          { key: 'write_offs', label: 'Write offs & Patient payments' },
          { key: 'other_claims', label: `Other claims (${otherClaims.length})` },
          { key: 'documentation', label: 'Documentation' },
          { key: 'activity', label: `Activity (${claim.activity.length})` },
          { key: 'tasks', label: `Tasks (${claim.tasks.filter((t) => t.status === 'open').length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Claim Properties */}
      {activeTab === 'properties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Identity */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <User className="size-4 text-emerald-600" />
              Patient Identity
            </h3>
            <div className="space-y-2 text-xs divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Legal Name</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{claim.patientName}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Medical Record Number (MRN)</span>
                <span className="font-mono font-medium">{claim.patientMrn}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Date of Birth</span>
                <span className="font-medium">{claim.patientDob}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Address</span>
                <span className="text-right">1428 Elm Street, Apt 4B, Portland, OR 97201</span>
              </div>
            </div>
          </div>

          {/* Insurance Plan & Subscriber */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="size-4 text-sky-600" />
              Plan & Subscriber
            </h3>
            <div className="space-y-2 text-xs divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Primary Payer</span>
                <span className="font-semibold">{claim.payer}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Payer Electronic ID</span>
                <span className="font-mono">{claim.payerId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Member ID</span>
                <span className="font-mono font-medium">{claim.memberId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Group Number</span>
                <span className="font-mono">{claim.groupNumber}</span>
              </div>
            </div>
          </div>

          {/* Providers */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Building className="size-4 text-indigo-600" />
              Providers & Facility
            </h3>
            <div className="space-y-2 text-xs divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Rendering Provider</span>
                <span className="font-medium">{claim.renderingProvider}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Rendering NPI</span>
                <span className="font-mono">{claim.renderingNpi}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Billing Entity</span>
                <span>{claim.billingProvider}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Place of Service</span>
                <span className="font-medium">{claim.placeOfService}</span>
              </div>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="size-4 text-emerald-600" />
              Clinical Diagnoses (ICD-10)
            </h3>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800 text-xs">
              <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {claim.diagnosisCode}
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                {claim.diagnosisDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dx, Service Lines & Remits */}
      {activeTab === 'service_lines' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Service Lines (CPT / HCPCS)
              </h3>
              <span className="text-xs text-neutral-400">1 Itemized Line</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
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
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {claim.serviceLines.map((sl) => (
                    <tr key={sl.id}>
                      <td className="py-3 px-3 whitespace-nowrap">{sl.date}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{sl.cpt}</span>
                        <div className="text-[11px] text-neutral-400 truncate max-w-xs">{sl.desc}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">{sl.modifiers}</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{sl.diagnoses}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{sl.pos}</td>
                      <td className="py-3 px-3 text-right">{sl.qty}</td>
                      <td className="py-3 px-3 text-right font-medium">${sl.billed.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">${sl.allowed.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-medium">${sl.insPaid.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">${sl.patResp.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remittance Detail */}
          <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Electronic Remittance Advice (835 ERA)
            </h3>
            {claim.status === 'paid' || claim.status === 'finalized_paid' ? (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-xs space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Check Date</span>
                    <span className="font-semibold">Sep 27, 2026</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Check / EFT Number</span>
                    <span className="font-mono font-semibold">AET-558201</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">ERA Batch ID</span>
                    <span className="font-mono font-semibold">era-9001</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Payer Adjudication</span>
                    <span className="text-emerald-600 font-bold">Paid in Full</span>
                  </div>
                </div>
              </div>
            ) : claim.status === 'denied' ? (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs space-y-2">
                <span className="font-bold text-rose-800 dark:text-rose-300">
                  Adjudicated Denial Reason (CARC Code):
                </span>
                <p className="text-rose-700 dark:text-rose-400 font-mono">
                  CO-4: The procedure code is inconsistent with the modifier used or a required modifier is missing.
                </p>
                <p className="text-[11px] text-neutral-500">
                  Payer Claim ID: 26E00100200. Check the Tasks tab to resolve and submit an appeal.
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 py-3">
                No ERA posted yet. Claim is currently awaiting payer response.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Write offs & Patient Payments */}
      {activeTab === 'write_offs' && (
        <div className="bg-white dark:bg-neutral-850 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Payment & Adjustment History
            </h3>
            <button className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              Post Payment / Adjustment
            </button>
          </div>

          {claim.patientPaid > 0 ? (
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  Point-of-Service Patient Copay
                </span>
                <div className="text-neutral-400 text-[11px]">Paid via Credit Card · Sep 13, 2026</div>
              </div>
              <span className="font-bold text-emerald-600">${claim.patientPaid.toFixed(2)}</span>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 py-6 text-center">
              No write-offs or patient payments recorded yet for this claim.
            </p>
          )}
        </div>
      )}

      {/* Tab 4: Other Claims */}
      {activeTab === 'other_claims' && (
        <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Other Claims for {claim.patientName}
          </h3>
          {otherClaims.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4">No other claims on file for this patient.</p>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {otherClaims.map((oc) => (
                <div key={oc.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <Link href={`/claims/${oc.id}`} className="font-bold text-emerald-600 hover:underline">
                      {oc.id}
                    </Link>
                    <span className="text-neutral-400 ml-2">DOS: {oc.serviceDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={oc.status} size="sm" />
                    <span className="font-medium">${oc.billed.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Documentation */}
      {activeTab === 'documentation' && (
        <div className="bg-white dark:bg-neutral-850 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Attached Medical Records & Documentation
            </h3>
            <button className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg flex items-center gap-1.5">
              <Paperclip className="size-3.5" />
              <span>Attach File</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="size-4 text-emerald-600" />
                <div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    Clinical Encounter Note — Dr. Priya Nair
                  </div>
                  <span className="text-[10px] text-neutral-400">PDF Document · 245 KB · Signed Oct 17</span>
                </div>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer hover:underline">
                View Note
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Activity */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-neutral-850 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Audit Trail & Event Log
          </h3>
          <div className="space-y-4 pl-3 border-l-2 border-emerald-500/40 text-xs">
            {claim.activity.map((act, idx) => (
              <div key={idx} className="relative pl-3">
                <span className="absolute -left-[19px] top-1 size-2 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-neutral-900" />
                <span className="text-[11px] font-mono text-neutral-400">{act.date}</span>
                <p className="text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">{act.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white dark:bg-neutral-850 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Actionable Billing Tasks
          </h3>

          {claim.tasks.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">
              No open tasks on this claim. Clean claim status maintained.
            </p>
          ) : (
            <div className="space-y-3">
              {claim.tasks.map((task) => {
                const isOpen = task.status === 'open';
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border text-xs space-y-3 ${
                      isOpen
                        ? 'border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`size-4 ${isOpen ? 'text-amber-600' : 'text-emerald-600'}`} />
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          {task.title}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isOpen ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-300">
                      {task.description}
                    </p>

                    {task.carc && (
                      <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
                        {task.carc}
                      </div>
                    )}

                    {isOpen && (
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResolveTask(task.title)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Resolve & Resubmit to Payer</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClaimDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-neutral-400">Loading claim details...</div>}>
      <ClaimDetailContent {...props} />
    </React.Suspense>
  );
}

