'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, LifeBuoy } from 'lucide-react';

const topics = [
  { title: 'Claims', detail: 'How a claim moves from intake to payment.' },
  { title: 'Front desk', detail: 'Check-in, coverage, and copay collection.' },
  { title: 'Remits', detail: 'Reading an 835 and posting a check.' },
  { title: 'Patient balances', detail: 'Sending a payment request after insurance pays.' },
];

export default function HelpPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-3xl mx-auto text-foreground">
      <div>
        <div className="flex items-center gap-2.5">
          <HelpCircle className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">Help center</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Dummy help page for this demo. Articles here are placeholders and do not open a live support site.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <div key={topic.title} className="rounded-xl border border-border/80 bg-card p-4">
            <h2 className="text-sm font-semibold">{topic.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{topic.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Still stuck?</h2>
          <p className="text-xs text-muted-foreground mt-1">Open a ticket and the clinic can see it.</p>
        </div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <LifeBuoy className="size-3.5" />
          Tickets
        </Link>
      </div>
    </div>
  );
}
