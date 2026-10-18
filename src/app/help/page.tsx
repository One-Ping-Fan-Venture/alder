'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  BookOpen,
  FileCheck,
  Receipt,
  ShieldCheck,
  CreditCard,
  Code2,
  LifeBuoy,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: 'Claims & Billing',
    question: 'How does Taiga automate claim scrubbing and submission?',
    answer:
      'Taiga runs incoming encounter data through a three-stage validation engine: syntax checking (X12 837 compliance), payer-specific medical necessity rules (LCD/NCD), and NCCI bundling edits. Claims passing with 100% clean rates are automatically batched and submitted via SFTP clearinghouse connections at 5:00 PM EST daily.',
  },
  {
    id: '2',
    category: 'Claims & Billing',
    question: 'How do I review and fix rejected or denied claims?',
    answer:
      'Navigate to the Queues tab and select either "Denials" or "Payer Rejections". Each queue item highlights the exact CARC/RARC code, missing modifiers or ICD-10 diagnosis mismatches, and offers a 1-click resubmission workflow after corrections are saved.',
  },
  {
    id: '3',
    category: 'Eligibility',
    question: 'Are eligibility checks performed in real time?',
    answer:
      'Yes. Taiga connects directly via EDI 270/271 real-time inquiry to major commercial and government payers (Aetna, Cigna, BCBS, UnitedHealthcare, Medicare, Medicaid). Responses return within seconds with active coverage status, copays, deductible met/remaining, and OOP maximums.',
  },
  {
    id: '4',
    category: 'Patient Balances',
    question: 'How are patient text balance statements sent?',
    answer:
      'Once insurance adjudicates an ERA/835 and assigns patient responsibility (PR 1, PR 2, PR 3), claims appear in the Patient Balances tab under "Ready to request". You can review the exact SMS copy, line item breakdown, and dispatch text invoice links that allow patients to pay with Apple Pay or credit card with zero portal login required.',
  },
  {
    id: '5',
    category: 'Remits & Reconciliation',
    question: 'How does Taiga reconcile 835 ERA remittance advice?',
    answer:
      'Electronic remittances (835s) are automatically fetched from clearinghouse mailboxes every 4 hours, matched against submitted 837 claims by patient control number (PCN) and service date, and posted to line items. Any variance or short-pay is routed directly to the Underpayments triage queue.',
  },
  {
    id: '6',
    category: 'Integrations & API',
    question: 'Can I connect our custom EHR or practice management system?',
    answer:
      'Yes. Taiga exposes REST webhooks, FHIR R4 endpoints, and SFTP dropboxes for automated batch ingestion of Superbills, HL7 ADT/DFT feeds, and EDI 837 files. Check the Developers tab in the sidebar for API keys and sandbox credentials.',
  },
];

const CATEGORIES = [
  {
    title: 'Claims & Billing',
    icon: FileCheck,
    count: '24 articles',
    description: 'Claim scrubbing rules, NCCI bundling, modifiers, and clearinghouse submission batching.',
  },
  {
    title: 'Eligibility & Benefits',
    icon: ShieldCheck,
    count: '16 articles',
    description: 'Real-time 270/271 queries, secondary insurance discovery, and copay calculation.',
  },
  {
    title: 'Remittances & ERA (835)',
    icon: Receipt,
    count: '18 articles',
    description: 'Auto-posting, CARC/RARC code dictionary, underpayment rules, and EFT reconciliation.',
  },
  {
    title: 'Patient Collections',
    icon: CreditCard,
    count: '12 articles',
    description: 'SMS payment requests, digital statements, Stripe settlement, and balance suppression.',
  },
  {
    title: 'Practice & Providers',
    icon: BookOpen,
    count: '9 articles',
    description: 'Provider NPI onboarding, fee schedules, taxonomy mapping, and clinic locations.',
  },
  {
    title: 'API & EHR Integration',
    icon: Code2,
    count: '15 articles',
    description: 'REST API, Webhook event subscriptions, SFTP automation, and FHIR endpoints.',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>('1');

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Platform</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Help center</span>
        </div>
        <div className="flex items-center gap-2.5 pt-1">
          <HelpCircle className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Help center</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Documentation, guides, and answers to frequently asked questions about the Taiga revenue cycle management platform.
        </p>
      </div>

      {/* Hero Search Section */}
      <div className="relative rounded-xl border border-border/80 bg-card p-6 shadow-xs overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium">
            <Sparkles className="size-3" />
            <span>Taiga Knowledge Base</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">How can we help your billing team today?</h2>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, CARC codes, scrubbing rules, or 835 auto-posting..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border/80 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Knowledge Categories</h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-primary hover:underline"
            >
              Reset category filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.title;
            return (
              <button
                key={cat.title}
                onClick={() => setSelectedCategory(isSelected ? null : cat.title)}
                className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                    : 'border-border/80 bg-card hover:border-primary/50 hover:bg-secondary/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-secondary/70 border border-border/60 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">{cat.count}</span>
                </div>
                <h4 className="font-semibold text-sm text-foreground mt-3">{cat.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ & Common Solutions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Frequently Asked Questions {filteredFaqs.length !== FAQ_DATA.length && `(${filteredFaqs.length} found)`}
          </h3>
          <span className="text-xs text-muted-foreground">Click question to expand answer</span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-border/80 bg-card">
            <p className="text-sm text-muted-foreground">No articles match your search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-border/80 bg-card overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground border border-border/60">
                        {faq.category}
                      </span>
                      <span className="text-sm font-medium text-foreground">{faq.question}</span>
                    </div>
                    <ChevronRight
                      className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/40 leading-relaxed bg-secondary/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Support Drawer Banner */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <LifeBuoy className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Can&apos;t find what you need?</h4>
            <p className="text-xs text-muted-foreground">
              Our dedicated billing support team is standing by to assist with complex payer appeals and EDI setups.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:brightness-110 transition-all shadow-xs"
          >
            <MessageSquare className="size-3.5" />
            <span>Open a ticket</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
