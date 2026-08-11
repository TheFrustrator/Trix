# MediLink 🩺

**One ID. Your Complete Medical Record.**

MediLink is a consent-driven digital health record platform that connects **Patients**, **Doctors**, and **Pharmacies** around a single unique Patient ID. Patients own and control their medical data at all times — doctors get temporary, permission-based access only during an active consultation, and pharmacies get a strictly read-only view limited to the current valid prescription.

Built for the **AI in Healthcare** track hackathon submission.

---

## 📖 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Core Principle](#-core-principle)
- [Features by Role](#-features-by-role)
- [Screenshots / Interface Walkthrough](#-screenshots--interface-walkthrough)
- [Consent & Access Flow](#-consent--access-flow)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [AI Integration](#-ai-integration)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Scope](#-future-scope)
- [Team / Credits](#-team--credits)
- [License](#-license)

---

## 🏥 Problem Statement

Patient medical history is fragmented across hospitals, clinics, and pharmacies. Patients repeat their history verbally at every visit, carry physical prescriptions, and have no reliable way to track their diagnosis timeline. Pharmacies have no trustworthy way to verify whether a prescription is genuine or current. There is no unified, patient-controlled, consent-based system that lets a patient own their data while granting temporary, revocable access to healthcare providers.

## 💡 Solution Overview

MediLink solves this with a **consent-first, minimal-access, time-bound permission model**:

- Every patient gets a **unique Patient ID** on signup.
- Doctors must **request access** using that ID — the patient explicitly **accepts or denies** the request.
- Access is **time-bound** and can be **revoked instantly** by the patient at any time.
- Pharmacies only ever see the **latest valid prescription** — nothing else.
- Every access event is **logged** for full transparency.

## 🔑 Core Principle

> **Consent-first. Minimal-access. Time-bound permissions.**

---

## 👥 Features by Role

### Patient
- Unique auto-generated Patient ID on signup
- Dashboard with condition summary, last visit, upcoming refills
- Doctor Visit History timeline (2-year scrubbable view with a draggable slider)
- Medical History with detailed per-visit records
- Prescription library with downloadable PDFs
- Access Requests inbox — Accept / Deny incoming doctor requests
- Active Sessions panel with live countdown and one-click **Revoke Access**
- Settings: profile, password, 2FA, notification preferences, data export/delete

### Doctor
- Verified signup with medical license/certificate upload
- Search/request access via Patient ID
- Real-time "waiting for approval" state
- Full patient summary, condition history, and known allergies once access is granted
- Add new diagnosis entries with report/scan attachments
- Prescription Builder — medicine autocomplete, dosage stepper, frequency chips, timing tags, auto-calculated quantity
- Submit final, digitally signed prescription (auto-generates PDF)
- Access automatically expires or is revoked instantly by the patient

### Pharmacy
- Verified signup with pharmacy license upload
- Look up a patient by ID to view only their **latest valid prescription**
- View prescription directly in-browser or download as PDF
- Mark a prescription as dispensed
- View last 5 recently looked-up prescriptions
- Manage Pharmacy Account (shop details, security, activity log)

---

## 🖼️ Screenshots / Interface Walkthrough

> Screenshot files referenced below — place them in a `/screenshots` folder in this repo, in the same order shown here, so this README renders correctly.

### 🌐 Landing & Authentication
| Screen | File |
|---|---|
| Landing Page | `01_landing_page.png` |
| Login / Sign Up Role Selection | `02_Login_Signup_selection_page.png` |
| Login Page | `03_Login_page.png` |

### 🧑‍🦱 Patient Flow
| Screen | File |
|---|---|
| Patient Sign Up | `01_Paitent_signup_page.png` |
| Patient Dashboard (with Doctor Visit History timeline) | `02_Paitent_Dashboard.png` |
| Access Requests (Accept/Deny + Active Sessions) | `03_Request_access_page.png` |
| Medical History — Visit Detail View | `04_1_View_detalis.png` |

### 🩺 Doctor Flow
| Screen | File |
|---|---|
| Doctor Sign Up (with license upload) | `01_Doctor_signup_page.png` |
| Doctor Dashboard — Patient ID Search | `02_Dashboard.png` |
| Waiting for Patient Approval | `03_acesss_request.png` |
| Access Granted — Patient Summary | `04_Access_grant_Summary.png` |
| Add Diagnosis / History Tab | `05_Diagnosis_screen_history.png` |
| Prescription Builder | `06_prescription_builder.png` |
| Digitally Verified Prescription (PDF view) | `07_1_After_clicking_the_view_pdf.png` |
| Prescription Submitted Confirmation | `07_Prescription_Submitted_confirmation.png` |

### 💊 Pharmacy Flow
| Screen | File |
|---|---|
| Pharmacy Sign Up (with license upload) | `01_Pharmecy_signup_page.png` |
| Manage Pharmacy Account | `02_1_Interface_of_manage_account.png` |
| Patient ID Lookup Screen | `02_Pharmacy_lookup_screen.png` |
| Prescription Result Screen | `03_Prescription_Result_screen.png` |
| Direct View — Full Prescription | `04_Prescription_view_after_clicking_on_Direct_view.png` |

---

## 🔄 Consent & Access Flow

1. Patient registers → receives a unique Patient ID (and QR code for fast in-clinic sharing).
2. Doctor enters/scans the Patient ID → sends an access request.
3. Patient receives a real-time notification → **Accept** or **Deny**.
4. On **Accept**, a time-bound access token is issued (visible as a live countdown, e.g. `01:58:32`).
5. Doctor can now view history and write a new diagnosis/prescription.
6. On **Deny**, **Revoke**, or **token expiry** — access is invalidated **server-side immediately**, not just hidden in the UI.
7. Every action during the session is logged (who, what, when) for the patient's audit trail.
8. Pharmacy access is separate and always **read-only**, scoped strictly to the active prescription.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (or Next.js) + Tailwind CSS |
| Backend | Node.js + Express.js *(or FastAPI/Python as an alternative)* |
| Database | PostgreSQL |
| File / PDF Storage | Firebase Storage / AWS S3 |
| PDF Generation | `pdf-lib` / `jsPDF` |
| Authentication | JWT + bcrypt (role-based: patient / doctor / pharmacy) |
| Real-time Notifications | Socket.io / Firebase Cloud Messaging |
| AI Layer | OpenAI / Claude / Gemini API |
| Hosting | Vercel (frontend) + Render/Railway (backend) + Supabase/Neon (DB) |

> **Hackathon shortcut:** Supabase (Postgres + Auth + Storage + Row Level Security) or Firebase can replace a large chunk of custom backend work and is a great fit for the consent-based access model.

---

## 🏗️ System Architecture

```
                     ┌────────────────────┐
                     │   Frontend (Web)    │
                     │ Patient / Doctor /  │
                     │ Pharmacy Portals    │
                     └─────────┬───────────┘
                               │ HTTPS (REST/GraphQL)
                     ┌─────────▼───────────┐
                     │   API Gateway /      │
                     │   Auth Middleware    │
                     │ (JWT + Role Checks)  │
                     └─────────┬───────────┘
        ┌──────────────────────┼───────────────────────┐
        │                      │                        │
┌───────▼───────┐   ┌──────────▼─────────┐   ┌──────────▼─────────┐
│ Patient Service│   │  Consent/Access     │   │ Prescription &      │
│ (records, docs)│   │  Service (tokens,   │   │ PDF Generator       │
│                │   │  audit log)         │   │ Service              │
└───────┬───────┘   └──────────┬─────────┘   └──────────┬─────────┘
        │                      │                         │
        └──────────────┬───────┴─────────────────────────┘
                        │
               ┌────────▼────────┐
               │   Database        │
               │ (Encrypted at rest│
               │  + Cloud Storage  │
               │  for PDFs/images) │
               └───────────────────┘
```

---

## 📁 Project Structure

```
medilink/
├── client/                        # Frontend (React/Next.js)
│   ├── public/
│   │   └── screenshots/           # UI reference images (see above table)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Sidebar, Buttons, Cards
│   │   │   ├── patient/           # Dashboard, HistoryTimeline, AccessRequests
│   │   │   ├── doctor/            # PatientSearch, PrescriptionBuilder
│   │   │   └── pharmacy/          # PatientLookup, PrescriptionResult
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup/
│   │   │   ├── patient/
│   │   │   ├── doctor/
│   │   │   └── pharmacy/
│   │   ├── hooks/
│   │   ├── context/                # Auth context, Access-token context
│   │   ├── services/                # API call wrappers (axios)
│   │   └── App.jsx
│   └── package.json
│
├── server/                          # Backend (Node/Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── patientController.js
│   │   │   ├── doctorController.js
│   │   │   ├── pharmacyController.js
│   │   │   └── accessController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── AccessRequest.js
│   │   │   ├── MedicalHistory.js
│   │   │   ├── Prescription.js
│   │   │   └── AuditLog.js
│   │   ├── routes/
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── rbac.js              # Role-based access control
│   │   │   └── rateLimiter.js
│   │   ├── services/
│   │   │   ├── pdfGenerator.js
│   │   │   ├── notificationService.js
│   │   │   └── aiService.js         # LLM API integration
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/ (or migrations/)     # DB schema & migrations
│   └── package.json
│
├── screenshots/                     # All UI mockups (referenced in this README)
├── docs/
│   └── PROJECT_SYNOPSIS.md          # Full hackathon synopsis document
├── .env.example
├── README.md
└── LICENSE
```

---

## 🗄️ Database Schema (Simplified)

**users** — `id`, `name`, `role` (patient/doctor/pharmacy), `email`, `password_hash`, `unique_patient_id` (nullable)

**access_requests** — `id`, `doctor_id`, `patient_id`, `status` (pending/accepted/denied/revoked), `requested_at`, `expires_at`

**medical_history** — `id`, `patient_id`, `doctor_id`, `visit_date`, `symptoms`, `diagnosis_notes`, `attachments[]`

**prescriptions** — `id`, `patient_id`, `doctor_id`, `visit_id`, `medicines` (JSON), `pdf_url`, `created_at`, `valid_until`

**audit_logs** — `id`, `actor_id`, `action`, `target_patient_id`, `timestamp`

---

## 🔐 Security Features

Health data demands strong security by default — this is a core focus of MediLink, not an afterthought:

1. **Role-Based Access Control (RBAC)** enforced at the API layer, not just hidden in the UI.
2. **Consent-based, time-bound access tokens** — a doctor's write access is a short-lived JWT tied to an `access_requests` record, validated on every request.
3. **Encryption** — HTTPS/TLS in transit; encrypted sensitive fields at rest.
4. **Least privilege for pharmacy** — a dedicated, narrow API endpoint returns only the active prescription object, never the full patient record.
5. **Full audit logging** — every view/edit is logged with actor ID, timestamp, and action, visible to the patient for transparency.
6. **Password security** via bcrypt/argon2 hashing.
7. **Input validation & sanitization** to prevent SQL injection/XSS.
8. **Rate limiting** on login and Patient-ID lookup endpoints to prevent brute-force/ID enumeration.
9. **Instant session invalidation** — tokens are blacklisted server-side the moment access is revoked.
10. **Digitally signed, tamper-verified prescriptions** — QR-coded and hash-verifiable, so pharmacies can confirm authenticity.

---

## 🤖 AI Integration

- **AI Symptom-to-Diagnosis Assistant** — suggests possible differential diagnoses from entered symptoms; doctor retains final authority.
- **AI Prescription Safety Check** — flags potential drug interactions or dosage anomalies before submission.
- **AI Patient Summary Generator** — condenses long medical history into a short dashboard-ready gist.
- **AI Patient Chatbot** *(optional)* — answers general health questions with a clear "not a diagnosis" disclaimer.

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/medilink.git
cd medilink

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Set up environment variables
cp .env.example .env
# fill in DB connection string, JWT secret, storage keys, AI API key

# 4. Run database migrations
npx prisma migrate dev   # or your chosen ORM's equivalent

# 5. Start the backend
cd server && npm run dev

# 6. Start the frontend
cd client && npm run dev
```

The app should now be running at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

---

## 🔑 Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/medilink
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=2h
STORAGE_BUCKET_URL=your_firebase_or_s3_url
STORAGE_ACCESS_KEY=your_key
AI_API_KEY=your_openai_or_claude_or_gemini_key
```

---

## 🔭 Future Scope

- QR-code based instant ID sharing at hospital reception desks
- Wearable device integration for live vitals on the patient dashboard
- Insurance claim auto-generation from verified prescriptions
- Multi-language support for prescriptions and patient communication
- Blockchain-based immutable audit trail

---

## 👨‍💻 Team / Credits

| Name | Role |
|---|---|
| *Your Name* | Full-stack Development, Security |
| *Teammate* | UI/UX Design |
| *Teammate* | AI Integration |

Built for the **AI in Healthcare** hackathon track.

---

## 📄 License

This project is submitted for hackathon evaluation purposes. License to be decided by the team (MIT recommended for open-sourcing after the event).


After 12 days of development the project is ready for testing. 
Approximate contribution split: Sudip Bhunia (~80%), AI-assisted (~15%), others (~5%).
Testing, deployment, and security standards by Souvik Das.
Please report bugs by opening issues; if something appears intentional, 
mark it as a feature with a note explaining why.

Developed by: Sudip Bhunia. 
Testing / Deploying / Security standards: Souvik Das.
