import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const norm = status?.toLowerCase().trim();

  let style = 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  let label = status.replace(/_/g, ' ');

  if (norm === 'paid (incorrect)' || norm === 'paid_incorrectly') {
    style = 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    label = 'Paid (incorrect)';
  } else if (norm === 'waiting on provider' || norm === 'waiting_for_provider') {
    style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    label = 'Waiting on provider';
  } else if (norm === 'in intake' || norm === 'biller_received') {
    style = 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
    label = norm === 'in intake' ? 'In intake' : 'Received';
  } else if (norm === 'on hold' || norm === 'held_by_customer') {
    style = 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    label = norm === 'on hold' ? 'On hold' : 'Held';
  } else if (norm === 'era review' || norm === 'era_requires_review') {
    style = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    label = 'ERA review';
  } else if (norm === 'not billable' || norm === 'not_billable') {
    style = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    label = 'Not billable';
  } else if (norm === 'era received' || norm === 'era_received') {
    style = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    label = 'ERA received';
  } else if (norm === 'coded') {
    style = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    label = 'Coded';
  } else if (norm === 'submitted' || norm === 'submitted_to_payer') {
    style = 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-800';
    label = 'Submitted';
  } else if (norm === 'paid' || norm === 'finalized_paid') {
    style = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    label = 'Paid';
  } else if (norm === 'denied' || norm === 'finalized_denied') {
    style = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    label = 'Denied';
  } else if (norm === 'rejected') {
    style = 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800';
    label = 'Rejected';
  } else if (norm === 'submitted_to_payer') {
    style = 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-800';
    label = 'Submitted';
  } else if (norm === 'missing_information' || norm === 'awaiting info') {
    style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    label = 'Awaiting info';
  } else if (norm === 'waiting_for_provider') {
    style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    label = 'Provider review';
  } else if (norm === 'era_received') {
    style = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    label = 'ERA received';
  } else if (norm === 'era_requires_review') {
    style = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    label = 'ERA review';
  } else if (norm === 'coded') {
    style = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    label = 'Coded';
  } else if (norm === 'biller_received') {
    style = 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
    label = 'Received';
  } else if (norm === 'paid_incorrectly') {
    style = 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    label = 'Underpaid';
  } else if (norm === 'held_by_customer') {
    style = 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    label = 'Held';
  } else if (norm === 'not_billable') {
    style = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    label = 'Not billable';
  } else if (norm === 'active' || norm === 'approved' || norm === 'collected' || norm === 'ready') {
    style = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    label = status;
  } else if (norm === 'to collect' || norm === 'needs information' || norm === 'pending payer') {
    style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    label = status;
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border ${px} ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
}
