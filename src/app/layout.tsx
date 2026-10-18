import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Geist } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CommandPalette from '@/components/CommandPalette';
import TourGuide from '@/components/TourGuide';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Overview',
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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
          >
            Skip to content
          </a>
          <div data-slot="sidebar-wrapper" className="group/sidebar-wrapper flex w-full has-data-[variant=inset]:bg-sidebar h-svh overflow-hidden">
            <Suspense fallback={<aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:block" />}>
              <Sidebar />
            </Suspense>
            <main id="main-content" data-slot="sidebar-inset" className="relative flex w-full flex-1 flex-col md:m-2 md:ml-0 md:rounded-xl md:shadow-sm md:border md:border-border/80 bg-background overflow-hidden min-w-0">
              <Suspense fallback={<header className="flex min-h-16 shrink-0 items-center justify-between px-4 border-b border-border/70" />}>
                <Header />
              </Suspense>
              <div className="flex-1 overflow-y-auto min-h-0 bg-background pb-mobile-nav md:pb-0">
                <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading module...</div>}>
                  {children}
                </Suspense>
              </div>
            </main>
          </div>

          <MobileNav />

          <Suspense fallback={null}>
            <CommandPalette />
            <TourGuide />
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
