'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Stethoscope,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function RoundsPage() {
  const { settings } = useApp();
  const [selectedDay, setSelectedDay] = useState(17);
  const [selectedProvider, setSelectedProvider] = useState('all');

  const daysInMonth = 31;
  const startDayOffset = 4; // Oct 1, 2026 falls on Thursday (Sun=0, Mon=1, Tue=2, Wed=3, Thu=4)

  const mockEncounters = [
    {
      id: 'enc-101',
      patientName: 'Amelia Ross',
      room: 'Room 304 - Bed A',
      mrn: 'MRN-PAT-AMELIA-ROSS',
      provider: 'Dr. Priya Nair',
      time: '08:30 AM',
      status: 'Completed',
      notes: 'Post-op lumbar spine recovery. Vitals stable. Physical therapy approved.',
      cpt: '99232 - Subsequent hospital care, moderate'
    },
    {
      id: 'enc-102',
      patientName: 'Marcus Lee',
      room: 'Room 212 - Bed B',
      mrn: 'MRN-PAT-MARCUS-LEE',
      provider: 'Dr. Samuel Ortiz',
      time: '09:45 AM',
      status: 'In Progress',
      notes: 'Hypertensive monitoring. Medication adjusted. Discharge anticipated tomorrow.',
      cpt: '99231 - Subsequent hospital care, low'
    },
    {
      id: 'enc-103',
      patientName: 'David Kim',
      room: 'Room 108 - Bed A',
      mrn: 'MRN-PAT-DAVID-KIM',
      provider: 'Dr. Hannah Cole',
      time: '11:15 AM',
      status: 'Scheduled',
      notes: 'Diabetic ketoacidosis follow-up. Lab results pending for glycemic control.',
      cpt: '99233 - Subsequent hospital care, high'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Rounds
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Inpatient rounding calendar, daily clinical encounters, and charge capture readiness.
          </p>
        </div>

        {/* Provider selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500 font-medium hidden sm:inline">Provider:</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs rounded-lg shadow-2xs"
          >
            <option value="all">All Attending Providers</option>
            {settings.providers.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar & Encounter Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-emerald-600" />
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                October 2026
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <ChevronLeft className="size-4" />
              </button>
              <button className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                Today
              </button>
              <button className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mt-4 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5 mt-2">
            {/* Leading empty days */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 rounded-lg bg-neutral-50/40 dark:bg-neutral-900/20" />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDay === day;
              const isToday = day === 17;
              const encountersCount = (day * 3) % 7 + 1;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-16 p-2 rounded-lg cursor-pointer border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-neutral-150 dark:border-neutral-800 hover:border-neutral-300 bg-white dark:bg-neutral-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold size-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {day}
                    </span>
                    {day <= 17 && (
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  <div className="text-[10px] text-neutral-400 font-medium truncate">
                    {encountersCount} encounters
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Encounters List */}
        <div className="bg-white dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                Daily Roster
              </span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                October {selectedDay}, 2026
              </h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              {mockEncounters.length} Patients
            </span>
          </div>

          <div className="space-y-3">
            {mockEncounters.map((enc) => (
              <div
                key={enc.id}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {enc.patientName}
                    </h3>
                    <span className="text-[11px] text-neutral-400">{enc.room}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      enc.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        : enc.status === 'In Progress'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400'
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {enc.status}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                  <span className="text-neutral-400">Attending: </span>
                  {enc.provider} · {enc.time}
                </div>

                <p className="text-[11px] text-neutral-500 bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200/60 dark:border-neutral-800">
                  {enc.notes}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-neutral-500">{enc.cpt.split(' - ')[0]}</span>
                  <button className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                    <FileCheck className="size-3" />
                    <span>Ready to Bill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
