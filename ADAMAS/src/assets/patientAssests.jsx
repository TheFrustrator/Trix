import { MdDashboard, MdLockOutline } from "react-icons/md";
import { FaClockRotateLeft } from "react-icons/fa6"; // Correct package imports


import userIcon from "./userIcon.png";
import pharmaIcon from "./pharmaIcon.png";
import doctorIcon from "./doctorIcon.png";
import heartIcon from "./heartIcon.png";

export const PatientIcons = {
  userIcon,
  doctorIcon,
  pharmaIcon,
  heartIcon,
};

export const PatientNavlinkItems = [
  {
    key: "dashboardP",
    title: "Dashboard",
    icon: <MdDashboard />,
    route: "/patient-dashboard",
  },
  {
    key: "medicalHistory1",
    title: "Medical History",
    icon: <FaClockRotateLeft />,
    route: "/patient-medical-history",
  },
 
  {
    key: "accessreq1",
    title: "Access Request",
    icon: <MdLockOutline />,
    route: "/acess-request",
  },
 
];

export const accessRequestData = [
  {
    key: Math.random,
    name: "Dr. Eleanor Vance",
    clinName: "Oakwood Clinick",
    requestTime: "10 Day",
  },
  {
    key: 2,
    name: "Dr. Eleanor Vance",
    clinName: "Oakwood Clinick",
    requestTime: "10 Hour",
  },
  {
    key: 3,
    name: "Dr. Eleanor Vance",
    clinName: "Oakwood Clinick",
    requestTime: "10 Months",
  },
  {
    key: 5,
    name: "Dr. Eleanor Vance",
    clinName: "Oakwood Clinick",
    requestTime: "10 Months",
  },
];

export const activeSessionData = [
  {
    key: "key1",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    timeRemaining: "00:58:24",
  },
  {
    key: "key2",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    timeRemaining: "00:58:24",
  },
];
export const provokeSessionData = [
  {
    key: "key2",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    timeRemaining: "00:58:24",
  },
];

export const medicalHistoryData = [
  {
    key: "ytir",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    digSummary: "Hypertension(recheck)",
  },
  {
    key: "ytir",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    digSummary: "Acuite Boerjwq(follow-up)",
  },
  {
    key: "ytir",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    digSummary: "Hypertension(recheck)",
  },
  {
    key: "ytir",
    sessionDoctor: "Dr. Elanovir Vance",
    clinicAdd: "St. Marry Clinc",
    digSummary: "Hypertension(recheck)",
  },
];

export const singlePatientMockData = {
  id: "6",
  patientName: "Sarah Johnson",
  patientId: "P4041XYZ",
  lastVisitDate: "20 Oct 2026",
  contact: "+1(990)1235680",
  dateOfBirth: "06/03/1926",
  prescription: {
    mainDisease: "Hypertension (Lisinopril)",
  },
  allergies: [
    { id: "a1", name: "Penicillin", severity: "Severe Rash" },
    { id: "a2", name: "Peanuts", severity: "Mild Reaction" },
    { id: "a3", name: "Peacills", severity: "Lypertopril" },
  ],
  condensedHistory: [
    { label: "Recent Visit", detail: "20 Oct 2026 (Oakwood Clinic)" },
    { label: "Diagnosis", detail: "Hypertension (Lisinopril)" },
    { label: "Recent Test", detail: "18 Oct 2026 (Clear)" },
  ],
};

export const prescriptionsDetails = [
  {
    id: 1,
    doctorName: "Dr. Marcus Sterling",
    date: "12 May 2026",
    fileName: "Rx_Smith_Metformin.pdf"
  },
  {
    id: 2,
    doctorName: "Dr. Aris Thorne",
    date: "02 Jun 2026",
    fileName: "Lab_Report_Johnson_CBC.pdf"
  },
  {
    id: 3,
    doctorName: "Dr. Sophia Martinez",
    date: "18 Jun 2026",
    fileName: "Rx_Davis_Atorvastatin.pdf"
  },
  {
    id: 4,
    doctorName: "Dr. Alan Grant",
    date: "04 Jul 2026",
    fileName: "Referral_Wilson_Cardiology.pdf"
  },
  {
    id: 5,
    doctorName: "Dr. Priya Patel",
    date: "21 Jul 2026",
    fileName: "Rx_Lee_Lisinopril.pdf"
  },
  {
    id: 6,
    doctorName: "Dr. Robert Chen",
    date: "01 Aug 2026",
    fileName: "Scan_Summary_Taylor_MRI.pdf"
  }
];


export const visitHistoryData = [
  {
    id: 1,
    date: '14 Feb',
    type: 'avatar',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
    doctorName: 'Dr. Marcus Sterling',
  },
  {
    id: 2,
    date: '22 Mar',
    type: 'avatar',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-7885a3977336?w=100&auto=format&fit=crop&q=80',
    doctorName: 'Dr. Sophia Martinez',
  },
  {
    id: 3,
    date: '18 May',
    type: 'avatar',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80',
    doctorName: 'Dr. Aris Thorne',
  },
  {
    id: 4,
    date: '30 Jun',
    type: 'initials',
    label: 'SMC',
    doctorName: 'Specialist Medical Center',
  },
  {
    id: 5,
    date: '12 Oct',
    type: 'avatar',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
    doctorName: 'Dr. Marcus Sterling',
  },
];