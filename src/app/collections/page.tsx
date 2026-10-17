'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CircleDollarSign,
  MessageSquare,
  CheckCircle2,
  Mail,
  Phone,
  Send,
  X,
  CreditCard,
  Building
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function CollectionsPage() {
  const { patients } = useApp();

  const [balances, setBalances] = useState([
    {
      id: 'bal-1',
      patient: 'Amelia Ross',
      patientId: 'pat-amelia-ross',
      owes: 42.5,
      dos: 'Sep 29, 2026',
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
      dos: 'Sep 23, 2026',
      payer: 'UnitedHealthcare',
      contact: 'Email & SMS',
      lastContact: 'Phone call 5d ago',
      status: 'Ready to request',
      phone: '(503) 555-0455'
    },
    {
      id: 'bal-3',
      patient: 'Sofia Mendez',
      patientId: 'pat-sofia-mendez',
      owes: 60.75,
      dos: 'Sep 16, 2026',
      payer: 'Cigna',
      contact: 'Email & SMS',
      lastContact: 'SMS sent 4d ago',
      status: 'Requested',
      phone: '(503) 555-0211'
    },
    {
      id: 'bal-4',
      patient: 'David Kim',
      patientId: 'pat-david-kim',
      owes: 85.0,
      dos: 'Sep 10, 2026',
      payer: 'Aetna',
      contact: 'SMS only',
      lastContact: 'Never',
      status: 'Ready to request',
      phone: '(503) 555-0589'
    },
    {
      id: 'bal-5',
      patient: 'Olivia Grant',
      patientId: 'pat-olivia-grant',
      owes: 35.0,
      dos: 'Aug 28, 2026',
      payer: 'UnitedHealthcare',
      contact: 'Email & SMS',
      lastContact: 'Statement mailed 12d ago',
      status: 'Payment plan',
      phone: '(503) 555-0348'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<(typeof balances)[0] | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Patient Balances
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Post-insurance patient liabilities, digital SMS text invoices, and automated statements.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-white dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-2xs text-xs">
          <span>Total Outstanding Patient A/R: </span>
          <strong className="text-emerald-700 dark:text-emerald-400 font-bold ml-1">
            ${totalOwed.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Payments Account Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-neutral-900 text-white border border-emerald-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
            <CreditCard className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Taiga Pay & SMS Billing Enabled</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Connected payout account: Northstar Family Health (Columbia Bank ••••4810). Automated text billing cadence: 14-day grace period.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
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
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {balances.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {b.patient}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-neutral-900 dark:text-neutral-100">
                    ${b.owes.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">{b.dos}</td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-200">{b.payer}</td>
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">{b.contact}</td>
                  <td className="py-3 px-3 text-neutral-500">{b.lastContact}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.status === 'Ready to request'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400'
                          : b.status === 'Requested'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-400'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedPatient(b)}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-md transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <MessageSquare className="size-4 text-emerald-600" />
                <span>Text Invoice — {selectedPatient.patient}</span>
              </h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Phone: {selectedPatient.phone}</span>
                <span>Outstanding: ${selectedPatient.owes.toFixed(2)}</span>
              </div>

              {/* Simulated Phone SMS bubble */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  SMS Preview:
                </span>
                <p className="text-xs text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-750 shadow-2xs">
                  Hi {selectedPatient.patient.split(' ')[0]}, you have an outstanding patient balance of{' '}
                  <strong>${selectedPatient.owes.toFixed(2)}</strong> for your clinical visit on {selectedPatient.dos} with Northstar Family Health. Pay in 30 seconds via secure payment link:{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 underline">
                    https://pay.taiga.link/inv-4819
                  </span>
                </p>
              </div>

              {sentSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  <span>SMS text invoice dispatched via carrier!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleSendText}
                disabled={sentSuccess}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-xs"
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
