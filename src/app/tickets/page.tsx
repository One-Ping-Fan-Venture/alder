'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface SupportTicket {
  id: string;
  number: string;
  subject: string;
  requestedBy: string;
  created: string;
  lastActivity: string;
  status: 'Waiting on you' | 'Submitted' | 'In progress' | 'Resolved';
  category: 'waiting' | 'alder' | 'done';
  hasNewActivity?: boolean;
  messages: {
    sender: string;
    isStaff: boolean;
    time: string;
    text: string;
  }[];
}

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<'waiting' | 'alder' | 'done'>('waiting');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Chat message in ticket
  const [replyText, setReplyText] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 't-3012',
      number: '3012',
      subject: 'Remit missing for the Aug 12 UnitedHealthcare deposit',
      requestedBy: 'Priya Shah',
      created: 'Oct 11, 2026',
      lastActivity: '2d ago',
      status: 'Waiting on you',
      category: 'waiting',
      hasNewActivity: true,
      messages: [
        {
          sender: 'Priya Shah',
          isStaff: false,
          time: 'Oct 11 at 10:15 AM',
          text: 'We noticed a deposit of $1,420.50 from UnitedHealthcare in our Columbia Bank account on Aug 12, but there is no 835 remit file matched in Alder.'
        },
        {
          sender: 'Austin Cooper (Alder Clearinghouse Lead)',
          isStaff: true,
          time: 'Oct 12 at 02:40 PM',
          text: 'Hi Priya, we checked Optum Clearinghouse for that trace number. UHC flagged this as an ERA that needs manual payer portal credential re-authentication. Could you upload the EOB voucher PDF from the UHC portal so we can ingest it directly?'
        }
      ]
    },
    {
      id: 't-3004',
      number: '3004',
      subject: 'Add our new nurse practitioner to billing',
      requestedBy: 'Danielle Ortiz',
      created: 'Oct 15, 2026',
      lastActivity: '2d ago',
      status: 'Submitted',
      category: 'alder',
      hasNewActivity: true,
      messages: [
        {
          sender: 'Danielle Ortiz',
          isStaff: false,
          time: 'Oct 15 at 09:00 AM',
          text: 'We hired Sarah Owens, NP (NPI 1492049182). We need her linked to Northstar Family Health active contracts across Aetna, BCBS, and OHP.'
        },
        {
          sender: 'Austin Cooper (Alder Specialist)',
          isStaff: true,
          time: 'Oct 15 at 01:15 PM',
          text: 'Enrollment paperwork submitted to CAQH and Oregon Medicaid. Expecting payer roster updates within 5 business days.'
        }
      ]
    },
    {
      id: 't-3009',
      number: '3009',
      subject: 'Eligibility keeps failing for a patient with active coverage',
      requestedBy: 'You',
      created: 'Oct 13, 2026',
      lastActivity: '3d ago',
      status: 'In progress',
      category: 'alder',
      hasNewActivity: true,
      messages: [
        {
          sender: 'You',
          isStaff: false,
          time: 'Oct 13 at 11:30 AM',
          text: 'Patient Amelia Ross (MEM-ROSS-01) returned 271 Inactive when run through real-time check, but her physical card is valid through Dec 2026.'
        },
        {
          sender: 'Austin Cooper (Alder Specialist)',
          isStaff: true,
          time: 'Oct 14 at 10:00 AM',
          text: 'We re-queried Aetna via Availity EDI gateway with subscriber date of birth override; coverage is active and in-network. Clearinghouse cache cleared.'
        }
      ]
    },
    {
      id: 't-2996',
      number: '2996',
      subject: 'Question about the claims CSV export columns',
      requestedBy: 'You',
      created: 'Oct 5, 2026',
      lastActivity: '12d ago',
      status: 'Resolved',
      category: 'done',
      hasNewActivity: false,
      messages: [
        {
          sender: 'You',
          isStaff: false,
          time: 'Oct 5 at 03:20 PM',
          text: 'Can we include CARC denial codes and secondary payer columns in the standard weekly claims export?'
        },
        {
          sender: 'Austin Cooper (Alder Specialist)',
          isStaff: true,
          time: 'Oct 6 at 09:10 AM',
          text: 'Done! Added CARC, RARC, and Secondary Payer columns to your clinic’s custom export schema.'
        }
      ]
    },
    {
      id: 't-2989',
      number: '2989',
      subject: 'Underpayment on two office-visit claims',
      requestedBy: 'Priya Shah',
      created: 'Sep 28, 2026',
      lastActivity: '15d ago',
      status: 'Resolved',
      category: 'done',
      hasNewActivity: false,
      messages: [
        {
          sender: 'Priya Shah',
          isStaff: false,
          time: 'Sep 28 at 01:00 PM',
          text: 'Two 99214 claims were reimbursed at $89 instead of contracted $142 rate.'
        },
        {
          sender: 'Austin Cooper (Alder Specialist)',
          isStaff: true,
          time: 'Oct 1 at 04:30 PM',
          text: 'Appealed to Cigna under Fee Schedule Dispute #49102. Payer issued reconciliation remit with $106 retroactive adjustment.'
        }
      ]
    }
  ]);

  const waitingCount = tickets.filter((t) => t.category === 'waiting').length;
  const alderCount = tickets.filter((t) => t.category === 'alder').length;
  const doneCount = tickets.filter((t) => t.category === 'done').length;

  const filteredTickets = tickets.filter((t) => t.category === activeTab);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'You (Northstar Billing)',
      isStaff: false,
      time: 'Just now',
      text: replyText
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              lastActivity: 'Just now',
              messages: [...t.messages, newMsg]
            }
          : t
      )
    );

    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            lastActivity: 'Just now',
            messages: [...prev.messages, newMsg]
          }
        : null
    );

    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newId = `t-${3020 + tickets.length}`;
    const newNum = `${3020 + tickets.length}`;

    const newTicket: SupportTicket = {
      id: newId,
      number: newNum,
      subject,
      requestedBy: 'You',
      created: 'Just now',
      lastActivity: 'Just now',
      status: 'Submitted',
      category: 'alder',
      hasNewActivity: true,
      messages: [
        {
          sender: 'You',
          isStaff: false,
          time: 'Just now',
          text: description || subject
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setDescription('');
    setIsNewRequestOpen(false);
    setActiveTab('alder');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Header Row with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tickets
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Your practice's support tickets — everyone at the clinic sees them all. Submit a request and track its progress, or start a chat for a quick question. Replies also reach you by email.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border/80 bg-secondary/60 hover:bg-secondary text-foreground transition-colors shadow-2xs"
          >
            Chat with us
          </button>
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-xs"
          >
            New request
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-6 border-b border-border/70 text-xs font-medium">
        <button
          onClick={() => setActiveTab('waiting')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'waiting'
              ? 'text-foreground font-semibold border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Waiting on you {waitingCount}
        </button>
        <button
          onClick={() => setActiveTab('alder')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'alder'
              ? 'text-foreground font-semibold border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          With Alder {alderCount}
        </button>
        <button
          onClick={() => setActiveTab('done')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'done'
              ? 'text-foreground font-semibold border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Done {doneCount}
        </button>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-3">Ticket</th>
                <th className="py-2.5 px-3">Requested By</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Last Activity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {t.hasNewActivity && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase shrink-0">
                          New activity
                        </span>
                      )}
                      <span className="group-hover:text-primary transition-colors">
                        {t.subject}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground font-mono">
                    #{t.number}
                  </td>
                  <td className="py-3 px-3 text-foreground">{t.requestedBy}</td>
                  <td className="py-3 px-3 text-muted-foreground">{t.created}</td>
                  <td className="py-3 px-3 text-muted-foreground">{t.lastActivity}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                          : t.status === 'Waiting on you'
                          ? 'bg-amber-950/60 border-amber-800/80 text-amber-400'
                          : 'bg-primary/15 border-primary/30 text-primary'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Conversation Drawer / Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-card border border-border/80 rounded-xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-border/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{selectedTicket.number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                        : selectedTicket.status === 'Waiting on you'
                        ? 'bg-amber-950/60 border-amber-800/80 text-amber-400'
                        : 'bg-primary/15 border-primary/30 text-primary'
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 py-2 text-xs pr-1">
              {selectedTicket.messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border leading-relaxed ${
                    m.isStaff
                      ? 'bg-secondary/60 border-border/80 text-foreground mr-6'
                      : 'bg-primary/15 border-primary/30 text-foreground ml-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-foreground">
                      {m.sender}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {m.time}
                    </span>
                  </div>
                  <p className="text-xs">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-border/60 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply to Alder support..."
                className="flex-1 px-3 py-2 bg-secondary/40 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Request Dialog */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateTicket}
            className="w-full max-w-md bg-card border border-border/80 rounded-xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground">
                Submit a new request
              </h3>
              <button
                type="button"
                onClick={() => setIsNewRequestOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-foreground font-medium">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missing remit for UHC electronic deposit"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/40 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-medium">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please provide details, patient name, claim ID, or deposit date..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/40 border border-border/80 rounded-lg text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsNewRequestOpen(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:brightness-110 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Submit request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat with us Dialog */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border/80 rounded-xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Live Billing Specialist Chat
                </h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Austin Cooper is online and ready to assist Northstar Family Health with clearinghouse rejections, fee schedules, or credentialing.
            </p>
            <div className="p-3 bg-secondary/60 rounded-lg border border-border/70 text-xs space-y-1">
              <span className="font-semibold text-foreground block">Typical response time:</span>
              <span className="text-emerald-400">Under 2 minutes</span>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsChatOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:brightness-110 rounded-lg shadow-xs"
              >
                Start conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
