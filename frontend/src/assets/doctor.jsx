import { IoSettingsOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { GiStethoscope } from "react-icons/gi";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";

import FDoctorIcon from "./FDoctorIcon.png";

export const DoctorIcon = {
  FDoctorIcon,
};

export const DoctorNavlinkItems = [
  {
    key: "1",
    title: "Search Patients",
    icon: <IoIosSearch />,
    route: "/doctor-dashboard",
  },
  {
    key: "2",
    title: "Active Patients",
    icon: <GiStethoscope />,
    route: "/doctor/active-patient/:patientCustomId",
  },

];

export const doctorData = {
  name: "Dr. Sarah Jenkins",
  clinicName: "Apex Medical Center",
  isVerified: true,
};

export const patientMockData = [
  {
    id: "1",
    patientName: "John Doe",
    patientId: "P4041XYZ",
    lastVisitDate: "10 Oct 2026",
    prescription: {
      mainDisease: "Hypertension",
    },
  },
  {
    id: "2",
    patientName: "Jane Smith",
    patientId: "P5082264067",
    lastVisitDate: "18 Aug 2026",
    prescription: {
      mainDisease: "Type 2 Diabetes",
    },
  },
  {
    id: "3",
    patientName: "Alex Mercer",
    patientId: "P9012ABC",
    lastVisitDate: "12 May 2026",
    prescription: {
      mainDisease: "Acute Bronchitis",
    },
  },
  {
    id: "4",
    patientName: "Sarah Connor",
    patientId: "P3021KLM",
    lastVisitDate: "24 Nov 2026",
    prescription: {
      mainDisease: "Rheumatoid Arthritis",
    },
  },
  {
    id: "5",
    patientName: "Michael Brown",
    patientId: "P7089RST",
    lastVisitDate: "05 Dec 2026",
    prescription: {
      mainDisease: "Gastroesophageal Reflux (GERD)",
    },
  },
];

export const activeLink = [
  { key: 1, title: "Summary", path: "/active-patients-summary" },
  {
    key: 2,
    title: "History",
    path: "/active-patients-history",
  },
  {
    key: 3,
    title: "Prescription",
    path: "/active-patients-prescription",
  },
];

export const prescriptionData = {
  doctor: {
    name: "Dr. Eleanor Vance, MBBS, MD",
    clinic: "Oakwood Clinic",
    regNo: "12345",
    address: "123 Oakwood Ave, Cityville",
    phone: "(555) 0123",
  },
  patient: {
    name: "Sarah Johnson",
    id: "P-4041-XYZ",
    ageGender: "34 / Female",
    dateIssued: "12 May 2026",
    validUntil: "19 May 2026",
  },
  diagnosis: "Bacterial throat infection",
  medicines: [
    {
      name: "Amoxicillin 500mg",
      dosage: "1 tablet",
      frequency: "Twice a day",
      duration: "7 days",
      timing: "After food",
    },
    {
      name: "Paracetamol 650mg",
      dosage: "1 tablet",
      frequency: "As needed (max 3/day)",
      duration: "5 days",
      timing: "After food",
    },
  ],
  notes:
    "Complete the full course even if symptoms improve.\nFollow up if fever persists beyond 3 days.",
};


export const prescriptionsData = [
  {
    id: 1,
    doctorName: "Dr. Alexander Wright",
    specialty: "Cardiology",
    facility: "Metropolitan Heart Institute",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    date: "Feb 18, 2026",
    status: "ACTIVE",
    diagnosis: "Hypertension Stage 1",
    medications: ["Lisinopril (10mg)", "Amlodipine Besylate (5mg)"],
    rxNumber: "Rx #90142-2026",
    timeFrame: "6months",
  },
  {
    id: 2,
    doctorName: "Dr. Elena Rostova",
    specialty: "Dermatology",
    facility: "ClearSkin Dermatology Care",
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78905?w=150&auto=format&fit=crop&q=80",
    date: "Jan 10, 2026",
    status: "ACTIVE",
    diagnosis: "Acute Contact Dermatitis",
    medications: ["Hydrocortisone Valerate Cream (0.2%)"],
    rxNumber: "Rx #81299-2026",
    timeFrame: "6months",
  },
  {
    id: 3,
    doctorName: "Dr. Marcus Vance",
    specialty: "Neurology",
    facility: "Apex Neuroscience Clinic",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    date: "Aug 12, 2025",
    status: "PAST",
    diagnosis: "Migraine with Aura",
    medications: ["Sumatriptan (50mg)", "Propranolol (40mg)"],
    rxNumber: "Rx #71044-2025",
    timeFrame: "1year",
  },
  {
    id: 4,
    doctorName: "Dr. Sarah Chen",
    specialty: "Pulmonology",
    facility: "City General Pulmonary Clinic",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    date: "Jul 24, 2026",
    status: "ACTIVE",
    diagnosis: "Moderate Persistent Asthma",
    medications: ["Albuterol HFA (90mcg)", "Fluticasone Propionate (110mcg)"],
    rxNumber: "Rx #94321-2026",
    timeFrame: "30days",
  },
  {
    id: 5,
    doctorName: "Dr. James O'Connor",
    specialty: "Gastroenterology",
    facility: "St. Jude Medical Center",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
    date: "May 15, 2026",
    status: "ACTIVE",
    diagnosis: "Gastroesophageal Reflux (GERD)",
    medications: ["Omeprazole (20mg)", "Famotidine (20mg)"],
    rxNumber: "Rx #88123-2026",
    timeFrame: "6months",
  },
  {
    id: 6,
    doctorName: "Dr. Amara Patel",
    specialty: "Rheumatology",
    facility: "Valley Arthritis & Joint Center",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80",
    date: "Oct 05, 2025",
    status: "PAST",
    diagnosis: "Rheumatoid Arthritis",
    medications: ["Methotrexate (15mg)", "Folic Acid (1mg)"],
    rxNumber: "Rx #66992-2025",
    timeFrame: "1year",
  },
];