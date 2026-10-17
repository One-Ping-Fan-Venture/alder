'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { KeyRound, Plus, X, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function PriorAuthPage() {
  const { priorAuths, patients } = useApp();
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [authList, setAuthList] = useState(priorAuths);

  // New auth form state
  const [patientName, setPatientName] = useState('Amelia Ross');
  const [serviceCode, setServiceCode] = useState('73721');
  const [serviceName, setServiceName] = useState('MRI lower extremity');
  const [payer, setPayer] = useState('Blue Cross Blue Shield');

  const filtered = authList.filter((pa) => {
    if (filter === 'approved') return pa.status === 'Approved';
    if (filter === 'pending') return pa.status === 'Pending payer';
    if (filter === 'needs_info') return pa.status === 'Needs information';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPa = {
      id: `pa-${Date.now().toString().slice(-4)}`,
      authNumber: `PA-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientId: 'pat-gen',
      serviceCode,
      serviceName,
      payer,
      plan: 'Commercial PPO',
      status: 'Pending payer' as const,
      submittedDate: 'Oct 17, 2026',
      expirationDate: 'Jan 17, 2027',
      notes: 'Initial clinical justification and medical necessity documentation submitted.'
    };
    setAuthList([newPa, ...authList]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Prior Auth
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Prior authorization tracking for specialty procedures, diagnostic imaging, and therapies.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>New Prior Auth</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg ${filter === 'all' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
        >
          All Auths ({authList.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-lg ${filter === 'approved' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg ${filter === 'pending' ? 'bg-amber-600 text-white font-semibold' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
        >
          Pending Payer
        </button>
        <button
          onClick={() => setFilter('needs_info')}
          className={`px-3 py-1.5 rounded-lg ${filter === 'needs_info' ? 'bg-rose-600 text-white font-semibold' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
        >
          Needs Information
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-3">Patient & Auth #</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Payer</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Submitted</th>
                <th className="py-2.5 px-3">Expiration</th>
                <th className="py-2.5 px-3">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((pa) => (
                <tr key={pa.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-3">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {pa.patientName}
                    </div>
                    <span className="font-mono text-[11px] text-neutral-400 font-medium">
                      {pa.authNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {pa.serviceCode}
                    </div>
                    <div className="text-[11px] text-neutral-400">{pa.serviceName}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                    <div>{pa.payer}</div>
                    <div className="text-[10px] text-neutral-400">{pa.plan}</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={pa.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-neutral-500">{pa.submittedDate}</td>
                  <td className="py-3 px-3 text-neutral-500">{pa.expirationDate}</td>
                  <td className="py-3 px-3 text-neutral-500 text-[11px] max-w-xs truncate">
                    {pa.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Submit New Prior Auth Request
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">CPT Code</label>
                  <input
                    type="text"
                    required
                    value={serviceCode}
                    onChange={(e) => setServiceCode(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Payer</label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                >
                  <option>Blue Cross Blue Shield</option>
                  <option>Aetna</option>
                  <option>Cigna</option>
                  <option>UnitedHealthcare</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Submit Auth
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
