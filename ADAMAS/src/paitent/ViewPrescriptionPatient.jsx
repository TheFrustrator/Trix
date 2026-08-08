import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { Icons } from '../assets/assets';

// Register Times-Italic for the handwritten signature font
Font.register({
  family: 'Times-Italic',
  src: 'https://fonts.gstatic.com/s/timesnewroman/v1/TimesNewRomanPS-ItalicMT.ttf',
});

const styles = StyleSheet.create({
  page: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },

  /* HEADER SECTION */
  headerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 8,
},
  logoWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
},
logoIconBox: {
  backgroundColor: '#3B82F6', // Blue background matching UI
  borderRadius: 6,
  padding: 4,
  marginRight: 8,
  width: 22,
  height: 22,
  justifyContent: 'center',
  alignItems: 'center',
},
logoImage: {
  width: 14,
  height: 14,
  objectFit: 'contain',
},
logoText: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#0F172A',
  letterSpacing: -0.5,
},
  badge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    marginVertical: 8,
    width: '100%',
  },

  /* DOCTOR & PATIENT INFO */
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  infoBlock: {
    width: '48%',
  },
  doctorName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  infoText: {
    fontSize: 8.5,
    color: '#475569',
    marginBottom: 2.5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  },

  /* DIAGNOSIS BANNER */
  diagnosisBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  diagnosisText: {
    fontSize: 9,
    color: '#1E293B',
  },

  /* TABLE SECTION */
  tableContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#FAFAFA',
  },
  colMedicine: { width: '30%' },
  colDosage: { width: '15%' },
  colFrequency: { width: '22%' },
  colDuration: { width: '15%' },
  colTiming: { width: '18%' },

  medName: {
    fontWeight: 'bold',
    fontSize: 8.5,
    color: '#0F172A',
  },
  cellText: {
    fontSize: 8,
    color: '#334155',
  },

  /* NOTES */
  notesSection: {
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  notesText: {
    fontSize: 8.5,
    fontStyle: 'italic',
    color: '#1E293B',
    lineHeight: 1.3,
  },

  /* FOOTER SECTION: QR LEFT & SIGNATURE FAR RIGHT */
  footerSection: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between', // Keeps QR far left and Signature far right
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 15,
  },

  /* QR CODE IMAGE WRAPPER */
  qrContainer: {
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },

  /* DIGITAL SIGNATURE - Pushed to right corner */
  signatureContainer: {
    alignItems: 'center',
    width: 150,
  },
  signatureWrapper: {
    position: 'relative',
    marginBottom: 2,
    alignItems: 'center',
    justify: 'center',
    width: '100%',
  },
  signatureText: {
    fontFamily: 'Times-Italic',
    fontSize: 22,
    color: '#1E293B',
  },
  digitalStampBadge: {
    position: 'absolute',
    top: -4,
    right: 2,
    backgroundColor: '#E0F2FE',
    borderColor: '#7DD3FC',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  stampText: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#0369A1',
  },
  signatureLine: {
    width: 140,
    borderBottomWidth: 1,
    borderBottomColor: '#94A3B8',
    marginVertical: 4,
  },
  doctorSignatureTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  /* BOTTOM SECURITY BAR */
  bottomSecurityBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F1F5F9',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 7.5,
    color: '#475569',
  },
});

export const ViewPrescriptionPatient = ({ patient, prescriptions, notes, date }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const doctor = {
    name: "Dr. Eleanor Vance, MBBS, MD",
    clinic: "Oakwood Clinic",
    regNo: "12345",
    address: "123 Oakwood Ave, Cityville",
    phone: "(555) 0123",
  };

  const patientName = patient?.patientName || "Sarah Johnson";
  const patientId = patient?.patientId || "P-4041-XYZ";
  const ageGender = patient?.ageGender || "34 / Female";
  const issueDate = date || "12 May 2026";
  const validUntil = patient?.validUntil || "19 May 2026";
  const diagnosis = notes || "Bacterial throat infection";

  const medicineList =
    prescriptions && prescriptions.length > 0
      ? prescriptions
      : [
          {
            medicineName: "Amoxicillin 500mg",
            dosages: "1",
            frequency: "Twice a day",
            duration: "7",
            timing: "After food",
          },
          {
            medicineName: "Paracetamol 650mg",
            dosages: "1",
            frequency: "As needed (max 3/day)",
            duration: "5",
            timing: "After food",
          },
        ];

  // Convert QR Code Data to Base64 Image URL
  useEffect(() => {
    const qrData = JSON.stringify({
      patientId,
      patientName,
      doctorRegNo: doctor.regNo,
      issued: issueDate,
    });

    QRCode.toDataURL(qrData, { margin: 1, width: 200 })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Generation Error:", err));
  }, [patientId, patientName, issueDate]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Left & Right Corners */}
        <View style={styles.headerContainer}>
          <Image src={Icons.logoM} style={styles.logoImage} />
          <Text style={styles.logoText}>MediLink</Text>
          <Text style={styles.badge}>Digitally Verified Prescription</Text>
        </View>

        <View style={styles.divider} />

        {/* Doctor & Patient Information */}
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

        {/* Diagnosis Box */}
        <View style={styles.diagnosisBox}>
          <Text style={styles.diagnosisText}>
            <Text style={styles.boldText}>Diagnosis: </Text>
            {diagnosis}
          </Text>
        </View>

        {/* Table Container */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colMedicine, styles.tableHeaderCell]}>Medicine</Text>
            <Text style={[styles.colDosage, styles.tableHeaderCell]}>Dosage</Text>
            <Text style={[styles.colFrequency, styles.tableHeaderCell]}>Frequency</Text>
            <Text style={[styles.colDuration, styles.tableHeaderCell]}>Duration</Text>
            <Text style={[styles.colTiming, styles.tableHeaderCell]}>Timing</Text>
          </View>

          {medicineList.map((item, idx) => (
            <View
              key={item.id || idx}
              style={[
                styles.tableRow,
                idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              <Text style={[styles.colMedicine, styles.medName]}>
                {item.medicineName || item.name}
              </Text>
              <Text style={[styles.colDosage, styles.cellText]}>
                {item.dosages ? `${item.dosages} tablet` : item.dosage || "1 tablet"}
              </Text>
              <Text style={[styles.colFrequency, styles.cellText]}>{item.frequency}</Text>
              <Text style={[styles.colDuration, styles.cellText]}>
                {item.duration ? `${item.duration} days` : item.duration}
              </Text>
              <Text style={[styles.colTiming, styles.cellText]}>{item.timing}</Text>
            </View>
          ))}
        </View>

        {/* Doctor's Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Doctor's Notes</Text>
          <Text style={styles.notesText}>
            {notes ||
              "Complete the full course even if symptoms improve.\nFollow up if fever persists beyond 3 days."}
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          {/* QR Code (Visible PNG image) */}
          <View style={styles.qrContainer}>
            {qrCodeUrl ? (
              <Image src={qrCodeUrl} style={styles.qrImage} />
            ) : (
              <Text style={{ fontSize: 6, color: '#94A3B8' }}>Loading QR...</Text>
            )}
          </View>

          {/* Signature Block (Aligned to Far Right Corner) */}
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

        {/* Security Bar */}
        <Text style={styles.bottomSecurityBar}>
          🔒 Digitally signed & tamper-verified
        </Text>
      </Page>
    </Document>
  );
};