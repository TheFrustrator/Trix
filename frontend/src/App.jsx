import React from "react";
import { Icons } from "./assets/assets";
import LandingPage from "./component/LandingPage";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import ChooseSighUp from "./component/ChooseSighUp";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import PharmacyLogin from "./pages/PharmacyLogin";
import PatientSignup from "./pages/PatientSignup";
import DoctorSignUp from "./pages/DoctorSignUp";
import PharmacySignUp from "./pages/PharmacySignUp";
import PatientDashboard from "./paitent/PatientDashboard";
import MedicalHistory from "./paitent/MedicalHistory";
import PrescriptionPatient from "./paitent/PrescriptionPatient";
import AccessRequest from "./paitent/AccessRequest";

import SettingPatient from "./paitent/SettingPatient";
import PharmacyDashboard from "./pharmacy/PharmacyDashboard";
import PrescriptionView from "./pharmacy/PrescriptionView";
import DoctorDashboard from "./doctor/DoctorDashboard";
import DoctorSetting from "./doctor/DoctorSetting";
import PrescriptionIssue from "./doctor/PrescriptionIssue";
import ActivePatient from "./doctor/ActivePatient";
import History from "./doctor/History";
import ActivePatientSummary from "./doctor/ActivePatientSummary";
import ActivePatientHistory from "./doctor/ActivePatientHistory";
import ActivePatientPrescription from "./doctor/ActivePatientPrescription";
import PdfPrescriptionView from "./doctor/PdfPrescriptionView";
import { ViewPrescriptionPatient } from "./paitent/ViewPrescriptionPatient";

const App = () => {
  return (
    <div className="">
      {/* <div className="flex ml-[86%]  bg-blue-100 rounded-full w-36 h-36" ></div>
        <div className="flex ml-[-1.8%] bg-blue-100 rounded-full w-14 h-14" ></div>
        <div className="flex mt-5 ml-[-1.8%] bg-gray-200 rounded-full w-40 h-40" ></div> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choosesignup" element={<ChooseSighUp />} />

        {/* login  */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/pharmacy-login" element={<PharmacyLogin />} />

        {/* Signup */}
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/doctor-signup" element={<DoctorSignUp />} />
        <Route path="/pharmacy-signup" element={<PharmacySignUp />} />

        {/* patient control  */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-medical-history" element={<MedicalHistory />} />
        <Route path="/acess-request" element={<AccessRequest />} />

        {/* pharmacy control  */}
        <Route path="/pharmacy" element={<PharmacyDashboard />} />
        <Route
          path="/pharmacy-prescription-view"
          element={<PrescriptionView />}
        />

        {/* Doctor component */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            
        
        
         {/* <Route path="/patient-prescription/:patientId" element={<ViewPrescriptionPatient />} /> */}

        <Route path="/active-patient" element={<ActivePatient />}>
          <Route index element={<Navigate to="summary" replace />} />
          <Route path="summary" element={<ActivePatientSummary />} />
          <Route path="history" element={<ActivePatientHistory />} />
          <Route path="prescription" element={<ActivePatientPrescription />} />
        </Route>
        <Route path="/prescription-view" element={<PdfPrescriptionView />} />
      </Routes>
    </div>
  );
};

export default App;
