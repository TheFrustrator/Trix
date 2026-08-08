import doctor from "./doctor.png";
import patient from "./pataint.png";
import pharmacy from "./pharmacy.png";
import logoM from "./logoM.png";
import doctorLogo from "./doctorLogo.png";
import patientSU from "./patientSU.png"
import doctorSU from "./doctorSU.png"
import pharmacisSU from "./pharmacisSU.png"
import pdfViewer from "./pdfViewer.webp"

export const Icons = {
  doctor,
  patient,
  pharmacy,
  logoM,
  doctorLogo,
  patientSU,
  doctorSU,
  pharmacisSU,
  pdfViewer
};

export const userNames = {
  patient: "For Patient",
  doctor: "For Doctor",
  pharmacy: "For Pharmacy",
};

export const userDetailes = {
  patient:
    "Own and control your\nsecure digital medical\nrecords anytime,\nanywhere.",
  doctor:
    "Request patient access, view medical history, make diagnoses, and prescribe treatments efficiently.",
  pharmacy:
    "Instantly verify and view valid prescriptions from doctors for seamless fulfillment.",
};

export const userRoles = {
  patientDescription:
    "Own and control your secure digital medical records anytime, anywhere",

  doctorDescription:
    "Request patient access, view medical history, make diagonosis, and prescrive treatement efficiently",

  pharmacyDescription:
    "instatnly verify and view valid pescription from doctor for fullfillment",
};

export const navigationLinks = {
  patientLogin: `/patient-login`,
  patientSignUp: "/patient-signup",

  doctortLogin: "/doctor-login",
  doctortSignup: "/doctor-signup",

  pharmacyLogin: "/pharmacy-login",
  pharmacySignup: "/pharmacy-signup",

}

export const loginRoles = [
  {
    key:"patient",
    title: userNames.patient,
    icon: Icons.patient,
    route:navigationLinks.patientLogin
  },
  {
    key:"doctor",
    title: userNames.doctor,
    icon: Icons.doctor,
    route:navigationLinks.doctortLogin
  },
  {
    key:"pharmacy",
    title: userNames.pharmacy,
    icon: Icons.pharmacy,
    route:navigationLinks.pharmacyLogin
  }
]
export const signupRole = [
  {
    key:"patient",
    title: userNames.patient,
    icon: Icons.patient,
    route:navigationLinks.patientSignUp
  },
  {
    key:"doctor",
    title: userNames.doctor,
    icon: Icons.doctor,
    route:navigationLinks.doctortSignup
  },
  {
    key:"pharmacy",
    title: userNames.pharmacy,
    icon: Icons.pharmacy,
    route:navigationLinks.pharmacySignup
  }
]
