export type PersonaRole = 'front_desk' | 'biller' | 'supervisor' | 'admin';

export interface Persona {
  id: PersonaRole;
  title: string;
  name: string;
  avatar: string;
  badge: string;
  description: string;
  primaryPages: string[];
}

export interface ServiceLine {
  id: string;
  date: string;
  cpt: string;
  desc: string;
  modifiers: string;
  diagnoses: string;
  pos: string;
  qty: number;
  billed: number;
  allowed: number;
  insPaid: number;
  patResp: number;
  balance: number;
}

export interface ClaimTask {
  id: string;
  title: string;
  type: string;
  owner: 'Clinic' | 'Alder';
  description: string;
  carc?: string;
  payerClaimId?: string;
  clearinghouse?: string;
  status: 'open' | 'resolved';
}

export interface ClaimActivity {
  date: string;
  event: string;
}

export interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientDob: string;
  serviceDate: string;
  lastUpdated: string;
  payer: string;
  payerId: string;
  payerPlan: string;
  groupNumber: string;
  memberId: string;
  status: string;
  billed: number;
  allowed: number;
  insurancePaid: number;
  insuranceBalance: number;
  patientResp: number;
  patientPaid: number;
  claimBalance: number;
  responsibility: string;
  renderingProvider: string;
  renderingNpi: string;
  billingProvider: string;
  billingNpi: string;
  facility: string;
  placeOfService: string;
  primaryDiagnosis: string;
  diagnosisCode: string;
  diagnosisDescription: string;
  cptCode: string;
  cptDescription: string;
  serviceLines: ServiceLine[];
  tasks: ClaimTask[];
  activity: ClaimActivity[];
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  birthDate: string;
  mrn: string;
  gender: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface Appointment {
  id: string;
  time: string;
  patientId: string;
  firstName: string;
  lastName: string;
  name: string;
  mrn: string;
  dob: string;
  phone: string;
  payer: string;
  plan: string;
  coverageStatus: 'Active' | 'Inactive';
  status: 'Ready' | 'Not ready';
  estCopay: number;
  copayStatus: 'To collect' | 'Collected' | 'Copay not checked';
  provider: string;
  reason: string;
}

export interface WorkQueue {
  id: string;
  name: string;
  description: string;
  totalClaims: number;
  totalBalance: number;
  alderReview: number;
  clinicAction: number;
  snoozedClaims: number;
  snoozedBalance: number;
  sampleClaimId: string;
}

export interface PriorAuth {
  id: string;
  authNumber: string;
  patientName: string;
  patientId: string;
  serviceCode: string;
  serviceName: string;
  payer: string;
  plan: string;
  status: 'Approved' | 'Pending payer' | 'Needs information' | 'Denied';
  submittedDate: string;
  expirationDate: string;
  notes: string;
}

export interface Remit {
  id: string;
  checkNumber: string;
  checkDate: string;
  amount: number;
  payer: string;
  payeeNpi: string;
  claimsCount: number;
  reconciliation: 'Reconciled' | 'Unreconciled';
  postingStatus: 'Posted' | 'Pending';
  receivedDate: string;
  postedDate: string;
}

export interface Provider {
  id: string;
  name: string;
  npi: string;
  type: string;
  specialty: string;
  taxId: string;
  status: string;
}

export interface Facility {
  id: string;
  name: string;
  pos: string;
  npi: string;
  address: string;
  clia: string;
}

export interface Credentialing {
  payer: string;
  status: string;
  effectiveDate: string;
  renewalDate: string;
  providerCount: number;
}

export interface Contract {
  payer: string;
  contractCode: string;
  feeSchedule: string;
  timelyFilingDays: number;
  appealWindowDays: number;
}

export interface FeeSchedule {
  cpt: string;
  description: string;
  rvu: number;
  chargemaster: number;
  aetnaAllowable: number;
  bcbsAllowable: number;
  uhcAllowable: number;
}

export interface Settings {
  practice: {
    name: string;
    taxId: string;
    groupNpi: string;
    ptan: string;
    primaryAddress: string;
    phone: string;
    email: string;
  };
  providers: Provider[];
  facilities: Facility[];
  credentialing: Credentialing[];
  contracts: Contract[];
  feeSchedules: FeeSchedule[];
  bankReconciliation: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    autoMatch: boolean;
    unmatchedDeposits: number;
    unmatchedAmount: number;
  };
  invoices: {
    sendTextInvoices: boolean;
    sendEmailStatements: boolean;
    gracePeriodDays: number;
    lateNoticeCadenceDays: number;
    minInvoiceAmount: number;
  };
}

export interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  assignee: string;
  messagesCount: number;
  lastMessage: string;
}
