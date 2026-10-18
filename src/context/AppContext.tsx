'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Claim,
  Patient,
  Appointment,
  WorkQueue,
  PriorAuth,
  Remit,
  Settings,
  Ticket,
  Persona,
  PersonaRole
} from '@/types/rcm';

import initialClaims from '@/data/claims.json';
import initialPatients from '@/data/patients.json';
import initialAppointments from '@/data/appointments.json';
import initialQueues from '@/data/queues.json';
import initialPriorAuths from '@/data/prior_auth.json';
import initialRemits from '@/data/remits.json';
import initialSettings from '@/data/settings.json';
import initialTickets from '@/data/tickets.json';

export const PERSONAS: Record<PersonaRole, Persona> = {
  front_desk: {
    id: 'front_desk',
    title: 'Front Desk Receptionist',
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    badge: 'Front-of-House',
    description: 'Manages patient intake, appointment rosters, insurance eligibility checks, and point-of-service copay collections.',
    primaryPages: ['/appointments', '/eligibility', '/rounds']
  },
  biller: {
    id: 'biller',
    title: 'Certified Medical Biller',
    name: 'Alex Rivera, CPC',
    avatar: 'AR',
    badge: 'Billing Specialist',
    description: 'Reviews clinical encounters, codes ICD-10/CPT, submits EDI 837 claims, works clearinghouse rejections, and follows up on denials.',
    primaryPages: ['/claims', '/queues', '/prior-auth']
  },
  supervisor: {
    id: 'supervisor',
    title: 'RCM Billing Supervisor',
    name: 'Morgan Blake',
    avatar: 'MB',
    badge: 'Revenue Cycle Lead',
    description: 'Monitors net collection rates, days in A/R, aging buckets over 30/90 days, ERA 835 reconciliation, and queue throughput.',
    primaryPages: ['/', '/reports', '/remits', '/collections']
  },
  admin: {
    id: 'admin',
    title: 'Practice Administrator & IT',
    name: 'Dr. Taylor Vance',
    avatar: 'TV',
    badge: 'Executive & Admin',
    description: 'Oversees provider credentialing, payer contracts, fee schedule chargemasters, bank reconciliations, and API integrations.',
    primaryPages: ['/settings', '/developers', '/tickets']
  }
};

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

interface AppContextType {
  claims: Claim[];
  patients: Patient[];
  appointments: Appointment[];
  queues: WorkQueue[];
  priorAuths: PriorAuth[];
  remits: Remit[];
  settings: Settings;
  tickets: Ticket[];
  apiKeys: ApiKeyItem[];
  persona: Persona;
  setPersonaRole: (role: PersonaRole) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  tourOpen: boolean;
  setTourOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  updateClaimStatus: (claimId: string, newStatus: string, taskResolution?: string) => void;
  collectCopay: (appointmentId: string, amount: number) => void;
  addAppointment: (appt: Omit<Appointment, 'id'>) => void;
  createApiKey: (name: string) => ApiKeyItem;
  revokeApiKey: (id: string) => void;
  addTicket: (title: string, priority: string, details: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [personaRole, setPersonaRoleState] = useState<PersonaRole>('supervisor');
  const [tourOpen, setTourOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [claims, setClaims] = useState<Claim[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taiga_rcm_claims_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return initialClaims as unknown as Claim[];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taiga_rcm_appointments_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return initialAppointments as unknown as Appointment[];
  });

  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key-1',
      name: 'Production sync',
      key: 'tk_demo_84e2c0f4e7b24fd0b1f9c5d3',
      created: 'Jun 5, 2026',
      lastUsed: 'Jun 29, 2026',
      status: 'Active'
    },
    {
      id: 'key-2',
      name: 'Internal tooling',
      key: 'tk_demo_1d9f0c0ab1b34d8f8c2a4e6f',
      created: 'Jun 18, 2026',
      lastUsed: 'Jun 27, 2026',
      status: 'Active'
    }
  ]);

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets as unknown as Ticket[]);

  // Theme synchronization
  useEffect(() => {
    const saved = localStorage.getItem('taiga_theme');
    const isDark = saved === 'dark';
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('taiga_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('taiga_theme', 'light');
      }
      return next;
    });
  };

  const setPersonaRole = (role: PersonaRole) => {
    setPersonaRoleState(role);
  };

  const updateClaimStatus = (claimId: string, newStatus: string, taskResolution?: string) => {
    setClaims(prev => {
      const updated = prev.map(c => {
        if (c.id === claimId) {
          const newTasks = taskResolution
            ? c.tasks.map(t => ({ ...t, status: 'resolved' as const }))
            : c.tasks;
          const newActivity = [
            {
              date: 'Oct 17, 2026',
              event: taskResolution
                ? `Task resolved: ${taskResolution}. Status changed to ${newStatus.replace('_', ' ')}`
                : `Status updated to ${newStatus.replace('_', ' ')}`
            },
            ...c.activity
          ];
          return {
            ...c,
            status: newStatus,
            tasks: newTasks,
            activity: newActivity,
            lastUpdated: 'Oct 17, 2026'
          };
        }
        return c;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('taiga_rcm_claims_v2', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const collectCopay = (appointmentId: string, amount: number) => {
    setAppointments(prev => {
      const updated = prev.map(a => {
        if (a.id === appointmentId) {
          return {
            ...a,
            copayStatus: 'Collected' as const,
            status: 'Ready' as const,
            estCopay: amount
          };
        }
        return a;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('taiga_rcm_appointments_v2', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addAppointment = (appt: Omit<Appointment, 'id'>) => {
    const newA: Appointment = {
      ...appt,
      id: `apt-${Date.now().toString().slice(-4)}`
    };
    setAppointments(prev => {
      const updated = [newA, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('taiga_rcm_appointments_v2', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const createApiKey = (name: string): ApiKeyItem => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: name || 'Demo API key',
      key: `tk_demo_${randomHex}`,
      created: 'Oct 17, 2026',
      lastUsed: 'Never',
      status: 'Active'
    };
    setApiKeys(prev => [newKey, ...prev]);
    return newKey;
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
  };

  const addTicket = (title: string, priority: string, details: string) => {
    const newTkt: Ticket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      title,
      priority,
      status: 'Open',
      createdAt: 'Oct 17, 2026',
      assignee: 'Taiga Support Team',
      messagesCount: 1,
      lastMessage: details
    };
    setTickets(prev => [newTkt, ...prev]);
  };

  const resetDemoData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taiga_rcm_claims_v2');
      localStorage.removeItem('taiga_rcm_appointments_v2');
    }
    setClaims(initialClaims as unknown as Claim[]);
    setAppointments(initialAppointments as unknown as Appointment[]);
  };

  return (
    <AppContext.Provider
      value={{
        claims,
        patients: initialPatients as unknown as Patient[],
        appointments,
        queues: initialQueues as unknown as WorkQueue[],
        priorAuths: initialPriorAuths as unknown as PriorAuth[],
        remits: initialRemits as unknown as Remit[],
        settings: initialSettings as unknown as Settings,
        tickets,
        apiKeys,
        persona: PERSONAS[personaRole],
        setPersonaRole,
        theme,
        toggleTheme,
        sidebarCollapsed,
        toggleSidebar: () => setSidebarCollapsed((open) => !open),
        tourOpen,
        setTourOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        updateClaimStatus,
        collectCopay,
        addAppointment,
        createApiKey,
        revokeApiKey,
        addTicket,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
