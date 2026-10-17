'use client';

import React from 'react';
import Link from 'next/link';
import { useApp, PERSONAS } from '@/context/AppContext';
import { PersonaRole } from '@/types/rcm';
import { UserCheck, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';

export default function PersonaBanner() {
  const { persona, setPersonaRole, resetDemoData } = useApp();

  return (
    <div className="bg-neutral-900 text-neutral-100 border-b border-neutral-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm select-none z-40 relative">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full text-[11px]">
          <Sparkles className="size-3" />
          <span>Interactive Demo Persona</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-neutral-300">
          <span>Active Role:</span>
          <span className="font-semibold text-white">{persona.name}</span>
          <span className="text-neutral-500">({persona.title})</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {(Object.keys(PERSONAS) as PersonaRole[]).map((roleKey) => {
          const p = PERSONAS[roleKey];
          const isActive = persona.id === roleKey;
          return (
            <button
              key={roleKey}
              onClick={() => setPersonaRole(roleKey)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
              title={p.description}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              <span>{p.badge}</span>
            </button>
          );
        })}

        <div className="h-3 w-px bg-neutral-700 mx-1 hidden sm:block" />

        <button
          onClick={resetDemoData}
          className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded text-[11px] flex items-center gap-1 transition-colors"
          title="Reset modified demo records back to clean initial state"
        >
          <RefreshCw className="size-3" />
          <span className="hidden md:inline">Reset Demo</span>
        </button>
      </div>

      <div className="w-full sm:w-auto text-[11px] text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
        <span className="truncate">{persona.description}</span>
        <span className="text-neutral-500 hidden lg:inline">Quick paths:</span>
        <div className="hidden lg:flex items-center gap-1.5">
          {persona.primaryPages.map((page) => (
            <Link
              key={page}
              href={page}
              className="text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>{page === '/' ? 'Overview' : page.replace('/', '')}</span>
              <ChevronRight className="size-2.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
