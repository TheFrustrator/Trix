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
- [Security Features](#-security-features)

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
| Landing Page | <img width="1376" height="768" alt="01_landing_page" src="https://github.com/user-attachments/assets/94113590-1d11-4506-a041-e5f6d8025684" />
` |
| Login / Sign Up Role Selection | <img width="1376" height="768" alt="02_Login_Signup_selection_page" src="https://github.com/user-attachments/assets/cfcdb8a5-ffb7-49e3-a91c-a0049553d224" />
 |
| Login Page | <img width="1376" height="768" alt="03_Login_page" src="https://github.com/user-attachments/assets/e001f43e-3816-4b0e-89a5-205be4dab0dd" />
 

### 🧑‍🦱 Patient Flow
| Screen | File |
|---|---|
| Patient Sign Up | <img width="1376" height="768" alt="01_Paitent_signup_page" src="https://github.com/user-attachments/assets/cbbdadb9-e0e8-44d1-b53c-cac8cd0e749b" />
 |
| Patient Dashboard (with Doctor Visit History timeline) | <img width="1376" height="768" alt="02_Paitent Dashboard" src="https://github.com/user-attachments/assets/dffa3c63-036a-4e0e-bcba-78db598884db" />
 |
| Access Requests (Accept/Deny + Active Sessions) | <img width="1376" height="768" alt="03_Request_access_page" src="https://github.com/user-attachments/assets/8a1be9c2-de1e-4aa2-af89-52e422e72100" />
 |
| Medical History — Visit Detail View | <img width="1376" height="768" alt="04_1_View_detalis" src="https://github.com/user-attachments/assets/91682b75-1361-4874-87f7-d3cbf4f1cbfe" />
|

### 🩺 Doctor Flow
| Screen | File |
|---|---|
| Doctor Sign Up (with license upload) | <img width="1376" height="768" alt="01_Doctor_signup_page" src="https://github.com/user-attachments/assets/4fcb4ae4-9359-4ccc-93f7-a4cbc03d9d3b" />
 |
| Doctor Dashboard — Patient ID Search | <img width="1375" height="768" alt="02_Dashboard" src="https://github.com/user-attachments/assets/ab23564f-8847-4e5d-a09b-73d87c127b6a" />
 |
| Waiting for Patient Approval | <img width="1376" height="768" alt="03_acesss_request" src="https://github.com/user-attachments/assets/3a9bae68-3cfb-4c88-90c7-403b610c1761" />
 |
| Access Granted — Patient Summary | <img width="1376" height="768" alt="04_Access_grant Summary" src="https://github.com/user-attachments/assets/68dd282a-f9b3-4876-95e8-245309d92541" />
 |
| Add Diagnosis / History Tab | <img width="1376" height="768" alt="05_Diagnosis screen_history" src="https://github.com/user-attachments/assets/d4d69474-8174-4cb7-a05f-1dd66e09b9ff" />
 |
| Prescription Builder | <img width="1376" height="768" alt="06_prescription_builder" src="https://github.com/user-attachments/assets/0f17ca36-c45f-4744-a765-485544f31999" />
 |
| Digitally Verified Prescription (PDF view) | <img width="1376" height="768" alt="07_1_After_clicking the view pdf" src="https://github.com/user-attachments/assets/ef1fb761-f4d9-4b1b-811a-9092df57495a" />
 |
| Prescription Submitted Confirmation |<img width="1376" height="768" alt="07_Prescription Submitted confirmation" src="https://github.com/user-attachments/assets/dd99a94a-6590-4c83-be2a-c3b0792bc83e" />
 |

### 💊 Pharmacy Flow
| Screen | File |
|---|---|
| Pharmacy Sign Up (with license upload) | <img width="1376" height="768" alt="01_Pharmecy_signup_page" src="https://github.com/user-attachments/assets/ee28a95f-b034-4c64-9ba8-1bec788ec25f" />
 |
| Manage Pharmacy Account | <img width="1376" height="768" alt="02_1_Interface_of_manage_account" src="https://github.com/user-attachments/assets/cddb30a7-2ff7-4cf6-9ab4-6ac2f05ba97b" />
 |
| Patient ID Lookup Screen | <img width="1376" height="768" alt="02_Pharmacy_lookup_screen" src="https://github.com/user-attachments/assets/7902bb07-e00b-4bad-b616-7f004eafafd3" />
 |
| Prescription Result Screen | <img width="1376" height="768" alt="03_Prescription Result screen" src="https://github.com/user-attachments/assets/9af06d99-1b90-453d-b01d-db7102e150cc" />
 |
| Direct View — Full Prescription | <img width="1408" height="768" alt="04_Prescription view after clicking on Direct view" src="https://github.com/user-attachments/assets/69cf976c-8ef6-4e78-bbb3-58fc3959fcce" />
 |

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

