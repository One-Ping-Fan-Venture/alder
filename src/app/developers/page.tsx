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
      zip.file('README.txt', 'Synthetic Alder demo data. Not real patient or billing records.\nGenerated from Alder Healthcare RCM Platform.');

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
      a.download = 'alder_synthetic_demo_export.zip';
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
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1600px] mx-auto text-foreground">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Code2 className="size-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Developers
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          API keys, documentation, and the OpenAPI specification for the Alder API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* API Keys Card */}
          <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  API Keys
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create organization-scoped keys for the Alder partner API. These are demo-only keys and reset when the app refreshes.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="size-3.5" />
                <span>Create key</span>
              </button>
            </div>

            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="p-3.5 rounded-xl border border-border/70 bg-secondary/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{k.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          k.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {k.status}
                      </span>
                    </div>
                    <div className="font-mono text-muted-foreground truncate max-w-sm">{k.key}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Created {k.created} · Last used {k.lastUsed}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(k.id, k.key)}
                      className="px-2.5 py-1 text-xs border border-border/80 bg-secondary/50 hover:bg-secondary rounded-lg flex items-center gap-1 text-foreground transition-colors font-medium"
                    >
                      {copiedKeyId === k.id ? (
                        <>
                          <Check className="size-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3 text-muted-foreground" />
                          <span>Copy key</span>
                        </>
                      )}
                    </button>
                    {k.status === 'Active' && (
                      <button
                        onClick={() => revokeApiKey(k.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
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
          <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Your data
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download the synthetic demo claims and patient directory as CSV files in one ZIP.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-foreground">
                  Export all data
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Claims and patients as CSV, plus a short README.
                </p>
              </div>

              <button
                onClick={handleExportZip}
                disabled={isExporting}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Download className="size-4" />
                <span>{isExporting ? 'Generating ZIP...' : 'Export all data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Card: API Documentation */}
        <div className="bg-card p-5 rounded-xl border border-border/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            Alder Partner API
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Guides, endpoint reference, and the machine-readable spec.
          </p>

          <div className="space-y-2 text-xs">
            <a
              href="#docs"
              className="p-3 rounded-lg border border-border/80 bg-secondary/30 hover:border-primary/50 flex items-center justify-between text-foreground transition-colors group"
            >
              <div>
                <span className="font-semibold group-hover:text-primary">Documentation</span>
                <p className="text-[10px] text-muted-foreground">Guides, endpoint reference & SDKs</p>
              </div>
              <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary" />
            </a>

            <div className="p-3 rounded-lg border border-border/80 bg-secondary/30 text-foreground">
              <span className="font-semibold">OpenAPI Specification</span>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                https://api.alderbilling.com/openapi.json
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/20 border border-border/60 text-[11px] text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground block">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl p-5 space-y-4 text-foreground"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="text-sm font-bold">
                Create Organization API Key
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Key Description / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EHR Integration Sync"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Scope</label>
                <select className="w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Full Access (Read/Write Claims, Remits, Patients)</option>
                  <option>Read Only (Reporting & Analytics)</option>
                  <option>Eligibility Only (270/271 Check)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-xs"
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
