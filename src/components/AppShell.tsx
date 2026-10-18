'use client';

import React, { Suspense, useLayoutEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { readSession } from '@/lib/auth';
import { appPath } from '@/lib/path';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CommandPalette from '@/components/CommandPalette';
import TourGuide from '@/components/TourGuide';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = appPath(usePathname());
  const router = useRouter();
  const { signedIn } = useApp();
  const onLogin = pathname === '/login';
  const [blocked, setBlocked] = useState(false);

  useLayoutEffect(() => {
    const authed = readSession();
    if (!authed && !onLogin) {
      setBlocked(true);
      router.replace('/login');
      return;
    }
    if (authed && onLogin) {
      setBlocked(true);
      router.replace('/');
      return;
    }
    setBlocked(false);
  }, [signedIn, onLogin, router]);

  if (onLogin) {
    return <>{children}</>;
  }

  return (
    <>
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
      {blocked && <div className="fixed inset-0 z-[80] bg-background" />}
    </>
  );
}
