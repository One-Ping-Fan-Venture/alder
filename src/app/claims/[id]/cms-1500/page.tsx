'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function CMS1500Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const claimId = resolvedParams.id;
  const { claims } = useApp();

  const claim = claims.find(c => c.id.toLowerCase() === claimId.toLowerCase()) || claims[0];

  if (!claim) {
    notFound();
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="pb-12 flex min-h-0 flex-1 flex-col px-4 pt-4 sm:px-6 md:pb-8 overflow-y-auto max-w-6xl mx-auto select-none">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/claims/${claim.id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to claim {claim.id}</span>
          </Link>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs font-semibold text-foreground">Standard CMS-1500 Claim Form (02/12)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs text-foreground px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted transition-colors cursor-pointer"
          >
            <Printer className="size-3.5 text-muted-foreground" />
            <span>Print Form</span>
          </button>
          <button
            onClick={() => alert('CMS-1500 PDF generation initiated.')}
            className="flex items-center gap-1.5 text-xs text-primary-foreground bg-primary hover:bg-primary/90 font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* CMS-1500 Canvas */}
      <div className="bg-white text-black p-6 sm:p-10 rounded-xl shadow-xl border border-red-300 font-sans text-[11px] leading-tight overflow-x-auto min-w-[760px]">
        {/* Form Title Banner */}
        <div className="flex items-start justify-between border-b-2 border-red-600 pb-3 mb-4">
          <div>
            <div className="text-[14px] font-black tracking-wider text-red-700 uppercase">
              Health Insurance Claim Form
            </div>
            <div className="text-[9px] text-neutral-600 uppercase font-semibold">
              Approved by National Uniform Claim Committee (NUCC) 02/12
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block border border-red-500 text-red-700 font-bold px-2 py-0.5 text-[10px] uppercase">
              PICA
            </span>
          </div>
        </div>

        {/* Section 1: Carrier & Patient */}
        <div className="grid grid-cols-12 border-2 border-red-600">
          {/* Box 1: Insurance Type */}
          <div className="col-span-7 border-r border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              1. MEDICARE / MEDICAID / TRICARE / CHAMPVA / GROUP HEALTH PLAN / FECA / OTHER
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] font-semibold text-black">
              <label className="flex items-center gap-1">
                <input type="checkbox" readOnly checked={claim.payer.toLowerCase().includes('medicare')} /> Medicare
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" readOnly checked={claim.payer.toLowerCase().includes('medicaid') || claim.payer.toLowerCase().includes('oregon')} /> Medicaid
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" readOnly checked={!claim.payer.toLowerCase().includes('medicare') && !claim.payer.toLowerCase().includes('medicaid')} /> Group Plan
              </label>
            </div>
          </div>

          {/* Box 1a: Insured's ID */}
          <div className="col-span-5 border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              1a. INSURED&apos;S I.D. NUMBER
            </div>
            <div className="text-sm font-mono font-bold mt-1 text-black">{claim.memberId || 'MEM-9482014'}</div>
          </div>

          {/* Box 2: Patient Name */}
          <div className="col-span-7 border-r border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              2. PATIENT&apos;S NAME (Last Name, First Name, Middle Initial)
            </div>
            <div className="text-xs font-bold uppercase mt-1 text-black">{claim.patientName}</div>
          </div>

          {/* Box 3: Patient DOB & Sex */}
          <div className="col-span-5 border-b border-red-600 p-2 flex gap-4">
            <div className="flex-1">
              <div className="text-[9px] font-bold text-red-700 uppercase">3. PATIENT&apos;S BIRTH DATE</div>
              <div className="text-xs font-bold mt-1 text-black">{claim.patientDob || '05/14/1984'}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-red-700 uppercase">SEX</div>
              <div className="text-xs font-bold mt-1 text-black">M</div>
            </div>
          </div>

          {/* Box 5: Patient Address */}
          <div className="col-span-7 border-r border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              5. PATIENT&apos;S ADDRESS (No., Street)
            </div>
            <div className="text-xs font-medium text-black">1428 Elm Street, Apt 4B</div>
            <div className="text-[10px] text-neutral-800 font-semibold mt-0.5">Portland, OR 97201 | Tel: (503) 555-0192</div>
          </div>

          {/* Box 4: Insured's Name */}
          <div className="col-span-5 border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">4. INSURED&apos;S NAME</div>
            <div className="text-xs font-bold uppercase mt-1 text-black">{claim.patientName}</div>
          </div>

          {/* Box 10: Is condition related to */}
          <div className="col-span-7 border-r border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">10. IS PATIENT&apos;S CONDITION RELATED TO:</div>
            <div className="text-[10px] text-neutral-800 mt-1 flex gap-4">
              <span>a. EMPLOYMENT? [ ] YES [X] NO</span>
              <span>b. AUTO ACCIDENT? [ ] YES [X] NO</span>
            </div>
          </div>

          {/* Box 11: Insured Policy/Group */}
          <div className="col-span-5 border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">11. INSURED&apos;S POLICY GROUP OR FECA NUMBER</div>
            <div className="text-xs font-mono font-bold mt-1 text-black">{claim.groupNumber || 'GRP-882104'}</div>
            <div className="text-[10px] text-neutral-700 font-medium mt-0.5">Payer: {claim.payer}</div>
          </div>

          {/* Box 21: Diagnoses (ICD-10) */}
          <div className="col-span-12 border-b border-red-600 p-2.5">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              21. DIAGNOSIS OR NATURE OF ILLNESS OR INJURY (Relate A-L to service line below)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5 text-xs font-bold text-black font-mono">
              <div>A. [{claim.diagnosisCode || 'I10'}] <span className="text-[10px] font-sans font-medium text-neutral-700">({claim.diagnosisDescription || 'Essential hypertension'})</span></div>
              <div>B. [Z00.00] <span className="text-[10px] font-sans font-medium text-neutral-700">(General exam)</span></div>
              <div>C. [—]</div>
              <div>D. [—]</div>
            </div>
          </div>

          {/* Box 24: Service Lines Grid */}
          <div className="col-span-12 border-b border-red-600">
            <div className="text-[9px] font-bold text-red-700 p-1.5 border-b border-red-400 uppercase">
              24. A. DATES OF SERVICE | B. PLACE | C. EMG | D. PROCEDURES, SERVICES (CPT/HCPCS) | E. DIAG | F. $ CHARGES | G. UNITS | J. RENDERING PROVIDER ID
            </div>
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-red-400 bg-red-50/50 text-red-800 font-bold text-[9px]">
                  <th className="p-1.5">From - To</th>
                  <th className="p-1.5">POS</th>
                  <th className="p-1.5">CPT / HCPCS</th>
                  <th className="p-1.5">Modifiers</th>
                  <th className="p-1.5">Diag Pointer</th>
                  <th className="p-1.5 text-right">$ Charges</th>
                  <th className="p-1.5 text-right">Units</th>
                  <th className="p-1.5">Rendering NPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-200 font-mono text-black">
                {claim.serviceLines && claim.serviceLines.length > 0 ? (
                  claim.serviceLines.map((line, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5">{line.date || claim.serviceDate}</td>
                      <td className="p-1.5">{line.pos || '11 (Office)'}</td>
                      <td className="p-1.5 font-bold">{line.cpt}</td>
                      <td className="p-1.5">{line.modifiers || '25'}</td>
                      <td className="p-1.5">{line.diagnoses || 'A'}</td>
                      <td className="p-1.5 text-right font-bold">${line.billed.toFixed(2)}</td>
                      <td className="p-1.5 text-right">{line.qty || 1}</td>
                      <td className="p-1.5">{claim.renderingNpi || '1659380777'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-1.5">{claim.serviceDate}</td>
                    <td className="p-1.5">11 (Office)</td>
                    <td className="p-1.5 font-bold">{claim.cptCode || '99214'}</td>
                    <td className="p-1.5">25</td>
                    <td className="p-1.5">A</td>
                    <td className="p-1.5 text-right font-bold">${claim.billed.toFixed(2)}</td>
                    <td className="p-1.5 text-right">1</td>
                    <td className="p-1.5">{claim.renderingNpi || '1659380777'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Box 25-30: Totals & Payments */}
          <div className="col-span-4 border-r border-b border-red-600 p-2">
            <div className="text-[9px] font-bold text-red-700 uppercase">25. FEDERAL TAX I.D. NUMBER</div>
            <div className="text-xs font-mono font-bold mt-1 text-black">XX-XXX0094 [X] EIN</div>
          </div>
          <div className="col-span-3 border-r border-b border-red-600 p-2 text-right">
            <div className="text-[9px] font-bold text-red-700 uppercase">28. TOTAL CHARGE</div>
            <div className="text-sm font-mono font-bold text-black mt-1">${claim.billed.toFixed(2)}</div>
          </div>
          <div className="col-span-2 border-r border-b border-red-600 p-2 text-right">
            <div className="text-[9px] font-bold text-red-700 uppercase">29. AMOUNT PAID</div>
            <div className="text-xs font-mono font-bold text-black mt-1">${(claim.insurancePaid + claim.patientPaid).toFixed(2)}</div>
          </div>
          <div className="col-span-3 border-b border-red-600 p-2 text-right">
            <div className="text-[9px] font-bold text-red-700 uppercase">30. BALANCE DUE</div>
            <div className="text-sm font-mono font-bold text-red-700 mt-1">${claim.claimBalance.toFixed(2)}</div>
          </div>

          {/* Box 31: Physician Signature */}
          <div className="col-span-6 border-r border-red-600 p-2.5">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              31. SIGNATURE OF PHYSICIAN OR SUPPLIER
            </div>
            <div className="text-xs font-serif italic mt-2 text-neutral-800">
              Dr. Samuel Ortiz, DO — Signature on File
            </div>
            <div className="text-[9px] text-neutral-500 mt-1">Date: {claim.serviceDate}</div>
          </div>

          {/* Box 33: Billing Provider Info */}
          <div className="col-span-6 p-2.5">
            <div className="text-[9px] font-bold text-red-700 uppercase">
              33. BILLING PROVIDER INFO & PH #
            </div>
            <div className="text-xs font-bold text-black uppercase mt-1">
              Northstar Family Health Clinic LLC
            </div>
            <div className="text-[10px] text-neutral-800">
              1000 Medical Center Dr, Suite 300, Portland, OR 97201
            </div>
            <div className="text-xs font-mono font-bold text-black mt-1">
              NPI: {claim.billingNpi || '1982744321'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
