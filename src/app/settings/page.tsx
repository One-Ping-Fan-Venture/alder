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
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function SettingsPage() {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<
    'providers' | 'facilities' | 'credentialing' | 'contracts' | 'fee_schedules' | 'bank' | 'invoices'
  >('providers');

  const [revealedTaxIds, setRevealedTaxIds] = useState<{ [id: string]: boolean }>({});

  const toggleTaxId = (id: string) => {
    setRevealedTaxIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const tabs = [
    { key: 'providers', label: 'Providers' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'credentialing', label: 'Credentialing' },
    { key: 'contracts', label: 'Contracts' },
    { key: 'fee_schedules', label: 'Fee schedules' },
    { key: 'bank', label: 'Bank reconciliation' },
    { key: 'invoices', label: 'Invoices' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1600px] mx-auto text-foreground">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Settings2 className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Settings & configuration
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Manage clinic providers, service facilities, payer credentialing, fee schedules, and banking
        </p>
      </div>

      {/* Pill Tab Bar Container */}
      <div className="bg-secondary/50 p-1 rounded-xl border border-border/80 flex items-center gap-1 overflow-x-auto shadow-xs text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-xs font-medium ${
              activeTab === tab.key
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Providers */}
      {activeTab === 'providers' && (
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Rendering & Billing Providers
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Active clinical providers registered under Northstar Family Health NPI #1982744321
              </p>
            </div>
            <button
              onClick={() => alert('Add provider modal.')}
              className="px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-1 shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Add Provider</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Provider</th>
                  <th className="py-2.5 px-3 font-semibold font-mono">Individual NPI</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Specialty</th>
                  <th className="py-2.5 px-3 font-semibold">Tax ID</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {settings.providers.map((p) => {
                  const isRevealed = revealedTaxIds[p.id];
                  return (
                    <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-3 font-bold text-foreground">
                        {p.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {p.npi}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{p.type}</td>
                      <td className="py-3 px-3 font-medium text-foreground">
                        {p.specialty}
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{isRevealed ? p.taxId : '••• 0094'}</span>
                          <button
                            type="button"
                            onClick={() => toggleTaxId(p.id)}
                            className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                            title={isRevealed ? 'Mask Tax ID' : 'Reveal Tax ID'}
                          >
                            {isRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Facilities */}
      {activeTab === 'facilities' && (
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Service Facilities & Practice Locations
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Physical clinic locations, Place of Service (POS) codes, and CLIA IDs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.facilities.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-border/70 bg-secondary/30 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-foreground text-sm">
                    {f.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-foreground border border-border/70">
                    POS {f.pos.split(' - ')[0]}
                  </span>
                </div>
                <div className="text-muted-foreground">{f.address}</div>
                <div className="flex justify-between pt-2 border-t border-border/50 text-muted-foreground font-mono text-[11px]">
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
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            Payer Credentialing & Network Enrollment
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Payer Network</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Effective Date</th>
                  <th className="py-2.5 px-3 font-semibold">Re-Credentialing Due</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Roster Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {settings.credentialing.map((c, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {c.payer}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{c.effectiveDate}</td>
                    <td className="py-3 px-3 text-muted-foreground">{c.renewalDate}</td>
                    <td className="py-3 px-3 text-right font-bold text-foreground">{c.providerCount} MDs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Contracts */}
      {activeTab === 'contracts' && (
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            Commercial Payer Contracts & Timely Filing Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.contracts.map((c, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/70 bg-secondary/30 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-foreground">{c.payer}</h3>
                  <span className="font-mono text-muted-foreground text-[11px]">{c.contractCode}</span>
                </div>
                <div className="text-muted-foreground">
                  <span>Reimbursement Rate: </span>
                  <strong className="text-foreground">{c.feeSchedule}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground pt-2 border-t border-border/50 text-[11px]">
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
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            CPT Master Chargemaster vs Payer Allowables
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">CPT Code</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 text-right font-semibold">RVU</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Chargemaster Rate</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Aetna Allowable</th>
                  <th className="py-2.5 px-3 text-right font-semibold">BCBS Allowable</th>
                  <th className="py-2.5 px-3 text-right font-semibold">UHC Allowable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {settings.feeSchedules.map((fs) => (
                  <tr key={fs.cpt} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {fs.cpt}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{fs.description}</td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">{fs.rvu}</td>
                    <td className="py-3 px-3 text-right font-bold text-foreground">${fs.chargemaster.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-medium">
                      ${fs.aetnaAllowable.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-sky-400 font-medium">
                      ${fs.bcbsAllowable.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-indigo-400 font-medium">
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
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            Operating Bank Accounts & Deposit Matching
          </h2>
          <div className="p-4 rounded-xl border border-border/70 bg-secondary/30 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-foreground text-sm">
                  {settings.bankReconciliation.accountName}
                </span>
                <div className="font-mono text-muted-foreground mt-0.5">
                  Account: {settings.bankReconciliation.accountNumber} · Routing: {settings.bankReconciliation.routingNumber}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            <div className="pt-2 border-t border-border/50 flex justify-between items-center">
              <span className="text-muted-foreground">Auto-match ERA 835 check deposits</span>
              <span className="font-bold text-emerald-400">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Unmatched deposits requiring review</span>
              <span className="font-bold text-amber-400">
                {settings.bankReconciliation.unmatchedDeposits} deposits (${settings.bankReconciliation.unmatchedAmount.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            Automated Patient Invoicing & Reminders
          </h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border/70 bg-secondary/30 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-primary" />
              <div>
                <span className="font-semibold block text-foreground">
                  Send SMS text invoice links upon 835 ERA adjudication
                </span>
                <span className="text-muted-foreground text-[11px]">
                  Text messages include a secure 1-click Apple Pay / card link
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-border/70 bg-secondary/30 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-primary" />
              <div>
                <span className="font-semibold block text-foreground">
                  Email digital statements after 14-day grace period
                </span>
                <span className="text-muted-foreground text-[11px]">
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
