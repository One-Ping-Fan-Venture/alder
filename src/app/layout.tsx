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
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="h-full bg-sidebar text-foreground overflow-hidden font-sans">
        <AppProvider>
          {/* Main App Workspace Shell with Radix sidebar-inset card geometry */}
          <div data-slot="sidebar-wrapper" className="group/sidebar-wrapper flex w-full has-data-[variant=inset]:bg-sidebar h-svh overflow-hidden">
            <Suspense fallback={<aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:block" />}>
              <Sidebar />
            </Suspense>
            <main id="main-content" data-slot="sidebar-inset" className="relative flex w-full flex-1 flex-col md:m-2 md:ml-0 md:rounded-xl md:shadow-sm md:border md:border-border/80 bg-background overflow-hidden min-w-0">
              <Suspense fallback={<header className="flex min-h-16 shrink-0 items-center justify-between px-4 border-b border-border/70" />}>
                <Header />
              </Suspense>
              <div className="flex-1 overflow-y-auto min-h-0 bg-background">
                <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading module...</div>}>
                  {children}
                </Suspense>
              </div>
            </main>
          </div>

          {/* Discreet Floating Persona Dock */}
          <Suspense fallback={null}>
            <PersonaBanner />
          </Suspense>

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
