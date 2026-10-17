'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  UserCheck
} from 'lucide-react';

export default function TicketsPage() {
  const { tickets, addTicket } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [details, setDetails] = useState('');

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket(title, priority, details);
    setTitle('');
    setDetails('');
    setIsModalOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, chatMessage]);
    setChatMessage('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Tickets & Support
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Dedicated Taiga revenue cycle specialists, clearinghouse escalations, and payer follow-up.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>New request</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors space-y-2 ${
                selectedTicket?.id === t.id
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[11px] text-neutral-400">{t.id}</span>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {t.title}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : t.status === 'In Progress'
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 p-2.5 rounded-lg border border-neutral-150 dark:border-neutral-800">
                {t.lastMessage}
              </p>

              <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-1">
                <span>Assigned: {t.assignee}</span>
                <span>Created {t.createdAt} · {t.messagesCount} updates</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Ticket Drawer / Conversation */}
        <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between h-[450px]">
          {selectedTicket ? (
            <>
              <div className="space-y-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">
                  {selectedTicket.id}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedTicket.title}
                </h3>
                <span className="text-xs text-neutral-400 block">
                  Support Lead: {selectedTicket.assignee}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200">
                  <span className="font-bold text-[10px] text-neutral-400 block mb-1">
                    {selectedTicket.assignee}
                  </span>
                  {selectedTicket.lastMessage}
                </div>

                {chatHistory.map((msg, i) => (
                  <div key={i} className="p-3 bg-emerald-600 text-white rounded-lg ml-6">
                    <span className="font-bold text-[10px] text-emerald-200 block mb-1">
                      You (Northstar Billing)
                    </span>
                    {msg}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Reply to ticket specialist..."
                  className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="py-24 text-center text-xs text-neutral-400">
              Select a ticket to view thread and chat with Taiga support.
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Submit Billing Support Request
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Subject / Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquire on delayed Aetna remittance batch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                >
                  <option>Normal</option>
                  <option>High (Impacting reimbursement)</option>
                  <option>Urgent (Clearinghouse outage)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Description & Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the claim ID, check number, or payer issue..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
