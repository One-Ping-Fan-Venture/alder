'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function TourGuide() {
  const router = useRouter();
  const { tourOpen, setTourOpen } = useApp();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Taiga',
      description: "Your billing home base. Let's take a proper lap. We'll open a real claim and a remit along the way.",
      page: '/',
      top: '420px',
      left: '370px'
    },
    {
      title: 'Overview & Collections',
      description: 'Cash collected, claims submitted in the last 30 days, and current payer balances with denial rates.',
      page: '/',
      top: '180px',
      left: '370px'
    },
    {
      title: 'Front Desk Roster',
      description: 'Manage patient check-in, point-of-service copay collections, and intake eligibility verification.',
      page: '/appointments',
      top: '140px',
      left: '280px'
    },
    {
      title: 'Inpatient Rounding',
      description: 'Track daily physician rounding, hospital encounters, and synchronize billing codes directly to claims.',
      page: '/rounds',
      top: '180px',
      left: '280px'
    },
    {
      title: 'Real-Time Eligibility',
      description: 'Run instant 270/271 benefit checks with complete deductible, out-of-pocket, and copay breakdowns.',
      page: '/eligibility',
      top: '220px',
      left: '280px'
    },
    {
      title: 'Claims Pipeline',
      description: 'Explore the dense 1,546-row claim repository with multi-dimensional filtering and instant search.',
      page: '/claims',
      top: '260px',
      left: '280px'
    },
    {
      title: 'Deep Claim Inspector',
      description: 'Inspect service lines, ICD-10 diagnostics, CPT codes, remits, and actionable denial remediation.',
      page: '/claims/clm-1002',
      top: '280px',
      left: '370px'
    },
    {
      title: 'Denial Management',
      description: 'Resolve clearinghouse rejections and CARC/RARC payer denials with interactive one-click workflows.',
      page: '/claims/clm-1002',
      top: '340px',
      left: '420px'
    },
    {
      title: 'Revenue Leakage Queues',
      description: 'Automated worklists flagging timely filing deadlines, coding anomalies, and missing clinic info.',
      page: '/queues',
      top: '300px',
      left: '280px'
    },
    {
      title: 'Prior Authorizations',
      description: 'Monitor insurer authorization statuses, validity windows, approved units, and attached claims.',
      page: '/prior-auth',
      top: '340px',
      left: '280px'
    },
    {
      title: 'ERA 835 Remittances',
      description: 'Electronic check register linking payments, patient responsibility, and contractual adjustments.',
      page: '/remits',
      top: '380px',
      left: '280px'
    },
    {
      title: 'Patient Balances & Text Pay',
      description: 'Track post-adjudication patient balances and send SMS payment text invoices directly.',
      page: '/collections',
      top: '420px',
      left: '280px'
    },
    {
      title: 'Financial Reports & A/R',
      description: 'A/R aging buckets, cashflow graphs, payer performance matrices, and natural language query bar.',
      page: '/reports',
      top: '140px',
      left: '370px'
    },
    {
      title: 'Developer Portal',
      description: 'Manage API keys and download the full synthetic RCM dataset ZIP with claims and patient records.',
      page: '/developers',
      top: '520px',
      left: '280px'
    },
    {
      title: 'Practice sidebar',
      description: 'Use the sidebar to move between practice, billing, tickets, and settings. The theme control sits next to Demo visitor.',
      page: '/',
      top: '500px',
      left: '370px'
    }
  ];

  if (!tourOpen) return null;

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (steps[nextStep].page !== current.page) {
        router.push(steps[nextStep].page);
      }
    } else {
      setTourOpen(false);
      setStep(0);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      if (steps[prevStep].page !== current.page) {
        router.push(steps[prevStep].page);
      }
    }
  };

  return (
    <>
      {/* Tour popover box */}
      <div
        className="driver-popover taiga-product-tour driver-popover-side-over driver-popover-align-start"
        id="driver-popover-content"
        role="dialog"
        aria-labelledby="driver-popover-title"
        aria-describedby="driver-popover-description"
        style={{
          display: 'block',
          position: 'fixed',
          top: current.top,
          left: current.left,
          zIndex: 10000
        }}
      >
        <button
          type="button"
          onClick={() => {
            setTourOpen(false);
            setStep(0);
          }}
          className="driver-popover-close-btn"
          aria-label="Close"
          style={{ display: 'block' }}
        >
          ×
        </button>
        <div className="driver-popover-arrow driver-popover-arrow-none" />
        <header
          id="driver-popover-title"
          className="driver-popover-title"
          style={{ display: 'block' }}
        >
          {current.title}
        </header>
        <div
          id="driver-popover-description"
          className="driver-popover-description"
          style={{ display: 'block' }}
        >
          {current.description}
        </div>
        <footer className="driver-popover-footer" style={{ display: 'flex' }}>
          <span className="driver-popover-progress-text" style={{ display: 'block' }}>
            {step + 1} of {steps.length}
          </span>
          <span className="driver-popover-navigation-btns">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 0}
              className={`driver-popover-prev-btn driver-popover-footer-btn ${
                step === 0 ? 'driver-popover-btn-disabled' : ''
              }`}
              style={{ display: 'block' }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="driver-popover-next-btn driver-popover-footer-btn"
              style={{ display: 'block' }}
            >
              {step === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </span>
        </footer>
      </div>
    </>
  );
}
