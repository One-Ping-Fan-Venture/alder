'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUp,
  X,
  FileUp,
  UserCheck,
  Calendar
} from 'lucide-react';

interface DayData {
  day: number;
  pnStatus: 'billed' | 'uploaded' | 'missing';
  soStatus: 'billed' | 'uploaded' | 'missing';
  encounters?: {
    patient: string;
    mrn: string;
    room: string;
    cpt: string;
    time: string;
    provider: string;
  }[];
}

export default function RoundsPage() {
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [uploadedDays, setUploadedDays] = useState<number[]>([18]);

  // October 2026 calendar structure:
  // Oct 1st is Thursday -> 4 empty padding cells (Sun=0, Mon=1, Tue=2, Wed=3)
  const emptyDaysStart = 4;
  const daysInMonth = 31;

  // Provider status by day:
  // Days 4 and 11: All visits billed (Green ✓)
  // Day 18: Uploaded (Orange ↑)
  // Others: Not uploaded (missing)
  const getDayStatus = (day: number): { pn: 'billed' | 'uploaded' | 'missing'; so: 'billed' | 'uploaded' | 'missing' } => {
    if (day === 4 || day === 11) {
      return { pn: 'billed', so: 'billed' };
    }
    if (day === 18 || uploadedDays.includes(day)) {
      return { pn: 'uploaded', so: 'uploaded' };
    }
    return { pn: 'missing', so: 'missing' };
  };

  const handleSimulateUpload = (day: number) => {
    if (!uploadedDays.includes(day)) {
      setUploadedDays((prev) => [...prev, day]);
    }
    setSelectedDay(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-5 text-foreground" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Rounds
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Synthetic rounds sheets. Orange means uploaded; green means the demo visits are complete. Real uploads and billing are disabled.
        </p>
      </div>

      {/* Controls & Legend Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: This Month & Stepper */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth('October 2026')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/70 hover:bg-secondary text-foreground border border-border/80 transition-colors shadow-2xs"
          >
            This month
          </button>

          <div className="flex items-center gap-1.5 bg-secondary/40 border border-border/80 rounded-lg p-1 text-xs shadow-2xs">
            <button
              onClick={() => {}}
              aria-label="Previous month"
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-semibold text-foreground px-2 min-w-[100px] text-center">
              {currentMonth}
            </span>
            <button
              onClick={() => {}}
              aria-label="Next month"
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Right: Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border border-border/80 inline-block" />
            <span>Not uploaded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f97316] inline-block" />
            <span>Uploaded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#10b981] inline-block" />
            <span>All visits billed</span>
          </div>
        </div>
      </div>

      {/* Missing Provider Status Card */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-xs space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Yesterday:</span>
          <span className="text-foreground font-medium">still missing PN, SO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Today:</span>
          <span className="text-foreground font-medium">still missing PN, SO</span>
        </div>
      </div>

      {/* 7x5 Monthly Calendar Grid */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        {/* Day Headers */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
          className="border-b border-border/70 bg-secondary/30 text-center text-xs font-semibold text-muted-foreground py-2.5"
        >
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Cells Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
          className="gap-px bg-border/60"
        >
          {/* Empty padding days for October 2026 (Sun-Wed) */}
          {Array.from({ length: emptyDaysStart }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="bg-card/40 min-h-[92px] p-2 select-none"
            />
          ))}

          {/* Days 1 through 31 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === 17;
            const status = getDayStatus(day);

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className="bg-card min-h-[92px] p-2 flex flex-col justify-between hover:bg-secondary/30 transition-colors cursor-pointer group"
              >
                {/* Day Header Row */}
                <div className="flex items-center justify-between">
                  {isToday ? (
                    <div
                      style={{
                        backgroundColor: '#0074c9',
                        color: '#ffffff',
                        width: '22px',
                        height: '22px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      {day}
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors pl-0.5">
                      {day}
                    </span>
                  )}
                </div>

                {/* Stacked Provider Badges */}
                <div className="space-y-1 mt-2">
                  {/* Priya Nair (PN) */}
                  <ProviderBadge
                    name="PN"
                    fullName="Dr. Priya Nair"
                    status={status.pn}
                  />

                  {/* Sarah Owens (SO) */}
                  <ProviderBadge
                    name="SO"
                    fullName="Dr. Sarah Owens"
                    status={status.so}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail / Simulation Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border/80 bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">
                  Rounds Sheet — October {selectedDay}, 2026
                </h3>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Dr. Priya Nair (Attending)</span>
                  <StatusPill status={getDayStatus(selectedDay).pn} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Dr. Sarah Owens (Attending)</span>
                  <StatusPill status={getDayStatus(selectedDay).so} />
                </div>
              </div>

              <div className="text-muted-foreground text-[11px] leading-relaxed">
                {selectedDay === 4 || selectedDay === 11 ? (
                  <p className="text-emerald-400">
                    ✓ All clinical encounters for this rounding day have been adjudicated and submitted to clearinghouses.
                  </p>
                ) : uploadedDays.includes(selectedDay) || selectedDay === 18 ? (
                  <p className="text-amber-400">
                    ↑ Clinical encounter charge sheet uploaded. Auto-coder review is in progress.
                  </p>
                ) : (
                  <p>
                    No rounding sheets uploaded yet for October {selectedDay}. You can simulate uploading a provider rounds charge sheet below.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-border/60">
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border/80 hover:bg-secondary text-foreground"
              >
                Close
              </button>
              {!uploadedDays.includes(selectedDay) && selectedDay !== 4 && selectedDay !== 11 && (
                <button
                  onClick={() => handleSimulateUpload(selectedDay)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:brightness-110 flex items-center gap-1.5"
                >
                  <FileUp className="size-3.5" />
                  <span>Simulate Upload</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderBadge({
  name,
  fullName,
  status
}: {
  name: string;
  fullName: string;
  status: 'billed' | 'uploaded' | 'missing';
}) {
  if (status === 'billed') {
    return (
      <div
        title={`${fullName} — All visits billed`}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#052e16]/90 border border-[#166534] text-[#4ade80] shadow-2xs"
      >
        <Check className="size-3 stroke-[2.5]" />
        <span>{name}</span>
      </div>
    );
  }

  if (status === 'uploaded') {
    return (
      <div
        title={`${fullName} — Sheet uploaded`}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#431407]/90 border border-[#9a3412] text-[#fb923c] shadow-2xs"
      >
        <ArrowUp className="size-3 stroke-[2.5]" />
        <span>{name}</span>
      </div>
    );
  }

  return (
    <div
      title={`${fullName} — Not uploaded`}
      className="flex items-center justify-start px-2 py-0.5 rounded text-[10px] font-medium border border-dashed border-border/70 text-muted-foreground/60 group-hover:border-border transition-colors"
    >
      <span>{name}</span>
    </div>
  );
}

function StatusPill({ status }: { status: 'billed' | 'uploaded' | 'missing' }) {
  if (status === 'billed') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 border border-emerald-700 text-emerald-400">
        All visits billed
      </span>
    );
  }
  if (status === 'uploaded') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 border border-amber-700 text-amber-400">
        Uploaded
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary/80 border border-border/80 text-muted-foreground">
      Not uploaded
    </span>
  );
}
