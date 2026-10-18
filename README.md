# Alder

A healthcare revenue cycle demo. Northstar Family Health is the clinic inside the product. Screen flows follow the [Taiga Billing](https://demo.taigabilling.com/) demo.

Built as a **zero-backend demo application** using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, featuring an embedded dataset of **1,546 synthetic medical claims** and **268 patients**.

---

## 🌟 Key Highlights & Architecture

- **Zero Backend Architecture**: All filtering, searching, aggregations, and state mutations (resolving denials, collecting copays, generating API keys, updating appointments) run client-side in TypeScript with browser LocalStorage persistence.
- **Embedded Real-World Dataset**: 1,546 realistic medical claims and 268 patient records with itemized CPT service codes, ICD-10 diagnoses, CARC adjustment reason codes, and 835 check remittances.
- **Interactive Persona Switcher**: Top banner to switch between 4 clinic roles:
  1. **Front Desk Receptionist** (*Sarah Jenkins*) — Intake, appointments, eligibility checks, and point-of-sale copay collections.
  2. **Certified Medical Biller** (*Alex Rivera, CPC*) — Encounter reviews, CPT/ICD coding, clearinghouse rejections, and CARC denial resolution.
  3. **RCM Billing Supervisor** (*Morgan Blake*) — Net collection rates, A/R aging buckets, 835 ERA reconciliation, and work queue throughput.
  4. **Practice Administrator & IT** (*Dr. Taylor Vance*) — Provider credentialing, payer contracts, chargemaster fee schedules, and partner API keys.
- **Global Command Palette (`⌘K`)**: Instant fuzzy search across claims by ID (e.g. `clm-1001`), patient name (e.g. `Amelia Ross`), payer, or quick navigation.
- **Interactive Tour Guide**: Multi-step onboarding walkthrough highlighting core RCM workflows.
- **Dark / Light Theme**: Full theme support with automatic persistence.

---

## 🩺 Feature Tour & Modules

### 1. Practice & Front-of-the-House Operations
* **Overview Dashboard (`/`)**: 6 financial KPI cards (Paid `$287,303`, Outstanding with Payer `$227,005`, Denial Rate `0.6%`, Submitted `$1,006,100`, Aging &gt;30d `$184,146`, Avg Days to Payment `20.0 d`), Book Snapshot claims mix, Payer vs. Patient balance allocation, open billing tasks feed, and recent remits ledger.
* **Front Desk (`/appointments`)**: Daily appointment roster, active coverage badges, copay collection tabs (`All`, `To collect`, `Collected`), and interactive copay payment drawer.
* **Rounds Calendar (`/rounds`)**: Monthly inpatient rounding calendar with encounter tracking and provider assignment (Dr. Priya Nair, Dr. Samuel Ortiz, Dr. Hannah Cole).
* **Eligibility Verification (`/eligibility`)**: Real-time 270/271 EDI benefit inquiry with gold-star favorite payers and instant adjudicated coverage cards (Individual/Family deductibles, Out-of-pocket max, and Copay breakdown).

### 2. Billing & Revenue Cycle Operations
* **Claims Management (`/claims`)**: Dense financial table of 1,546 claims with sorting, pagination, column customizer, and multi-dimensional filters (status, owner, payer, search).
* **Deep Claim Inspector (`/claims/[id]`)**: Comprehensive 7-tab inspector:
  1. *Claim properties*: Patient Identity, Contact, Plan, Subscriber, Provider, Location.
  2. *Dx, Service lines & Remits*: ICD-10 diagnosis codes, CPT line items with billed/allowed/paid/adjustment amounts, and 835 remittance check details.
  3. *Write offs & Patient payments*: Payment ledger and adjustments.
  4. *Other claims*: Complete historical timeline for the patient.
  5. *Documentation*: Attached clinical notes, superbills, and prior auth letters.
  6. *Activity Log*: Chronological event audit trail.
  7. *Tasks*: Actionable workflows (e.g. try `clm-1002` to test resolving a live CARC denial and resubmitting to payer).
* **Work Queues (`/queues`)**: 6 categorized queues to stop revenue leakage (Provider follow-up, Coding validation, Stale claims & timely filing, Clearinghouse rejections, Payer denials, and Customer holds).
* **Prior Authorization (`/prior-auth`)**: PA status tracking, CPT service codes, expiration tracking, and new auth request modal.
* **Remittances & 835 ERAs (`/remits`)**: Check register of 50 Electronic Remittance Advice records, reconciliation status, and one-click EOB export.
* **Patient Balances & Collections (`/collections`)**: Post-insurance patient liability ledger with "Review text" modal to preview and send simulated SMS payment links.

### 3. Analytics, Developers & Settings
* **Reports & BI Analytics (`/reports`)**: Natural language query bar ("Ask about your claims, charges, A/R, and encounters"), A/R aging bucket breakdown, 6-month cashflow trends, and CARC denial distributions.
* **Developer Portal (`/developers`)**: Organization-scoped API key generator, OpenAPI spec reference, and one-click ZIP dataset download (`/data-export`).
* **Settings & Configuration (`/settings`)**: 7-tab practice hub for Providers, Service Facilities, Credentialing, Commercial Contracts, Fee Schedules, Bank Reconciliation, and Automated Invoicing.
* **Support & Tickets (`/tickets`)**: Internal ticketing queue with threaded specialist messages and new request modal.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ (tested on Node v20 & v26)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/One-Ping-Fan-Venture/health-care-RCM.git
cd health-care-RCM

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Unsigned visits go to `/login`.

### Demo account

The public site asks the browser for this account before any page loads. The in-app form uses the same account. The password is not printed on the form.

| Field | Value |
| --- | --- |
| Username | `demo` |
| Password | `N0rthstar#Billing2026!` |

A successful sign-in stores a session in `localStorage` under `alder_session`, so a refresh stays signed in. **Sign out** in the sidebar footer clears that session and returns to `/login`.

### Production Build

```bash
npm run build
npm start
```

### Branches

`develop` is the default branch. New clones and new pull requests start there. Day-to-day work branches from `develop` and opens pull requests back into `develop`.

`main` is the production branch. The host builds production from `main`. Release by opening a pull request from `develop` into `main` and merging it. That push is what deploys.

---

## 📁 Repository Structure

```
health-care-RCM/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Global layout with AppProvider, PersonaBanner, Shell
│   │   ├── page.tsx              # Overview KPI dashboard
│   │   ├── appointments/page.tsx # Front Desk & Copay collections
│   │   ├── rounds/page.tsx       # Inpatient rounding schedule
│   │   ├── eligibility/page.tsx  # 270/271 Real-time benefit verification
│   │   ├── claims/
│   │   │   ├── page.tsx          # Dense Claims management table (1,546 records)
│   │   │   └── [id]/page.tsx     # 7-tab Deep Claim Inspector
│   │   ├── queues/page.tsx       # Work queues & revenue leakage prevention
│   │   ├── prior-auth/page.tsx   # Prior authorization ledger
│   │   ├── remits/page.tsx       # 835 ERA check remittances
│   │   ├── collections/page.tsx  # Patient balances & SMS text invoicing
│   │   ├── reports/page.tsx      # BI analytics & A/R aging
│   │   ├── developers/page.tsx   # API keys & synthetic data ZIP export
│   │   ├── settings/page.tsx     # 7 practice configuration tabs
│   │   └── tickets/page.tsx      # Support ticket queue & live chat
│   ├── components/
│   │   ├── PersonaBanner.tsx     # Role switcher (Front Desk, Biller, Supervisor, Admin)
│   │   ├── Sidebar.tsx           # Collapsible navigation sidebar
│   │   ├── Header.tsx            # Breadcrumbs, search & theme toggle
│   │   ├── CommandPalette.tsx    # ⌘K instant search modal
│   │   ├── TourGuide.tsx         # Interactive onboarding modal
│   │   └── StatusBadge.tsx       # Standardized RCM lifecycle status badges
│   ├── context/
│   │   └── AppContext.tsx        # Client state, mutations, LocalStorage sync
│   ├── data/                     # Embedded synthetic datasets (JSON)
│   │   ├── claims.json           # 1,546 claims with CPT/ICD lines & tasks
│   │   ├── patients.json         # 268 patient demographics
│   │   ├── appointments.json     # Front desk schedule
│   │   ├── remits.json           # 50 check remittances
│   │   ├── queues.json           # 6 operational work queues
│   │   ├── prior_auth.json       # Prior authorization requests
│   │   ├── settings.json         # Providers, facilities, contracts, fee schedules
│   │   ├── reports.json          # Aggregate KPIs & aging buckets
│   │   └── tickets.json          # Support tickets
│   └── types/
│       └── rcm.ts                # TypeScript interfaces
├── package.json
└── README.md
```

---

## 🔒 License & Disclaimer

Synthetic demo data. All patient records, claim numbers, and financial figures are synthetic and do not contain real Protected Health Information (PHI). Designed for healthcare RCM demonstration and workflow evaluation.
