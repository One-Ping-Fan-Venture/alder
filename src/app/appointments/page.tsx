'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Appointment } from '@/types/rcm';
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  CircleDollarSign,
  Phone,
  ShieldCheck,
  Calendar,
  X,
  CreditCard,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Upload,
  UserPlus,
  Trash2,
  Flag,
  ExternalLink,
  AlertTriangle,
  Building2,
  Search,
  Filter
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

export default function AppointmentsPage() {
  const { appointments, collectCopay, addAppointment } = useApp();
  const [mainTab, setMainTab] = useState<'appointments' | 'patients'>('appointments');
  const [filterTab, setFilterTab] = useState<'all' | 'to_collect' | 'collected'>('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment>(appointments[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [copayAmount, setCopayAmount] = useState(25);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedOffice, setSelectedOffice] = useState('All locations');
  const [patientSearch, setPatientSearch] = useState('');

  // New appointment form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newMrn, setNewMrn] = useState('');
  const [newPayer, setNewPayer] = useState('Aetna');
  const [newTime, setNewTime] = useState('11:30 AM');
  const [newCopay, setNewCopay] = useState(25);

  const filteredAppts = appointments.filter((a) => {
    if (filterTab === 'to_collect') return a.copayStatus === 'To collect';
    if (filterTab === 'collected') return a.copayStatus === 'Collected';
    return true;
  });

  const toCollectCount = appointments.filter((a) => a.copayStatus === 'To collect').length;
  const collectedCount = appointments.filter((a) => a.copayStatus === 'Collected').length;

  const handleCollectSubmit = () => {
    if (selectedAppt) {
      collectCopay(selectedAppt.id, copayAmount);
      setSelectedAppt({
        ...selectedAppt,
        copayStatus: 'Collected',
        status: 'Ready',
        estCopay: copayAmount
      });
      setIsCollectModalOpen(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = newPatientName.trim().split(' ');
    const first = parts[0] || 'New';
    const last = parts.slice(1).join(' ') || 'Patient';

    addAppointment({
      time: newTime,
      patientId: `pat-${first.toLowerCase()}-${last.toLowerCase()}`,
      firstName: first,
      lastName: last,
      name: `${first} ${last}`,
      mrn: newMrn || `MRN-${first.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      dob: '05/14/1990',
      phone: '(503) 555-0199',
      payer: newPayer,
      plan: 'Preferred PPO',
      coverageStatus: 'Active',
      status: 'Ready',
      estCopay: Number(newCopay),
      copayStatus: 'To collect',
      provider: 'Dr. Priya Nair',
      reason: 'General Consultation'
    });

    setIsAddModalOpen(false);
    setNewPatientName('');
    setNewMrn('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1600px] mx-auto text-foreground">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="size-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Front Desk
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Demo data only
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Today’s visits, copay collections, and check-in status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Bulk upload template downloaded.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors shadow-xs"
          >
            <Upload className="size-3.5 text-muted-foreground" />
            <span>Bulk upload</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="size-3.5" />
            <span>+ New patient</span>
          </button>
        </div>
      </div>

      {/* Main Sub-Header Tabs */}
      <div className="flex items-center gap-6 border-b border-border/70 text-sm font-medium">
        <button
          onClick={() => setMainTab('appointments')}
          className={`pb-3 border-b-2 transition-colors ${
            mainTab === 'appointments'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setMainTab('patients')}
          className={`pb-3 border-b-2 transition-colors ${
            mainTab === 'patients'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Patients List
        </button>
      </div>

      {mainTab === 'appointments' ? (
        <>
          {/* Appointments Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Stepper */}
              <div className="inline-flex items-center rounded-lg border border-border/80 bg-card p-1 shadow-xs">
                <button
                  onClick={() => setSelectedDate(selectedDate === 'Today' ? 'Yesterday' : 'Today')}
                  className="p-1 text-muted-foreground hover:text-foreground rounded"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <div className="flex items-center gap-1.5 px-2 font-medium text-foreground">
                  <Calendar className="size-3 text-primary" />
                  <span>{selectedDate}</span>
                </div>
                <button
                  onClick={() => setSelectedDate(selectedDate === 'Today' ? 'Tomorrow' : 'Today')}
                  className="p-1 text-muted-foreground hover:text-foreground rounded"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>

              {/* Office Selector */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card text-foreground font-medium shadow-xs">
                <Building2 className="size-3.5 text-muted-foreground" />
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none cursor-pointer text-foreground"
                >
                  <option value="All locations" className="bg-card text-foreground">All locations</option>
                  <option value="Main Clinic" className="bg-card text-foreground">Main Clinic (Portland)</option>
                  <option value="Telehealth" className="bg-card text-foreground">Telehealth</option>
                </select>
              </div>

              {/* Segmented Status Toggle Pill */}
              <div className="inline-flex items-center rounded-lg border border-border/80 bg-secondary/50 p-0.5 shadow-xs">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    filterTab === 'all'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All {appointments.length}
                </button>
                <button
                  onClick={() => setFilterTab('to_collect')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    filterTab === 'to_collect'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  To collect {toCollectCount}
                </button>
                <button
                  onClick={() => setFilterTab('collected')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    filterTab === 'collected'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Collected {collectedCount}
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/60 hover:bg-secondary text-xs font-medium text-foreground transition-colors self-start md:self-auto shadow-xs"
            >
              <Plus className="size-3.5 text-primary" />
              <span>+ Add appointment</span>
            </button>
          </div>

          {/* Split Schedule View: Left Schedule Table, Right Detail Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Schedule Pane (~360px / 4 columns) */}
            <div className="lg:col-span-4 bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Start time</th>
                      <th className="py-2.5 px-3 font-semibold">First name</th>
                      <th className="py-2.5 px-3 font-semibold">Last name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredAppts.map((appt, idx) => {
                      const isSelected = selectedAppt?.id === appt.id;
                      const showTimeLine = idx === 3; // Render red current-time indicator line

                      return (
                        <React.Fragment key={appt.id}>
                          {showTimeLine && (
                            <tr className="bg-transparent pointer-events-none">
                              <td colSpan={3} className="p-0">
                                <div className="flex items-center py-1">
                                  <span className="size-2 rounded-full bg-rose-500 shrink-0 -ml-1" />
                                  <div className="h-[2px] bg-rose-500 w-full" />
                                  <span className="text-[10px] text-rose-500 font-mono font-bold px-1 whitespace-nowrap">
                                    12:45 PM
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                          <tr
                            onClick={() => setSelectedAppt(appt)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-secondary text-foreground font-semibold border-l-2 border-primary'
                                : 'hover:bg-secondary/30 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <td className="py-3 px-3 font-mono text-foreground whitespace-nowrap">
                              {appt.time}
                            </td>
                            <td className="py-3 px-3 font-medium text-foreground">
                              {appt.firstName}
                            </td>
                            <td className="py-3 px-3 font-medium text-foreground">
                              {appt.lastName}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Detail Pane (~8 columns) */}
            <div className="lg:col-span-8 space-y-4">
              {selectedAppt ? (
                <>
                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border/80 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => alert(`Marked ${selectedAppt.name} as No-Show.`)}
                        className="px-2.5 py-1.5 rounded-lg border border-border/70 bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors"
                      >
                        Mark no-show
                      </button>
                      <button
                        onClick={() => alert(`Added custom fee for ${selectedAppt.name}.`)}
                        className="px-2.5 py-1.5 rounded-lg border border-border/70 bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground transition-colors"
                      >
                        Add fee
                      </button>
                      <button
                        onClick={() => alert(`Flagged record for review.`)}
                        className="p-1.5 rounded-lg border border-border/70 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="Flag appointment"
                      >
                        <Flag className="size-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Appointment deleted.`)}
                        className="p-1.5 rounded-lg border border-border/70 bg-secondary/50 hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400"
                        title="Delete appointment"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Navigating to patient master record for ${selectedAppt.name}.`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/70 bg-secondary/50 hover:bg-secondary text-xs font-medium text-foreground"
                      >
                        <span>View patient</span>
                        <ExternalLink className="size-3 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          alert(`${selectedAppt.name} marked as Arrived. Ready for Dr. Priya Nair.`);
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
                      >
                        <UserCheck className="size-3.5" />
                        <span>Mark arrived</span>
                      </button>
                    </div>
                  </div>

                  {/* Warning / Copay Alert Banner */}
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 flex items-start gap-2.5">
                    <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground">
                        {selectedAppt.name} copay needs review.
                      </span>
                      <p className="text-muted-foreground text-[11px] mt-0.5">
                        Expected ${selectedAppt.estCopay.toFixed(2)} point-of-service patient copay for Office Visit (99214). Active insurance coverage confirmed with {selectedAppt.payer}.
                      </p>
                    </div>
                  </div>

                  {/* Patient Details & Copay Collection Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Patient Information Card */}
                    <div className="bg-card rounded-xl border border-border/80 p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div>
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                            Patient Identification
                          </span>
                          <h2 className="text-lg font-bold text-foreground mt-0.5">
                            {selectedAppt.name}
                          </h2>
                        </div>
                        <StatusBadge status={selectedAppt.coverageStatus} size="sm" />
                      </div>

                      <div className="space-y-2.5 text-xs divide-y divide-border/50">
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">MRN</span>
                          <span className="font-mono font-medium text-foreground">{selectedAppt.mrn}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Date of Birth</span>
                          <span className="text-foreground">{selectedAppt.dob}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="text-foreground">{selectedAppt.phone}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Provider</span>
                          <span className="font-medium text-foreground">{selectedAppt.provider}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Reason</span>
                          <span className="text-foreground">{selectedAppt.reason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Coverage & Copay Collection Card */}
                    <div className="bg-card rounded-xl border border-border/80 p-5 space-y-4 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                          <div>
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                              Insurance & Billing
                            </span>
                            <h3 className="text-base font-bold text-foreground mt-0.5">
                              {selectedAppt.payer}
                            </h3>
                          </div>
                          <StatusBadge status={selectedAppt.copayStatus} size="sm" />
                        </div>

                        <div className="space-y-2.5 text-xs pt-3 divide-y divide-border/50">
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="text-foreground">{selectedAppt.plan}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Eligibility Check</span>
                            <span className="text-emerald-400 font-medium">Verified Real-Time (270/271)</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Estimated Copay</span>
                            <span className="text-lg font-bold text-foreground">
                              ${selectedAppt.estCopay.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/60">
                        {selectedAppt.copayStatus === 'Collected' ? (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-center gap-2">
                            <CheckCircle2 className="size-4" />
                            <span className="font-semibold">Copay of ${selectedAppt.estCopay.toFixed(2)} Collected</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setCopayAmount(selectedAppt.estCopay);
                              setIsCollectModalOpen(true);
                            }}
                            className="w-full py-2 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <CreditCard className="size-3.5" />
                            <span>Collect Copay (${selectedAppt.estCopay.toFixed(2)})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-card rounded-xl border border-border/80 p-8 text-center text-muted-foreground text-xs">
                  Select an appointment on the left to view details.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Patients List Tab */
        <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/60">
            <div className="relative w-full max-w-sm">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient name, MRN, or DOB..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <span className="text-xs text-muted-foreground">Showing {appointments.length} Registered Patients</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">MRN</th>
                  <th className="py-2.5 px-3">DOB</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Primary Insurance</th>
                  <th className="py-2.5 px-3">Eligibility</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {appointments
                  .filter((p) => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.mrn.toLowerCase().includes(patientSearch.toLowerCase()))
                  .map((patient) => (
                    <tr key={patient.id} className="hover:bg-secondary/20">
                      <td className="py-3 px-3 font-semibold text-foreground">{patient.name}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{patient.mrn}</td>
                      <td className="py-3 px-3 text-muted-foreground">{patient.dob}</td>
                      <td className="py-3 px-3 text-muted-foreground">{patient.phone}</td>
                      <td className="py-3 px-3 text-foreground font-medium">{patient.payer} ({patient.plan})</td>
                      <td className="py-3 px-3"><StatusBadge status={patient.coverageStatus} size="sm" /></td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppt(patient);
                            setMainTab('appointments');
                          }}
                          className="text-primary hover:underline font-medium text-xs"
                        >
                          View Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Copay Modal Dialog */}
      {isCollectModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                <h3 className="text-sm font-bold">Collect Copay</h3>
              </div>
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-muted-foreground block text-[11px] mb-1">Patient</label>
                <div className="p-2.5 rounded-lg bg-secondary/40 font-semibold text-foreground">
                  {selectedAppt.name} ({selectedAppt.mrn})
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block text-[11px] mb-1">Copay Amount ($)</label>
                <input
                  type="number"
                  value={copayAmount}
                  onChange={(e) => setCopayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground font-bold text-base focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-muted-foreground block text-[11px] mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Credit Card', 'Cash', 'Check / HSA'].map((method, idx) => (
                    <button
                      key={method}
                      type="button"
                      className={`p-2 rounded-lg border text-center text-xs font-medium ${
                        idx === 0
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/80 bg-secondary/30 text-muted-foreground'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border/80 bg-secondary/50 text-xs font-medium text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCollectSubmit}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
              >
                Confirm Payment & Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Plus className="size-4 text-primary" />
                <h3 className="text-sm font-bold">Add New Appointment</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-muted-foreground block text-[11px] mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block text-[11px] mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block text-[11px] mb-1">Est. Copay ($)</label>
                  <input
                    type="number"
                    value={newCopay}
                    onChange={(e) => setNewCopay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block text-[11px] mb-1">Primary Payer</label>
                <select
                  value={newPayer}
                  onChange={(e) => setNewPayer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Aetna">Aetna</option>
                  <option value="UnitedHealthcare">UnitedHealthcare</option>
                  <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                  <option value="Oregon Health Plan">Oregon Health Plan</option>
                  <option value="Medicare Part B">Medicare Part B</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border/80 bg-secondary/50 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
