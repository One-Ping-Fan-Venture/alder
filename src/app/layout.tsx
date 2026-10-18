import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Geist } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Alder',
    template: '%s · Alder',
  },
  description: 'Healthcare billing transparency, automated claims lifecycle, and revenue cycle management dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} light h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-sidebar text-foreground overflow-hidden font-sans">
        <AppProvider>
          <Suspense fallback={<div className="h-svh bg-background" />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
