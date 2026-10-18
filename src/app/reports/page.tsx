'use client';

import React, { useState } from 'react';
import { BarChart3, Send } from 'lucide-react';

const suggestions = [
  'Summarize my claims by status',
  'How much of my A/R is over 60 days?',
  'What are my top billed CPT codes?',
  'What’s my outstanding insurance vs patient balance?',
];

const groups = [
  {
    title: 'How the book is doing',
    reports: [
      { name: 'Top-line KPIs', detail: 'Charges, revenue, collection rates, and receivables in one view.' },
      { name: 'Scorecard', detail: 'The standard revenue-cycle metrics, each with its definition.' },
      { name: 'Trends', detail: 'Charges billed and payments collected, month over month.' },
    ],
  },
  {
    title: "What you're owed",
    reports: [
      { name: 'Net Collection Rate', detail: 'How much of what you bill you actually collect.' },
      { name: 'A/R Aging', detail: "What's still outstanding, and how long it has been open." },
    ],
  },
  {
    title: "Why claims don't pay",
    reports: [
      { name: 'First Pass Resolution Rate', detail: 'How often a claim pays on the first submission.' },
      { name: 'Denials', detail: 'Denial reasons, and which payers and codes drive them.' },
    ],
  },
  {
    title: 'What you bill, and to whom',
    reports: [
      { name: 'Payer mix', detail: 'Billed, collected, and outstanding dollars by primary payer.' },
      { name: 'Procedures', detail: 'Volume, units, and collections by procedure code.' },
    ],
  },
];

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setQuery(q);
    setAnswer(`Taiga pulled a report for “${q}” from the demo book. Billing data syncs periodically, so figures may be a little out of date.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-5xl mx-auto text-foreground">
      <div>
        <div className="flex items-center gap-2.5">
          <BarChart3 className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Ask about your claims, charges, A/R, and encounters, or open a report.
        </p>
      </div>

      <section className="rounded-xl border border-border/80 bg-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Ask Taiga about your billing</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Ask in plain English. Taiga pulls the numbers from your claims and puts together a report.
          </p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(query);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Taiga about your billing"
            className="flex-1 rounded-lg border border-border/80 bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Send className="size-3.5" />
            Send
          </button>
        </form>
        <div>
          <p className="text-xs font-medium mb-2">Try one of these</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => ask(item)}
                className="rounded-full border border-border/80 px-3 py-1.5 text-xs hover:bg-muted"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {answer && <p className="text-sm text-foreground">{answer}</p>}
        <p className="text-[11px] text-muted-foreground">
          Billing data syncs periodically, so figures may be a little out of date.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Open a report</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Standing reports across your book, grouped by the question they answer.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground">{group.title}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.reports.map((report) => (
                <button
                  key={report.name}
                  type="button"
                  onClick={() => ask(report.name)}
                  className="rounded-xl border border-border/80 bg-card p-4 text-left hover:bg-muted/40"
                >
                  <div className="text-sm font-semibold">{report.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{report.detail}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
