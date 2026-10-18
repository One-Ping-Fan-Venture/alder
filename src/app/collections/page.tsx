'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CircleDollarSign,
  MessageSquare,
  CheckCircle2,
  Send,
  X,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react';

export default function CollectionsPage() {
  const { patients } = useApp();

  const [balances, setBalances] = useState([
    {
      id: 'bal-1',
      patient: 'Amelia Ross',
      patientId: 'pat-amelia-ross',
      owes: 42.5,
      dos: 'Sep 30, 2026',
      payer: 'Aetna',
      contact: 'Email & SMS',
      lastContact: 'Never',
      status: 'Ready to request',
      phone: '(503) 555-0194'
    },
    {
      id: 'bal-2',
      patient: 'Marcus Lee',
      patientId: 'pat-marcus-lee',
      owes: 128.0,
      dos: 'Sep 24, 2026',
      payer: 'UnitedHealthcare',
      contact: 'Email & Phone',
      lastContact: 'Phone call 4d ago',
      status: 'Ready to request',
      phone: '(503) 555-0455'
    },
    {
      id: 'bal-3',
      patient: 'Sofia Mendez',
      patientId: 'pat-sofia-mendez',
      owes: 60.75,
      dos: 'Sep 17, 2026',
      payer: 'Cigna',
      contact: 'Email & Phone',
      lastContact: 'Phone call 4d ago · 2 contacts',
      status: 'Requested',
      phone: '(503) 555-0211'
    },
    {
      id: 'bal-4',
      patient: 'David Kim',
      patientId: 'pat-david-kim',
      owes: 25.0,
      dos: 'Sep 8, 2026',
      payer: 'Aetna',
      contact: 'Email & Phone',
      lastContact: 'Email request 21d ago',
      status: 'Paid',
      phone: '(503) 555-0589'
    },
    {
      id: 'bal-5',
      patient: 'Olivia Grant',
      patientId: 'pat-olivia-grant',
      owes: 89.4,
      dos: 'Sep 21, 2026',
      payer: 'UnitedHealthcare',
      contact: 'Email & Phone',
      lastContact: 'Never',
      status: 'No contact on file',
      phone: '(503) 555-0348'
    },
    {
      id: 'bal-6',
      patient: 'James Wong',
      patientId: 'pat-james-wong',
      owes: 153.2,
      dos: 'Sep 13, 2026',
      payer: 'Blue Cross Blue Shield',
      contact: 'Email & Phone',
      lastContact: 'Phone call 7d ago',
      status: 'Send failed',
      phone: '(503) 555-0177'
    },
    {
      id: 'bal-7',
      patient: 'Noah Bennett',
      patientId: 'pat-noah-bennett',
      owes: 36,
      dos: 'Sep 3, 2026',
      payer: 'UnitedHealthcare',
      contact: 'Email & Phone',
      lastContact: 'Phone call 26d ago',
      status: 'Consent needed',
      phone: '(503) 555-0402'
    },
    {
      id: 'bal-8',
      patient: 'Amelia Ross',
      patientId: 'pat-amelia-ross',
      owes: 19.75,
      dos: 'Aug 27, 2026',
      payer: 'Aetna',
      contact: 'Email & Phone',
      lastContact: 'Never',
      status: 'Suppressed',
      phone: '(503) 555-0194'
    },
    {
      id: 'bal-9',
      patient: 'Sofia Mendez',
      patientId: 'pat-sofia-mendez',
      owes: 54.1,
      dos: 'Aug 19, 2026',
      payer: 'Cigna',
      contact: 'Email & Phone',
      lastContact: 'Email request Sep 8, 2026',
      status: 'Balance changed',
      phone: '(503) 555-0211'
    },
    {
      id: 'bal-10',
      patient: 'Marcus Lee',
      patientId: 'pat-marcus-lee',
      owes: 221.5,
      dos: 'Oct 4, 2026',
      payer: 'UnitedHealthcare',
      contact: 'Email & Phone',
      lastContact: 'Never',
      status: 'Ready to request',
      phone: '(503) 555-0455'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<(typeof balances)[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Ready to request' | 'Requested' | 'Paid' | 'Suppressed'>('All');
  const [sentSuccess, setSentSuccess] = useState(false);

  const filteredBalances = activeTab === 'All' ? balances : balances.filter((b) => b.status === activeTab);
  const totalOwed = balances.reduce((acc, b) => acc + b.owes, 0);

  const handleSendText = () => {
    if (selectedPatient) {
      setBalances((prev) =>
        prev.map((b) =>
          b.id === selectedPatient.id
            ? { ...b, status: 'Requested', lastContact: 'SMS sent just now' }
            : b
        )
      );
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setSelectedPatient(null);
      }, 1500);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="size-5 text-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Patient balances
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Balances patients owe after insurance pays. Review each one, then send a secure payment request by email. Nothing is sent without your say-so.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-card rounded-lg border border-border/80 shadow-2xs text-xs flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-muted-foreground">Total Outstanding Patient A/R:</span>
          <strong className="text-primary font-bold">
            ${totalOwed.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Payments Account Banner */}
      <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
            <CreditCard className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Alder Pay & SMS Billing</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connected payout account: Northstar Family Health (Columbia Bank ••••4810). Automated text billing cadence: 14-day grace period.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Status Tabs */}
      <div className="flex items-center gap-6 border-b border-border/70 text-xs font-medium">
        {(['All', 'Ready to request', 'Requested', 'Paid', 'Suppressed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 transition-all relative ${
              activeTab === tab
                ? 'text-foreground font-semibold border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3 text-right">Patient owes</th>
                <th className="py-2.5 px-3">Date of service</th>
                <th className="py-2.5 px-3">Primary Payer</th>
                <th className="py-2.5 px-3">Contact on file</th>
                <th className="py-2.5 px-3">Last contact</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBalances.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-foreground">
                    {b.patient}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-foreground">
                    ${b.owes.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{b.dos}</td>
                  <td className="py-3 px-3 text-foreground">{b.payer}</td>
                  <td className="py-3 px-3 text-muted-foreground text-[11px]">{b.contact}</td>
                  <td className="py-3 px-3 text-muted-foreground">{b.lastContact}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        b.status === 'Ready to request'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800/80'
                          : b.status === 'Requested'
                          ? 'bg-primary/15 text-primary border-primary/30'
                          : 'bg-secondary text-muted-foreground border-border/80'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedPatient(b)}
                      className="px-2.5 py-1 text-xs font-semibold text-primary bg-primary/15 hover:bg-primary/25 border border-primary/30 rounded-md transition-colors cursor-pointer"
                    >
                      Review text
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Text Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border/80 rounded-xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <span>Text Invoice — {selectedPatient.patient}</span>
              </h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Phone: {selectedPatient.phone}</span>
                <span className="font-semibold text-foreground">
                  Outstanding: ${selectedPatient.owes.toFixed(2)}
                </span>
              </div>

              {/* Simulated Phone SMS bubble */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/70 space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  SMS Preview:
                </span>
                <p className="text-xs text-foreground bg-card p-3 rounded-lg border border-border/80 shadow-2xs leading-relaxed">
                  Hi {selectedPatient.patient.split(' ')[0]}, you have an outstanding patient balance of{' '}
                  <strong className="text-foreground">${selectedPatient.owes.toFixed(2)}</strong> for your clinical visit on {selectedPatient.dos} with Northstar Family Health. Pay in 30 seconds via secure payment link:{' '}
                  <span className="text-primary underline">
                    https://pay.alder.link/inv-4819
                  </span>
                </p>
              </div>

              {sentSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-semibold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  <span>SMS text invoice dispatched via carrier!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSendText}
                disabled={sentSuccess}
                className="px-4 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:brightness-110 rounded-lg flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>Send SMS Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
