'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import JSZip from 'jszip';
import {
  Code2,
  KeyRound,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  FileCode,
  ShieldAlert,
  X
} from 'lucide-react';

export default function DevelopersPage() {
  const { apiKeys, createApiKey, revokeApiKey, claims, patients } = useApp();
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = (id: string, keyVal: string) => {
    navigator.clipboard.writeText(keyVal);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApiKey(newKeyName);
    setNewKeyName('');
    setIsCreateModalOpen(false);
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // 1. README
      zip.file('README.txt', 'Synthetic Taiga demo data. Not real patient or billing records.\nGenerated from Taiga Healthcare RCM Platform.');

      // 2. Claims CSV
      const claimHeader = 'Claim ID,Patient ID,Payer,Status,Charged cents\n';
      const claimRows = claims
        .map((c) => `${c.id},${c.patientId},${c.payer},${c.status},${Math.round(c.billed * 100)}`)
        .join('\n');
      zip.file('claims.csv', claimHeader + claimRows);

      // 3. Patients CSV
      const patientHeader = 'Patient ID,First name,Last name,Birth date,MRN\n';
      const patientRows = patients
        .map((p) => `${p.id},${p.firstName},${p.lastName},${p.birthDate},${p.mrn}`)
        .join('\n');
      zip.file('patients.csv', patientHeader + patientRows);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'taiga_synthetic_demo_export.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Code2 className="size-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Developers
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Partner API credentials, webhook integrations, and synthetic dataset export.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* API Keys Card */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  API Keys
                </h2>
                <p className="text-xs text-neutral-400">
                  Create organization-scoped keys for the Taiga partner API.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="size-3.5" />
                <span>Create key</span>
              </button>
            </div>

            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{k.name}</span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          k.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {k.status}
                      </span>
                    </div>
                    <div className="font-mono text-neutral-500 truncate max-w-sm">{k.key}</div>
                    <div className="text-[11px] text-neutral-400">
                      Created {k.created} · Last used {k.lastUsed}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(k.id, k.key)}
                      className="px-2.5 py-1 text-xs border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 rounded-lg flex items-center gap-1 transition-colors font-medium"
                    >
                      {copiedKeyId === k.id ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3 text-neutral-500" />
                          <span>Copy key</span>
                        </>
                      )}
                    </button>
                    {k.status === 'Active' && (
                      <button
                        onClick={() => revokeApiKey(k.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Revoke key"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Data Export Card */}
          <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Your Data (Synthetic Export)
                </h2>
                <p className="text-xs text-neutral-400">
                  Download all 1,546 synthetic demo claims and 268 patient records as CSV files in one ZIP.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Full Dataset Package (ZIP)
                </span>
                <p className="text-[11px] text-neutral-500">
                  Includes: claims.csv (81 KB), patients.csv (14 KB), README.txt
                </p>
              </div>

              <button
                onClick={handleExportZip}
                disabled={isExporting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Download className="size-4" />
                <span>{isExporting ? 'Generating ZIP...' : 'Export all data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Card: API Documentation */}
        <div className="bg-white dark:bg-neutral-850 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Taiga Partner API
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Integrate your EHR or custom billing software directly with Taiga’s automated revenue cycle engine using REST webhooks and FHIR/EDI endpoints.
          </p>

          <div className="space-y-2 text-xs">
            <a
              href="https://docs.taigabilling.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 flex items-center justify-between text-neutral-800 dark:text-neutral-200 transition-colors group"
            >
              <div>
                <span className="font-semibold group-hover:text-emerald-600">Documentation</span>
                <p className="text-[10px] text-neutral-400">Guides, endpoint reference & SDKs</p>
              </div>
              <ExternalLink className="size-3.5 text-neutral-400 group-hover:text-emerald-600" />
            </a>

            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
              <span className="font-semibold">OpenAPI Specification</span>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                https://api.taigabilling.com/openapi.json
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-750 text-[11px] text-neutral-500 space-y-1">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 block">
              Demo Environment Note:
            </span>
            <p>
              All API keys generated here operate in simulated sandbox mode. Calls return realistic synthetic adjudication payloads matching ANSI 837P and 835 EDI formats.
            </p>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Create Organization API Key
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Key Description / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EHR Integration Sync"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Scope</label>
                <select className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs">
                  <option>Full Access (Read/Write Claims, Remits, Patients)</option>
                  <option>Read Only (Reporting & Analytics)</option>
                  <option>Eligibility Only (270/271 Check)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Generate Key
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
