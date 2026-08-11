import React, { useContext, useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Icons } from "../assets/assets";

Font.register({
  family: "Times-Italic",
  src: "https://fonts.gstatic.com/s/timesnewroman/v1/TimesNewRomanPS-ItalicMT.ttf",
});

const styles = StyleSheet.create({
  page: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },

  // HEADER
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },

  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIconBox: {
    backgroundColor: "#3B82F6",
    borderRadius: 6,
    padding: 4,
    marginRight: 8,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  logoImage: {
    width: 14,
    height: 14,
    objectFit: "contain",
  },

  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    letterSpacing: -0.5,
  },

  badge: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    marginVertical: 8,
    width: "100%",
  },

  // DOCTOR & PATIENT INFO
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 4,
  },

  infoBlock: {
    width: "48%",
  },

  doctorName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 3,
  },

  infoText: {
    fontSize: 8.5,
    color: "#475569",
    marginBottom: 2.5,
  },

  boldText: {
    fontWeight: "bold",
    color: "#0F172A",
  },

  // DIAGNOSIS
  diagnosisBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },

  diagnosisText: {
    fontSize: 9,
    color: "#1E293B",
  },

  // TABLE
  tableContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    marginBottom: 16,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  tableHeaderCell: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0F172A",
  },

  tableRow: {
    flexDirection: "row",
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    alignItems: "center",
  },

  tableRowEven: {
    backgroundColor: "#FFFFFF",
  },

  tableRowOdd: {
    backgroundColor: "#FAFAFA",
  },

  colMedicine: {
    width: "30%",
  },

  colDosage: {
    width: "15%",
  },

  colFrequency: {
    width: "22%",
  },

  colDuration: {
    width: "15%",
  },

  colTiming: {
    width: "18%",
  },

  medName: {
    fontWeight: "bold",
    fontSize: 8.5,
    color: "#0F172A",
  },

  cellText: {
    fontSize: 8,
    color: "#334155",
  },

  // NOTES
  notesSection: {
    marginBottom: 16,
  },

  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 3,
  },

  notesText: {
    fontSize: 8.5,
    fontStyle: "italic",
    color: "#1E293B",
    lineHeight: 1.3,
  },

  // FOOTER
  footerSection: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 15,
  },

  qrContainer: {
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  qrImage: {
    width: "100%",
    height: "100%",
  },

  signatureContainer: {
    alignItems: "center",
    width: 150,
  },

  signatureWrapper: {
    position: "relative",
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  signatureText: {
    fontFamily: "Times-Italic",
    fontSize: 22,
    color: "#1E293B",
  },

  digitalStampBadge: {
    position: "absolute",
    top: -4,
    right: 2,
    backgroundColor: "#E0F2FE",
    borderColor: "#7DD3FC",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  stampText: {
    fontSize: 6,
    fontWeight: "bold",
    color: "#0369A1",
  },

  signatureLine: {
    width: 140,
    borderBottomWidth: 1,
    borderBottomColor: "#94A3B8",
    marginVertical: 4,
  },

  doctorSignatureTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0F172A",
  },

  // SECURITY BAR
  bottomSecurityBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F1F5F9",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 6,
    textAlign: "center",
    fontSize: 7.5,
    color: "#475569",
  },
});

