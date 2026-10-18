'use client';

import React, { useState } from 'react';
import { easternISODate } from '@/lib/eastern';
import {
  ShieldCheck,
  Calendar,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Star,
  FileCheck2
} from 'lucide-react';

interface EligibilityResult {
  status: 'Active' | 'Inactive';
  payer: string;
  plan: string;
  memberId: string;
  groupNumber: string;
  subscriberName: string;
  relation: string;
  copayPcp: number;
  copaySpecialist: number;
  coinsurance: string;
  deductibleIndividual: { total: number; met: number; remaining: number };
  deductibleFamily: { total: number; met: number; remaining: number };
  oopIndividual: { total: number; met: number; remaining: number };
  priorAuthRequired: boolean;
}

export default function EligibilityPage() {
  const [insurerQuery, setInsurerQuery] = useState('');
  const [selectedPayerId, setSelectedPayerId] = useState('');
  const [service, setService] = useState('General plan coverage');
  const [dateOfService, setDateOfService] = useState(easternISODate);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [dob, setDob] = useState('');
  const [isDependent, setIsDependent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const favorites = [
    { name: 'Aetna', id: '60054', plan: 'Choice POS II' },
    { name: 'Blue Cross Blue Shield', id: '00012', plan: 'Preferred PPO' },
    { name: 'Cigna', id: '00904', plan: 'Open Access Plus' },
    { name: 'UnitedHealthcare', id: '87726', plan: 'Navigate Plus' },
    { name: 'Oregon Health Plan', id: '93011', plan: 'Medicaid CCO' }
  ];

  const handleSelectInsurer = (fav: typeof favorites[0]) => {
    setInsurerQuery(fav.name);
    setSelectedPayerId(fav.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const isMedicaid = insurerQuery.toLowerCase().includes('oregon');
      setResult({
        status: 'Active',
        payer: insurerQuery || 'Aetna',
        plan: isMedicaid ? 'Medicaid CCO' : 'Choice POS II',
        memberId: memberId || 'MEM-ROSS-01',
        groupNumber: 'GRP-889102',
        subscriberName: `${firstName || 'Amelia'} ${lastName || 'Ross'}`,
        relation: isDependent ? 'Child / Dependent' : 'Self',
        copayPcp: isMedicaid ? 0.0 : 25.0,
        copaySpecialist: isMedicaid ? 0.0 : 45.0,
        coinsurance: isMedicaid ? '0%' : '20% after deductible',
        deductibleIndividual: isMedicaid
          ? { total: 0, met: 0, remaining: 0 }
          : { total: 1500, met: 1150, remaining: 350 },
        deductibleFamily: isMedicaid
          ? { total: 0, met: 0, remaining: 0 }
          : { total: 3000, met: 2200, remaining: 800 },
        oopIndividual: isMedicaid
          ? { total: 0, met: 0, remaining: 0 }
          : { total: 4500, met: 2800, remaining: 1700 },
        priorAuthRequired: service.includes('imaging') || service.includes('surgery')
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-foreground" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Eligibility
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Simulate a coverage and benefits check using demo data. No insurer is contacted.
        </p>
      </div>

      {!result ? (
        /* Main Check Card Form */
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-base font-semibold text-foreground">
              New check
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Coverage */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Coverage
              </h3>

              {/* Insurer Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Insurer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={insurerQuery}
                    onChange={(e) => setInsurerQuery(e.target.value)}
                    placeholder="Aetna, Cigna, ..."
                    required
                    className="w-full rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  Type at least 2 characters. Gold stars mark favorites from this clinic's active contracts. Selecting an insurer fills payer ID automatically.
                </p>

                {/* Quick Select Favorites Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {favorites.map((fav) => (
                    <button
                      key={fav.name}
                      type="button"
                      onClick={() => handleSelectInsurer(fav)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                        insurerQuery === fav.name
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span>{fav.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Service & Service Dropdown Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Date of service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="size-4 absolute left-3 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      value={dateOfService}
                      onChange={(e) => setDateOfService(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border/80 bg-secondary/40 pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs pr-8"
                    >
                      <option value="General plan coverage">General plan coverage</option>
                      <option value="99214 - Office visit (Established)">99214 - Office visit (Established)</option>
                      <option value="99203 - Office visit (New)">99203 - Office visit (New)</option>
                      <option value="73721 - MRI Lumbar Spine">73721 - MRI Lumbar Spine</option>
                      <option value="97110 - Physical Therapy">97110 - Physical Therapy</option>
                    </select>
                    <ChevronDown className="size-4 text-muted-foreground absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Subscriber */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Subscriber
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  As shown on the insurance card.
                </p>
              </div>

              {/* First and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Amelia"
                    required
                    className="w-full rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Ross"
                    required
                    className="w-full rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>
              </div>

              {/* Member ID and Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Member ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="MEM-ROSS-01"
                    required
                    className="w-full rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>
              </div>

              {/* Dependent Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDependentCheckbox"
                  checked={isDependent}
                  onChange={(e) => setIsDependent(e.target.checked)}
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isDependentCheckbox"
                  className="text-xs text-muted-foreground select-none cursor-pointer"
                >
                  The patient is a dependent on this policy
                </label>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:brightness-110 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Checking eligibility...' : 'Check eligibility'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 270/271 Adjudication Result View matching Demo */
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Top Return & Meta Header Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border/80 shadow-xs">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>← New check</span>
            </button>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="font-semibold text-foreground">{result.payer}</span>
              <span>·</span>
              <span className="font-mono">{result.memberId}</span>
              <span>·</span>
              <span>{dateOfService}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          {/* Coverage Overview Card */}
          <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground">
              Coverage Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Subscriber</span>
                <span className="font-semibold text-foreground">{result.subscriberName}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">Relation: {result.relation}</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Plan</span>
                <span className="font-semibold text-foreground">{result.plan}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">Group: {result.groupNumber}</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Service Category</span>
                <span className="font-semibold text-foreground">{service}</span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Prior Authorization</span>
                <span className="font-semibold text-emerald-400">
                  {result.priorAuthRequired ? 'Required' : 'Not Required'}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits Table matching Demo 4-column structure */}
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground">
                Benefits & Cost Sharing
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 border-b border-border/70 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Benefit</th>
                    <th className="py-2.5 px-3">Applies to</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Copayment</td>
                    <td className="py-3 px-3 text-muted-foreground">Primary care visit</td>
                    <td className="py-3 px-3 font-semibold text-foreground">${result.copayPcp.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">In-network participating providers</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Copayment</td>
                    <td className="py-3 px-3 text-muted-foreground">Specialist visit</td>
                    <td className="py-3 px-3 font-semibold text-foreground">${result.copaySpecialist.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">In-network participating specialists</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Coinsurance</td>
                    <td className="py-3 px-3 text-muted-foreground">Covered clinical services</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{result.coinsurance}</td>
                    <td className="py-3 px-4 text-muted-foreground">Applies once deductible is met</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Deductible</td>
                    <td className="py-3 px-3 text-muted-foreground">Individual (Annual)</td>
                    <td className="py-3 px-3 font-semibold text-foreground">${result.deductibleIndividual.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">${result.deductibleIndividual.met.toFixed(2)} met, ${result.deductibleIndividual.remaining.toFixed(2)} remaining</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Deductible</td>
                    <td className="py-3 px-3 text-muted-foreground">Family (Annual)</td>
                    <td className="py-3 px-3 font-semibold text-foreground">${result.deductibleFamily.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">${result.deductibleFamily.met.toFixed(2)} met, ${result.deductibleFamily.remaining.toFixed(2)} remaining</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="py-3 px-4 font-semibold text-foreground">Out-of-pocket maximum</td>
                    <td className="py-3 px-3 text-muted-foreground">Individual (Annual)</td>
                    <td className="py-3 px-3 font-semibold text-foreground">${result.oopIndividual.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-muted-foreground">${result.oopIndividual.met.toFixed(2)} met, ${result.oopIndividual.remaining.toFixed(2)} remaining</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
