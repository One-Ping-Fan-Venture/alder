import type { ReactNode } from 'react';
import claims from '@/data/claims.json';

export function generateStaticParams() {
  return (claims as { id: string }[]).map((claim) => ({ id: claim.id }));
}

export default function ClaimLayout({ children }: { children: ReactNode }) {
  return children;
}
