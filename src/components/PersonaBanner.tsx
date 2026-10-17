'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp, PERSONAS } from '@/context/AppContext';
import { PersonaRole } from '@/types/rcm';
import { UserCheck, RefreshCw, ChevronUp, ChevronDown, Sparkles, X, ArrowRight } from 'lucide-react';

export default function PersonaBanner() {
  const { persona, setPersonaRole, resetDemoData } = useApp();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none font-sans">
      {/* Popover Expanded Panel */}
      {expanded && (
        <div className="mb-2 w-80 sm:w-96 rounded-xl bg-popover text-popover-foreground border border-border shadow-2xl p-3.5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-primary/20 text-primary flex items-center justify-center">
                <Sparkles className="size-3.5" />
              </div>
              <span className="text-xs font-semibold">Demo Role Switcher</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetDemoData}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
                title="Reset local changes"
              >
                <RefreshCw className="size-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Switch roles to test tailored workflows across Front-of-House, Coding, Billing, and Administration:
          </p>

          {/* Persona Selection Buttons */}
          <div className="grid grid-cols-1 gap-1.5">
            {(Object.keys(PERSONAS) as PersonaRole[]).map((roleKey) => {
              const p = PERSONAS[roleKey];
              const isActive = persona.id === roleKey;
              return (
                <button
                  key={roleKey}
                  onClick={() => {
                    setPersonaRole(roleKey);
                    setExpanded(false);
                  }}
                  className={`flex items-start gap-2.5 p-2 rounded-lg text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 border border-primary/30 text-foreground'
                      : 'hover:bg-muted/70 text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <div className={`size-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {p.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted font-medium text-muted-foreground">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{p.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick links for this persona */}
          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Role shortcuts:</span>
            <div className="flex items-center gap-1.5">
              {persona.primaryPages.map(page => (
                <Link
                  key={page}
                  href={page}
                  onClick={() => setExpanded(false)}
                  className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground text-[10px] font-medium"
                >
                  {page === '/' ? 'overview' : page.replace('/', '')}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-popover/90 text-popover-foreground border border-border shadow-lg hover:shadow-xl backdrop-blur-md text-xs font-medium transition-all hover:scale-102 cursor-pointer group"
      >
        <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
          {persona.avatar}
        </div>
        <span className="text-xs text-foreground font-semibold">{persona.name}</span>
        <span className="text-[10px] text-muted-foreground">({persona.badge})</span>
        {expanded ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronUp className="size-3 text-muted-foreground" />}
      </button>
    </div>
  );
}
