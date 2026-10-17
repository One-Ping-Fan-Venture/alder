import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import PersonaBanner from '@/components/PersonaBanner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CommandPalette from '@/components/CommandPalette';
import TourGuide from '@/components/TourGuide';

export const metadata: Metadata = {
  title: 'Taiga Billing | Healthcare Revenue Cycle Management',
  description: 'Healthcare billing transparency, automated claims lifecycle, and revenue cycle management dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
        <AppProvider>
          {/* Top Demo Persona Banner */}
          <PersonaBanner />

          {/* Main App Workspace Shell */}
          <div className="flex-1 flex overflow-hidden">
            <Suspense fallback={<aside className="w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800" />}>
              <Sidebar />
            </Suspense>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-neutral-900">
              <Suspense fallback={<header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />}>
                <Header />
              </Suspense>
              <main className="flex-1 overflow-y-auto min-h-0 bg-neutral-50/50 dark:bg-neutral-900/50">
                <Suspense fallback={<div className="p-8 text-xs text-neutral-400">Loading module...</div>}>
                  {children}
                </Suspense>
              </main>
            </div>
          </div>

          {/* Global Modals & Dialogs */}
          <Suspense fallback={null}>
            <CommandPalette />
            <TourGuide />
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
