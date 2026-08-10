import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./component/LandingPage";
import ChooseSighUp from "./component/ChooseSighUp";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import PharmacyLogin from "./pages/PharmacyLogin";
import PatientSignup from "./pages/PatientSignup";
import DoctorSignUp from "./pages/DoctorSignUp";
import PharmacySignUp from "./pages/PharmacySignUp";
import PatientDashboard from "./paitent/PatientDashboard";
import MedicalHistory from "./paitent/MedicalHistory";
import AccessRequest from "./paitent/AccessRequest";
import PharmacyDashboard from "./pharmacy/PharmacyDashboard";
import PrescriptionView from "./pharmacy/PrescriptionView";
import DoctorDashboard from "./doctor/DoctorDashboard";
import ActivePatient from "./doctor/ActivePatient";
import ActivePatientSummary from "./doctor/ActivePatientSummary";
import ActivePatientHistory from "./doctor/ActivePatientHistory";
import ActivePatientPrescription from "./doctor/ActivePatientPrescription";
import PdfPrescriptionView from "./doctor/PdfPrescriptionView";
import EmailVerify from "./pages/EmailVerify";
import PatientEmailVerify from "./pages/PatientEmailVerify";
import ForgetPassword from "./pages/ForgetPassword";
import { ToastContainer } from "react-toastify";
import {
  DoctorProtectedRoute,
  ProtectedRoute,
} from "./component/ProtectedRoute";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choosesignup" element={<ChooseSighUp />} />

        {/* Login */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/pharmacy-login" element={<PharmacyLogin />} />

        {/* Signup */}
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/doctor-signup" element={<DoctorSignUp />} />
        <Route path="/pharmacy-signup" element={<PharmacySignUp />} />

        {/* Patient Protected Controls */}
        <Route element={<ProtectedRoute />}>
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route
            path="/patient-medical-history"
            element={<MedicalHistory />}
          />
          <Route path="/acess-request" element={<AccessRequest />} />
        </Route>

        {/* Pharmacy Controls */}
        <Route path="/pharmacy" element={<PharmacyDashboard />} />
        <Route
          path="/pharmacy-prescription-view"
          element={<PrescriptionView />}
        />

        {/* Doctor Protected Controls */}
        <Route element={<DoctorProtectedRoute />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route
            path="/doctor/active-patient/:patientCustomId"
            element={<ActivePatient />}
          >
            <Route index element={<Navigate to="summary" replace />} />
            <Route path="summary" element={<ActivePatientSummary />} />
            <Route path="history" element={<ActivePatientHistory />} />
            <Route
              path="prescription"
              element={<ActivePatientPrescription />}
            />
          </Route>
        </Route>

        {/* PDF Prescription Routes */}
        <Route path="/prescription-view" element={<PdfPrescriptionView />} />
        <Route
          path="/prescription-view/:prescriptionId"
          element={<PdfPrescriptionView />}
        />

        {/* Verification & Auth */}
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/patient-email-verify" element={<PatientEmailVerify />} />
        <Route path="/reset-password" element={<ForgetPassword />} />
      </Routes>
    </div>
  );
};

export default App;