'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Settings2,
  Users,
  Building2,
  ShieldCheck,
  FileCheck2,
  TableProperties,
  Landmark,
  Receipt,
  Plus,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<
    'providers' | 'facilities' | 'credentialing' | 'contracts' | 'fee_schedules' | 'bank' | 'invoices'
  >('providers');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings2 className="size-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Settings & configuration
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Manage clinic providers, service facilities, payer credentialing, fee schedules, and banking.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto text-xs font-semibold pb-1">
        {[
          { key: 'providers', label: 'Providers', icon: Users },
          { key: 'facilities', label: 'Facilities', icon: Building2 },
          { key: 'credentialing', label: 'Credentialing', icon: ShieldCheck },
          { key: 'contracts', label: 'Contracts', icon: FileCheck2 },
          { key: 'fee_schedules', label: 'Fee schedules', icon: TableProperties },
          { key: 'bank', label: 'Bank reconciliation', icon: Landmark },
          { key: 'invoices', label: 'Invoices', icon: Receipt }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Providers */}
      {activeTab === 'providers' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Rendering & Billing Providers
              </h2>
              <p className="text-xs text-neutral-400">
                Active clinical providers registered under Northstar Family Health NPI #1982744321
              </p>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1 shadow-xs">
              <Plus className="size-3.5" />
              <span>Add Provider</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3 font-mono">Individual NPI</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Specialty</th>
                  <th className="py-2.5 px-3">Tax ID</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {settings.providers.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-600 dark:text-neutral-300">
                      {p.npi}
                    </td>
                    <td className="py-3 px-3 text-neutral-500">{p.type}</td>
                    <td className="py-3 px-3 font-medium text-neutral-700 dark:text-neutral-300">
                      {p.specialty}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-400">{p.taxId}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Facilities */}
      {activeTab === 'facilities' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Service Facilities & Practice Locations
              </h2>
              <p className="text-xs text-neutral-400">
                Physical clinic locations, Place of Service (POS) codes, and CLIA IDs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.facilities.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                    {f.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 dark:bg-neutral-700">
                    POS {f.pos.split(' - ')[0]}
                  </span>
                </div>
                <div className="text-neutral-500">{f.address}</div>
                <div className="flex justify-between pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-neutral-400 font-mono">
                  <span>Facility NPI: {f.npi}</span>
                  <span>CLIA: {f.clia}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Credentialing */}
      {activeTab === 'credentialing' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Payer Credentialing & Network Enrollment
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Payer Network</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Effective Date</th>
                  <th className="py-2.5 px-3">Re-Credentialing Due</th>
                  <th className="py-2.5 px-3 text-right">Roster Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {settings.credentialing.map((c, i) => (
                  <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      {c.payer}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">{c.effectiveDate}</td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">{c.renewalDate}</td>
                    <td className="py-3 px-3 text-right font-bold">{c.providerCount} MDs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Contracts */}
      {activeTab === 'contracts' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Commercial Payer Contracts & Timely Filing Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.contracts.map((c, i) => (
              <div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{c.payer}</h3>
                  <span className="font-mono text-neutral-400 text-[11px]">{c.contractCode}</span>
                </div>
                <div className="text-neutral-600 dark:text-neutral-300">
                  <span className="text-neutral-400">Reimbursement Rate: </span>
                  <strong>{c.feeSchedule}</strong>
                </div>
                <div className="flex justify-between text-neutral-500 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px]">
                  <span>Timely Filing: {c.timelyFilingDays} days</span>
                  <span>Appeal Window: {c.appealWindowDays} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Fee Schedules */}
      {activeTab === 'fee_schedules' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            CPT Master Chargemaster vs Payer Allowables
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">CPT Code</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">RVU</th>
                  <th className="py-2.5 px-3 text-right">Chargemaster Rate</th>
                  <th className="py-2.5 px-3 text-right">Aetna Allowable</th>
                  <th className="py-2.5 px-3 text-right">BCBS Allowable</th>
                  <th className="py-2.5 px-3 text-right">UHC Allowable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {settings.feeSchedules.map((fs) => (
                  <tr key={fs.cpt} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {fs.cpt}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">{fs.description}</td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-400">{fs.rvu}</td>
                    <td className="py-3 px-3 text-right font-bold">${fs.chargemaster.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-medium">
                      ${fs.aetnaAllowable.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-sky-600 font-medium">
                      ${fs.bcbsAllowable.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-indigo-600 font-medium">
                      ${fs.uhcAllowable.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Bank Reconciliation */}
      {activeTab === 'bank' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Operating Bank Accounts & Deposit Matching
          </h2>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  {settings.bankReconciliation.accountName}
                </span>
                <div className="font-mono text-neutral-400">
                  Account: {settings.bankReconciliation.accountNumber} · Routing: {settings.bankReconciliation.routingNumber}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                CONNECTED
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-750 flex justify-between items-center">
              <span className="text-neutral-500">Auto-match ERA 835 check deposits</span>
              <span className="font-bold text-emerald-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Unmatched deposits requiring review</span>
              <span className="font-bold text-amber-600">
                {settings.bankReconciliation.unmatchedDeposits} deposits (${settings.bankReconciliation.unmatchedAmount.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Automated Patient Invoicing & Reminders
          </h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/30">
              <input type="checkbox" defaultChecked className="rounded" />
              <div>
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Send SMS text invoice links upon 835 ERA adjudication
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Text messages include a secure 1-click Apple Pay/card link
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/30">
              <input type="checkbox" defaultChecked className="rounded" />
              <div>
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Email digital statements after 14-day grace period
                </span>
                <span className="text-neutral-400 text-[11px]">
                  PDF statement delivered with itemized CPT service charges and insurance adjustments
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
