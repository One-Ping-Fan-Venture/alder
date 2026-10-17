'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  Gauge,
  Users,
  FileText,
  Code2,
  CheckCircle2
} from 'lucide-react';

export default function TourGuide() {
  const router = useRouter();
  const { tourOpen, setTourOpen } = useApp();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Taiga Billing RCM',
      badge: 'Platform Tour (1/4)',
      icon: Gauge,
      page: '/',
      description:
        'Taiga Billing is a modern revenue cycle management system designed to eliminate billing blind spots. From the Overview dashboard, monitor total cash collected, payer balance in flight, clean claim denial rates (0.6%), and open billing tasks in real-time.',
      highlights: [
        '$287,303 in cash collected over the last 30 days',
        '211 claims actively awaiting payer response ($227k)',
        'Real-time stream of actionable tasks: working denials, clinic info requests'
      ]
    },
    {
      title: 'Front Desk & Real-Time Eligibility',
      badge: 'Practice (2/4)',
      icon: Users,
      page: '/appointments',
      description:
        'Front-of-the-house revenue cycle starts at intake. Check patients in, verify active commercial & Medicaid coverage, calculate estimated copays on the fly, and collect point-of-service payments to prevent downstream patient bad debt.',
      highlights: [
        'Instant 270/271 EDI benefit checking with deductible breakdown',
        'Collect copay in one click with automated invoice receipts',
        'Inpatient rounds scheduling with provider encounter tracking'
      ]
    },
    {
      title: 'Claims Engine & Deep Claim Inspector',
      badge: 'Billing Operations (3/4)',
      icon: FileText,
      page: '/claims',
      description:
        'Manage dense claim pipelines with multi-dimensional filters. Drill into any claim to inspect all 7 tabs: Patient Demographics, ICD-10 & CPT Service Lines, 835 Remittance adjustments, Other historical claims, and actionable Denial tasks.',
      highlights: [
        'Dense data grid of 1,546 real synthetic claims with instant filtering',
        'Try inspecting clm-1002 to test resolving a live CARC denial task',
        'Automated work queues flagging provider coding errors and timely filing'
      ]
    },
    {
      title: 'Reconciliation, Reports & Developer API',
      badge: 'Financial Intelligence (4/4)',
      icon: Code2,
      page: '/developers',
      description:
        'Automate financial reconciliation with 835 ERA check registers, generate patient payment text invoices, view A/R aging buckets, and export the entire synthetic RCM dataset with one click.',
      highlights: [
        'Electronic Remittance Advice ledger with 50 check records',
        'Developer portal with API key management and full CSV data export',
        'Switch demo personas at the top to see tailored role workflows'
      ]
    }
  ];

  if (!tourOpen) return null;

  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setTourOpen(false);
      setStep(0);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleJump = () => {
    setTourOpen(false);
    router.push(current.page);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Icon className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {current.badge}
              </span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {current.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setTourOpen(false)}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-md"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {current.description}
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Key Capabilities:
            </span>
            <ul className="space-y-1.5">
              {current.highlights.map((h, i) => (
                <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={handleJump}
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Open this view</span>
            <ChevronRight className="size-3" />
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
              >
                <ChevronLeft className="size-3.5" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>{step === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
