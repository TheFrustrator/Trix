{/* PDF Download Button */}
              {prescriptions.length > 0 ? (
                <PDFDownloadLink
                  document={
                    <PrescriptionPDF
                      patient={singlePatientMockData}
                      prescriptions={prescriptions}
                      notes={prescriptionNotes}
                      date={date}
                    />
                  }
                  fileName={`Prescription_${singlePatientMockData.patientId}.pdf`}
                  className="w-2/3 bg-blue-500 hover:bg-blue-600 text-center py-2 rounded-lg text-white font-semibold text-md cursor-pointer transition-colors shadow-sm"
                >

                  {({ loading }) => (loading ? "Generating PDF..." : "Generate PDF")} hi
                </PDFDownloadLink>
              ) : (
                <button
                  type="button"
                  onClick={() => alert("Please add at least one medicine item.")}
                  className="w-2/3 bg-blue-300 rounded-lg py-2 text-white font-semibold text-md cursor-not-allowed"
                >
                  Submit Final Prescription
                </button>
              )}

            




//////////////////////////////////////////////////////////////////////////////////


 <PDFDownloadLink
                document={
                  <PrescriptionPDF
                    patient={singlePatientMockData}
                    prescriptions={prescriptions}
                    notes={prescriptionNotes}
                    date={date}
                  />
                }
                fileName={`Prescription_${singlePatientMockData?.patientId}.pdf`}
                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition-colors cursor-pointer"
              >
                {({ loading }) => (
                  <>
                    <FaFilePdf size={16} />
                    <button onClick={() => navigate("/active-patient/summary/pdf-view")}>{loading ? "Preparing..." : "View PDF"}</button>
                  </>
                )}
              </PDFDownloadLink>