const PrescriptionPDFDocument = ({ patient, prescriptions, notes, date }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const doctor = {
    name: "Dr. Eleanor Vance, MBBS, MD",
    clinic: "Oakwood Clinic",
    regNo: "12345",
    address: "123 Oakwood Ave, Cityville",
    phone: "(555) 0123",
  };

  const patientName = patient?.patientName || "N/A";
  const patientId = patient?.patientId || "N/A";
  const ageGender = patient?.ageGender || "N/A";
  const issueDate = date || "N/A";
  const validUntil = patient?.validUntil || "N/A";
  const diagnosis = notes || "No diagnosis provided";
  const medicineList =
    prescriptions && prescriptions.length > 0 ? prescriptions : [];

  useEffect(() => {
    const qrData = JSON.stringify({
      patientId,
      patientName,
      doctorRegNo: doctor.regNo,
      issued: issueDate,
    });

    QRCode.toDataURL(qrData, {
      margin: 1,
      width: 200,
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error("QR Code Generation Error:", err);
      });
  }, [patientId, patientName, issueDate]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}

        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoIconBox}>
              {Icons?.logo ? (
                <Image src={Icons.logo} style={styles.logoImage} />
              ) : null}
            </View>
            <Text style={styles.logoText}>MediLink</Text>
          </View>
          <Text style={styles.badge}>Digitally Verified Prescription</Text>
        </View>

        <View style={styles.divider} />

        {/* DOCTOR & PATIENT */}

        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.infoText}>{doctor.clinic}</Text>
            <Text style={styles.infoText}>Reg No. {doctor.regNo}</Text>
            <Text style={styles.infoText}>{doctor.address}</Text>
            <Text style={styles.infoText}>{doctor.phone}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoText}>
              Patient: <Text style={styles.boldText}>{patientName}</Text>
            </Text>
            <Text style={styles.infoText}>
              Patient ID: <Text style={styles.boldText}>{patientId}</Text>
            </Text>
            <Text style={styles.infoText}>
              Age/Gender: <Text style={styles.boldText}>{ageGender}</Text>
            </Text>
            <Text style={styles.infoText}>
              Date Issued: <Text style={styles.boldText}>{issueDate}</Text>
            </Text>
            <Text style={styles.infoText}>
              Valid Until: <Text style={styles.boldText}>{validUntil}</Text>
            </Text>
          </View>
        </View>

        {/* DIAGNOSIS */}

        <View style={styles.diagnosisBox}>
          <Text style={styles.diagnosisText}>
            <Text style={styles.boldText}>Diagnosis: </Text>

            {diagnosis}
          </Text>
        </View>

        {/* MEDICINE TABLE */}

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colMedicine, styles.tableHeaderCell]}>
              Medicine
            </Text>

            <Text style={[styles.colDosage, styles.tableHeaderCell]}>
              Dosage
            </Text>

            <Text style={[styles.colFrequency, styles.tableHeaderCell]}>
              Frequency
            </Text>

            <Text style={[styles.colDuration, styles.tableHeaderCell]}>
              Duration
            </Text>

            <Text style={[styles.colTiming, styles.tableHeaderCell]}>
              Timing
            </Text>
          </View>

          {medicineList.map((item, idx) => (
            <View
              key={item._id || item.id || idx}
              style={[
                styles.tableRow,
                idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              <Text style={[styles.colMedicine, styles.medName]}>
                {item.medicineName || item.name || "N/A"}
              </Text>

              <Text style={[styles.colDosage, styles.cellText]}>
                {item.dosages
                  ? `${item.dosages} tablet`
                  : item.dosage || "1 tablet"}
              </Text>

              <Text style={[styles.colFrequency, styles.cellText]}>
                {item.frequency || "N/A"}
              </Text>

              <Text style={[styles.colDuration, styles.cellText]}>
                {item.duration ? `${item.duration} days` : "N/A"}
              </Text>

              <Text style={[styles.colTiming, styles.cellText]}>
                {item.timing || "N/A"}
              </Text>
            </View>
          ))}
        </View>

        {/* NOTES */}

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Doctor's Notes</Text>

          <Text style={styles.notesText}>
            {notes || "Complete the prescribed medication as directed."}
          </Text>
        </View>

        {/* FOOTER */}

        <View style={styles.footerSection}>
          {/* QR */}

          <View style={styles.qrContainer}>
            {qrCodeUrl ? (
              <Image src={qrCodeUrl} style={styles.qrImage} />
            ) : (
              <Text
                style={{
                  fontSize: 6,
                  color: "#94A3B8",
                }}
              >
                Loading QR...
              </Text>
            )}
          </View>

          {/* SIGNATURE */}

          <View style={styles.signatureContainer}>
            <View style={styles.signatureWrapper}>
              <Text style={styles.signatureText}>Eleanor Vance</Text>

              <View style={styles.digitalStampBadge}>
                <Text style={styles.stampText}>Digital Signature</Text>
              </View>
            </View>

            <View style={styles.signatureLine} />

            <Text style={styles.doctorSignatureTitle}>Dr. Eleanor Vance</Text>
          </View>
        </View>

        {/* SECURITY */}

        <Text style={styles.bottomSecurityBar}>
          Digitally signed & tamper-verified
        </Text>
      </Page>
    </Document>
  );
};

const PrescriptionPDF = () => {
  const { patientCustomId } = useParams();

  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);

  const [patient, setPatient] = useState(null);

  const [prescription, setPrescription] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!patientCustomId) {
        setError("Patient ID is missing from URL.");

        setLoading(false);

        return;
      }

      if (!backendUrl) {
        setError("Backend URL is not configured.");

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const baseUrl = backendUrl.endsWith("/")
          ? backendUrl.slice(0, -1)
          : backendUrl;

        const { data } = await axios.get(
          `${baseUrl}/api/pharmacy/prescription/patient/${encodeURIComponent(
            patientCustomId,
          )}`,
          {
            withCredentials: true,
          },
        );

        console.log("PrescriptionPDF API response:", data);

        if (!data.success) {
          throw new Error(data.message || "Unable to load prescription.");
        }

        if (!data.patient) {
          throw new Error("Patient information not found.");
        }

        if (!data.prescription) {
          throw new Error("No prescription found for this patient.");
        }

        setPatient(data.patient);
        setPrescription(data.prescription);
      } catch (err) {
        console.error("Prescription PDF loading error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load prescription.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [backendUrl, patientCustomId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-600">Loading patient prescription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white border rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-600">
            Prescription Not Available
          </h1>

          <p className="text-slate-600 mt-3">{error}</p>

          <button
            onClick={() => navigate("/pharmacy-dashboard")}
            className="mt-6 px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Back to Pharmacy
          </button>
        </div>
      </div>
    );
  }

  const pdfPatient = {
    patientName: patient?.name || prescription?.patientName || "N/A",

    patientId:
      patient?.patientCustomId ||
      prescription?.patientCustomId ||
      patientCustomId,

    ageGender: patient?.ageGender || prescription?.patientAgeGender || "N/A",

    validUntil: prescription?.validUntil || "",
  };

  const medicines = prescription?.medicines || [];

  const notes = prescription?.notes || "";

  const date = prescription?.date || prescription?.createdAt || "";

  return (
    <div className="w-full h-screen bg-slate-100">
      <PDFViewer width="100%" height="100%" showToolbar>
        <PrescriptionPDFDocument
          patient={pdfPatient}
          prescriptions={medicines}
          notes={notes}
          date={date}
        />
      </PDFViewer>
    </div>
  );
};

export default PrescriptionPDF;
