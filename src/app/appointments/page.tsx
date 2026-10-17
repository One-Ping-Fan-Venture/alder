'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Appointment } from '@/types/rcm';
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  CircleDollarSign,
  Phone,
  ShieldCheck,
  Calendar,
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function AppointmentsPage() {
  const { appointments, collectCopay, addAppointment } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'to_collect' | 'collected'>('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(appointments[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [copayAmount, setCopayAmount] = useState(25);

  // New appointment form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newMrn, setNewMrn] = useState('');
  const [newPayer, setNewPayer] = useState('Aetna');
  const [newTime, setNewTime] = useState('11:30 AM');
  const [newCopay, setNewCopay] = useState(30);

  const filtered = appointments.filter((a) => {
    if (activeTab === 'to_collect') return a.copayStatus === 'To collect';
    if (activeTab === 'collected') return a.copayStatus === 'Collected';
    return true;
  });

  const toCollectCount = appointments.filter((a) => a.copayStatus === 'To collect').length;
  const collectedCount = appointments.filter((a) => a.copayStatus === 'Collected').length;

  const handleCollectSubmit = () => {
    if (selectedAppt) {
      collectCopay(selectedAppt.id, copayAmount);
      setSelectedAppt({
        ...selectedAppt,
        copayStatus: 'Collected',
        status: 'Ready',
        estCopay: copayAmount
      });
      setIsCollectModalOpen(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = newPatientName.trim().split(' ');
    const first = parts[0] || 'New';
    const last = parts.slice(1).join(' ') || 'Patient';

    addAppointment({
      time: newTime,
      patientId: `pat-${first.toLowerCase()}-${last.toLowerCase()}`,
      firstName: first,
      lastName: last,
      name: `${first} ${last}`,
      mrn: newMrn || `MRN-${first.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      dob: '05/14/1990',
      phone: '(503) 555-0199',
      payer: newPayer,
      plan: 'Preferred PPO',
      coverageStatus: 'Active',
      status: 'Ready',
      estCopay: Number(newCopay),
      copayStatus: 'To collect',
      provider: 'Dr. Priya Nair',
      reason: 'General Consultation'
    });

    setIsAddModalOpen(false);
    setNewPatientName('');
    setNewMrn('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Front Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Today’s appointment schedule, active coverage verification, and copay collections.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Add appointment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span>All</span>
          <span className="text-[10px] opacity-75">({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('to_collect')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'to_collect'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span>To collect</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">
            {toCollectCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('collected')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'collected'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span>Collected</span>
          <span className="text-[10px] opacity-75">({collectedCount})</span>
        </button>
      </div>

      {/* Main Content Area: Roster on Left, Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Table */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Start time</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">MRN</th>
                  <th className="py-2.5 px-3">Coverage</th>
                  <th className="py-2.5 px-3">Primary Payer</th>
                  <th className="py-2.5 px-3 text-right">Est. copay</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filtered.map((appt) => {
                  const isSelected = selectedAppt?.id === appt.id;
                  return (
                    <tr
                      key={appt.id}
                      onClick={() => setSelectedAppt(appt)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {appt.time}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {appt.name}
                        </div>
                        <div className="text-[11px] text-neutral-400">DOB: {appt.dob}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                        {appt.mrn}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={appt.coverageStatus} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-neutral-800 dark:text-neutral-200">{appt.payer}</div>
                        <div className="text-[10px] text-neutral-400">{appt.plan}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        {appt.estCopay > 0 ? (
                          <span
                            className={
                              appt.copayStatus === 'Collected'
                                ? 'text-emerald-600 font-bold'
                                : 'text-neutral-900 dark:text-neutral-100'
                            }
                          >
                            ${appt.estCopay.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={appt.copayStatus} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Appointment Detail Card */}
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between">
          {selectedAppt ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                    Appointment Details
                  </span>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {selectedAppt.name}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedAppt.time} · {selectedAppt.provider}
                  </p>
                </div>
                <StatusBadge status={selectedAppt.copayStatus} size="sm" />
              </div>

              {/* Patient info */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Medical Record (MRN)</span>
                  <span className="font-mono font-medium">{selectedAppt.mrn}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Date of Birth</span>
                  <span className="font-medium">{selectedAppt.dob}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Contact Phone</span>
                  <span className="font-medium">{selectedAppt.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Visit Reason</span>
                  <span className="font-medium">{selectedAppt.reason}</span>
                </div>
              </div>

              {/* Verified Payer Benefits */}
              <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    Verified Benefit Summary
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">
                    271 EDI Active
                  </span>
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  <div>
                    <span className="text-neutral-400">Payer: </span>
                    {selectedAppt.payer} ({selectedAppt.plan})
                  </div>
                  <div className="mt-1">
                    <span className="text-neutral-400">In-Network Copay: </span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      ${selectedAppt.estCopay > 0 ? selectedAppt.estCopay.toFixed(2) : '25.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collect Action */}
              {selectedAppt.copayStatus === 'To collect' ? (
                <button
                  onClick={() => {
                    setCopayAmount(selectedAppt.estCopay || 25);
                    setIsCollectModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <CreditCard className="size-4" />
                  <span>Collect Copay (${selectedAppt.estCopay.toFixed(2)})</span>
                </button>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Copay of ${selectedAppt.estCopay.toFixed(2)} collected & posted!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400">
              Select a patient from the roster to view appointment and copay details.
            </div>
          )}
        </div>
      </div>

      {/* Collect Copay Modal */}
      {isCollectModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Collect Copay - {selectedAppt.name}
              </h3>
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Copay Amount ($)</label>
                <input
                  type="number"
                  value={copayAmount}
                  onChange={(e) => setCopayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs">
                  <option>Credit Card (Stripe Terminal)</option>
                  <option>Cash Receipt</option>
                  <option>Check</option>
                  <option>HSA / FSA Card</option>
                </select>
              </div>

              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded text-[11px] text-neutral-400">
                Collecting this payment will immediately update the patient responsibility balance
                and mark the appointment as Ready for provider rounding.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCollectSubmit}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Schedule New Appointment
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Anderson"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">Appointment Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Est. Copay ($)</label>
                  <input
                    type="number"
                    value={newCopay}
                    onChange={(e) => setNewCopay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Insurance Payer</label>
                <select
                  value={newPayer}
                  onChange={(e) => setNewPayer(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                >
                  <option>Aetna</option>
                  <option>Blue Cross Blue Shield</option>
                  <option>Cigna</option>
                  <option>UnitedHealthcare</option>
                  <option>Oregon Health Plan</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
