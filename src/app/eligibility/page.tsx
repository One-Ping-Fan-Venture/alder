'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Star,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

export default function EligibilityPage() {
  const { patients } = useApp();

  const [selectedPayer, setSelectedPayer] = useState('Aetna');
  const [payerId, setPayerId] = useState('60054');
  const [serviceType, setServiceType] = useState('General plan coverage');
  const [dateOfService, setDateOfService] = useState('2026-10-17');
  const [memberId, setMemberId] = useState('MEM-ROSS-01');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'pat-amelia-ross');
  const [isLoading, setIsLoading] = useState(false);
  const [checkedResult, setCheckedResult] = useState<any>({
    status: 'Active',
    payer: 'Aetna',
    plan: 'Choice POS II',
    memberId: 'MEM-ROSS-01',
    groupNumber: 'GRP-889102',
    effectiveDate: 'Jan 01, 2024',
    subscriberName: 'Amelia Ross',
    relation: 'Self',
    copayPcp: 25.0,
    copaySpecialist: 45.0,
    coinsurance: '20% after deductible',
    deductibleIndividual: { total: 1500, met: 1150, remaining: 350 },
    deductibleFamily: { total: 3000, met: 2200, remaining: 800 },
    oopIndividual: { total: 4500, met: 2800, remaining: 1700 },
    priorAuthRequired: false
  });

  const payers = [
    { name: 'Aetna', id: '60054', plan: 'Choice POS II', favorite: true },
    { name: 'Blue Cross Blue Shield', id: '00012', plan: 'Preferred PPO', favorite: true },
    { name: 'Cigna', id: '00904', plan: 'Open Access Plus', favorite: true },
    { name: 'UnitedHealthcare', id: '87726', plan: 'Navigate Plus', favorite: true },
    { name: 'Oregon Health Plan', id: '93011', plan: 'Medicaid CCO', favorite: true }
  ];

  const handlePayerChange = (name: string) => {
    setSelectedPayer(name);
    const found = payers.find((p) => p.name === name);
    if (found) setPayerId(found.id);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];
    const payerMeta = payers.find((p) => p.name === selectedPayer) || payers[0];

    setTimeout(() => {
      setCheckedResult({
        status: 'Active',
        payer: selectedPayer,
        plan: payerMeta.plan,
        memberId: memberId || `MEM-${pat.firstName.toUpperCase()}-01`,
        groupNumber: 'GRP-889102',
        effectiveDate: 'Jan 01, 2024',
        subscriberName: pat.name,
        relation: 'Self',
        copayPcp: selectedPayer === 'Oregon Health Plan' ? 0.0 : 25.0,
        copaySpecialist: selectedPayer === 'Oregon Health Plan' ? 0.0 : 45.0,
        coinsurance: selectedPayer === 'Oregon Health Plan' ? '0%' : '20% after deductible',
        deductibleIndividual:
          selectedPayer === 'Oregon Health Plan'
            ? { total: 0, met: 0, remaining: 0 }
            : { total: 1500, met: 1150, remaining: 350 },
        deductibleFamily:
          selectedPayer === 'Oregon Health Plan'
            ? { total: 0, met: 0, remaining: 0 }
            : { total: 3000, met: 2200, remaining: 800 },
        oopIndividual:
          selectedPayer === 'Oregon Health Plan'
            ? { total: 0, met: 0, remaining: 0 }
            : { total: 4500, met: 2800, remaining: 1700 },
        priorAuthRequired: serviceType.includes('imaging') || serviceType.includes('therapy')
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Eligibility
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Real-time 270/271 benefit verification and point-of-care copay adjudication.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              New Check
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Gold stars mark favorite payers from this clinic’s active contracts.
            </p>
          </div>

          <form onSubmit={handleCheck} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                Insurer *
              </label>
              <select
                value={selectedPayer}
                onChange={(e) => handlePayerChange(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium"
              >
                {payers.map((p) => (
                  <option key={p.name} value={p.name}>
                    ★ {p.name} (Payer ID: {p.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                Patient Lookup *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  const pat = patients.find((p) => p.id === e.target.value);
                  if (pat) setMemberId(`MEM-${pat.firstName.toUpperCase()}-01`);
                }}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium"
              >
                {patients.slice(0, 15).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrn}) · DOB: {p.birthDate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                Subscriber Member ID *
              </label>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                  Date of Service *
                </label>
                <input
                  type="date"
                  value={dateOfService}
                  onChange={(e) => setDateOfService(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                  Payer ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={payerId}
                  className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-750 text-neutral-500 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                Service Category *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
              >
                <option>General plan coverage</option>
                <option>Diagnostic x-ray / MRI imaging</option>
                <option>Physical therapy & rehab</option>
                <option>Specialty consultation</option>
                <option>Preventive & wellness</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              {isLoading ? (
                <span>Querying Clearinghouse 270...</span>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>Check Eligibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {checkedResult && (
            <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-5">
              {/* Coverage Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Active Coverage — In-Network Adjudicated
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      271 EDI transaction verified on Oct 17, 2026 at 11:58 AM
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {checkedResult.payer}
                  </span>
                  <div className="text-[11px] text-emerald-600">{checkedResult.plan}</div>
                </div>
              </div>

              {/* Subscriber & Plan Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Primary Subscriber</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block truncate">
                    {checkedResult.subscriberName}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Member ID</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block truncate">
                    {checkedResult.memberId}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Group Number</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block truncate">
                    {checkedResult.groupNumber}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Prior Auth</span>
                  <span className={`font-semibold mt-0.5 block ${checkedResult.priorAuthRequired ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {checkedResult.priorAuthRequired ? 'Required for service' : 'Not Required'}
                  </span>
                </div>
              </div>

              {/* Deductible & Out-of-Pocket Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Deductible & Out-of-Pocket Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Individual Deductible */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                    <span className="text-xs font-medium text-neutral-500">Individual Deductible</span>
                    <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      ${checkedResult.deductibleIndividual.met}{' '}
                      <span className="text-xs text-neutral-400 font-normal">
                        / ${checkedResult.deductibleIndividual.total}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{
                          width: `${(checkedResult.deductibleIndividual.met / Math.max(1, checkedResult.deductibleIndividual.total)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium mt-1.5 block">
                      ${checkedResult.deductibleIndividual.remaining} remaining
                    </span>
                  </div>

                  {/* Family Deductible */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                    <span className="text-xs font-medium text-neutral-500">Family Deductible</span>
                    <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      ${checkedResult.deductibleFamily.met}{' '}
                      <span className="text-xs text-neutral-400 font-normal">
                        / ${checkedResult.deductibleFamily.total}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full"
                        style={{
                          width: `${(checkedResult.deductibleFamily.met / Math.max(1, checkedResult.deductibleFamily.total)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-sky-600 font-medium mt-1.5 block">
                      ${checkedResult.deductibleFamily.remaining} remaining
                    </span>
                  </div>

                  {/* Out of pocket max */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                    <span className="text-xs font-medium text-neutral-500">Out-of-Pocket Max</span>
                    <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      ${checkedResult.oopIndividual.met}{' '}
                      <span className="text-xs text-neutral-400 font-normal">
                        / ${checkedResult.oopIndividual.total}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{
                          width: `${(checkedResult.oopIndividual.met / Math.max(1, checkedResult.oopIndividual.total)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-indigo-600 font-medium mt-1.5 block">
                      ${checkedResult.oopIndividual.remaining} remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Point of Care Copays */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block">
                  Point-of-Service Copays & Coinsurance
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Primary Care</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      ${checkedResult.copayPcp.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Specialist</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      ${checkedResult.copaySpecialist.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Urgent Care</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">$50.00</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Coinsurance</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {checkedResult.coinsurance}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
