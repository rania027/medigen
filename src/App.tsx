import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { AuthPortal } from './components/auth/AuthPortal.tsx';
import { DoctorPendingVerification } from './components/DoctorPendingVerification.tsx';
import { PatientDirectory } from './components/PatientDirectory.tsx';
import { ReportAnalyzer } from './components/ReportAnalyzer.tsx';
import { PrescriptionSafety } from './components/PrescriptionSafety.tsx';
import { ImagingAnalysis } from './components/ImagingAnalysis.tsx';
import { ClinicalAssistant } from './components/ClinicalAssistant.tsx';
import { DecisionSupportWorkspace } from './components/DecisionSupportWorkspace.tsx';
import { KnowledgeGraph } from './components/KnowledgeGraph.tsx';
import { PatientPortal } from './components/PatientPortal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { MedicalReportUpload } from './components/extraction/MedicalReportUpload.tsx';
import { PrescriptionUpload } from './components/extraction/PrescriptionUpload.tsx';
import { FloatingClinicalChatbot } from './components/FloatingClinicalChatbot.tsx';

import {
  SYNTHETIC_PATIENTS,
  SYNTHETIC_LAB_REPORTS,
  SYNTHETIC_MEDICATIONS,
  SYNTHETIC_DRUG_INTERACTIONS,
  SYNTHETIC_IMAGING_STUDIES,
  SYNTHETIC_CLINICAL_SUMMARY,
  SYNTHETIC_TIMELINE_EVENTS,
  SYNTHETIC_AUDIT_LOGS,
} from './data/mockClinicalData.ts';
import { Patient, LabReport, MedicationItem, ClinicalReviewSummary, UserAccount } from './types/clinical.ts';
import { LogOut, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Trusted Authenticated Account from Backend
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Active sub-tab inside the authorized role's viewport
  const [activeTab, setActiveTab] = useState<string>('workspace');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PT-8024');

  // Dynamic clinical state
  const [patients, setPatients] = useState<Patient[]>(SYNTHETIC_PATIENTS);
  const [labReports, setLabReports] = useState<LabReport[]>(SYNTHETIC_LAB_REPORTS);
  const [medications, setMedications] = useState<MedicationItem[]>(SYNTHETIC_MEDICATIONS);
  const [drugInteractions, setDrugInteractions] = useState(SYNTHETIC_DRUG_INTERACTIONS);
  const [imagingStudies] = useState(SYNTHETIC_IMAGING_STUDIES);
  const [clinicalSummary, setClinicalSummary] = useState<ClinicalReviewSummary>(SYNTHETIC_CLINICAL_SUMMARY);
  const [timelineEvents, setTimelineEvents] = useState(SYNTHETIC_TIMELINE_EVENTS);
  const [auditLogs] = useState(SYNTHETIC_AUDIT_LOGS);

  // Auto-check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('medigen_token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            setAuthToken(storedToken);
            setInitialTabForRole(data.user.role);
          } else {
            localStorage.removeItem('medigen_token');
          }
        } catch {
          localStorage.removeItem('medigen_token');
        }
      }
    };
    checkSession();
  }, []);

  const setInitialTabForRole = (role: 'doctor' | 'patient' | 'admin') => {
    if (role === 'patient') setActiveTab('patient-portal');
    else if (role === 'admin') setActiveTab('admin-overview');
    else setActiveTab('workspace');
  };

  const handleAuthenticated = (user: UserAccount, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('medigen_token', token);
    setInitialTabForRole(user.role);
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('medigen_token');
  };

  const refreshCurrentUser = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const currentPatientLabs = labReports.filter(
    (l) => l.patient_id === selectedPatient.id
  );
  const latestLab = currentPatientLabs[0];
  const priorLab = currentPatientLabs[1];

  const handleUpdateReport = (newReport: LabReport) => {
    setLabReports((prev) => [newReport, ...prev]);
    setTimelineEvents((prev) => [
      {
        id: `tl-${Date.now()}`,
        patient_id: selectedPatient.id,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        category: 'lab',
        title: `Report Analyzed: ${newReport.report_type}`,
        description: `Extracted ${newReport.tests.length} tests with ${newReport.abnormal_count} abnormal values.`,
        badgeText: 'AI Extraction',
        severity: newReport.critical_count > 0 ? 'critical' : 'attention',
      },
      ...prev,
    ]);
  };

  const handleAddMedication = (newMed: MedicationItem) => {
    setMedications((prev) => [...prev, newMed]);
  };

  const handleAddExtractedMedications = (extractedMeds: MedicationItem[]) => {
    setMedications((prev) => [...extractedMeds, ...prev]);
    setTimelineEvents((prev) => [
      {
        id: `tl-rx-${Date.now()}`,
        patient_id: selectedPatient.id,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        category: 'prescription',
        title: `AI Prescription Ingestion`,
        description: `Extracted ${extractedMeds.length} prescription medications.`,
        badgeText: 'Rx Extraction',
        severity: 'attention',
      },
      ...prev,
    ]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleApproveSummary = (doctorNotes: string) => {
    const updated: ClinicalReviewSummary = {
      ...clinicalSummary,
      review_status: 'Approved',
      doctor_notes: doctorNotes,
      reviewer_name: currentUser?.name || 'Dr. Julian Thorne, MD (Endocrinology)',
      approved_at: new Date().toISOString(),
    };
    setClinicalSummary(updated);

    setTimelineEvents((prev) => [
      {
        id: `tl-appr-${Date.now()}`,
        patient_id: selectedPatient.id,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        category: 'review',
        title: 'Physician Clinical Concurrence & Orders Signed',
        description: `${currentUser?.name || 'Attending Physician'} approved modified clinical decision support plan.`,
        badgeText: 'Clinician Approved',
        severity: 'stable',
      },
      ...prev,
    ]);
  };

  // If user is not authenticated, render entry screen & login/register forms
  if (!currentUser) {
    return <AuthPortal onAuthenticated={handleAuthenticated} />;
  }

  // Doctor Gate: If user is a doctor whose account is not yet verified, show pending verification gate
  if (currentUser.role === 'doctor' && currentUser.verificationStatus !== 'verified') {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans text-[#181a2e]">
        <Header
          currentRole={currentUser.role}
          userName={currentUser.name}
          verificationStatus={currentUser.verificationStatus}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <DoctorPendingVerification
            doctor={currentUser}
            onLogout={handleLogout}
            onRefresh={refreshCurrentUser}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans text-[#181a2e]">
      {/* Haute-Clinical Top Bar (Role switching buttons removed; displays fixed trusted role) */}
      <Header
        currentRole={currentUser.role}
        userName={currentUser.name}
        verificationStatus={currentUser.verificationStatus}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* User Session Banner Strip: Non-editable trusted identity */}
      <div className="bg-[#f4f0e8]/80 border-b border-[#3a6364]/10 py-1.5 px-4 sm:px-6 lg:px-8 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#214b4c]">Authenticated Identity:</span>
          <span className="font-bold text-[#181a2e]">{currentUser.name}</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white border border-[#3a6364]/15 text-[#3a6364]">
            {currentUser.role.toUpperCase()}
          </span>
          {currentUser.role === 'doctor' && (
            <span className="text-[10px] bg-[#d1e7dd] text-[#284b4c] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Credential Verified
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-[#717978] hover:text-[#ba1a1a] flex items-center gap-1 font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Workspace Stage strictly governed by backend currentUser.role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* DOCTOR VIEWPORT */}
        {currentUser.role === 'doctor' && (
          <>
            {/* Patient Header Strip */}
            <div className="bg-white rounded-2xl border border-[#3a6364]/10 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#3a6364]/10 text-[#214b4c] flex items-center justify-center font-bold text-sm">
                  {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif-clinical text-xl font-bold text-[#181a2e]">
                      {selectedPatient.name}
                    </h1>
                    <span className="text-xs font-mono text-[#717978]">
                      UHID: {selectedPatient.uhid || selectedPatient.mrn}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        selectedPatient.status === 'Critical Attention'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#d1e7dd] text-[#284b4c]'
                      }`}
                    >
                      {selectedPatient.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#717978] mt-1">
                    <span>{selectedPatient.age} Y / {selectedPatient.gender}</span>
                    <span>·</span>
                    <span>Blood: {selectedPatient.bloodGroup}</span>
                    <span>·</span>
                    <span>BP: {selectedPatient.vitals.bloodPressure}</span>
                    <span>·</span>
                    <span>HR: {selectedPatient.vitals.heartRate} bpm</span>
                    <span>·</span>
                    <span>eGFR: 38 mL/min (Stage 3b)</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Bar for Doctor */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-[#f4f0e8] p-1.5 rounded-xl">
                <button
                  onClick={() => setActiveTab('workspace')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                    activeTab === 'workspace'
                      ? 'bg-white text-[#214b4c] shadow-xs'
                      : 'text-[#717978] hover:text-[#181a2e]'
                  }`}
                >
                  Decision Support
                </button>
                <button
                  onClick={() => setActiveTab('analyzer')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                    activeTab === 'analyzer'
                      ? 'bg-white text-[#214b4c] shadow-xs'
                      : 'text-[#717978] hover:text-[#181a2e]'
                  }`}
                >
                  Lab Analyzer & Upload
                </button>
                <button
                  onClick={() => setActiveTab('prescriptions')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                    activeTab === 'prescriptions'
                      ? 'bg-white text-[#214b4c] shadow-xs'
                      : 'text-[#717978] hover:text-[#181a2e]'
                  }`}
                >
                  Rx & Drug Safety
                </button>
                <button
                  onClick={() => setActiveTab('imaging')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                    activeTab === 'imaging'
                      ? 'bg-white text-[#214b4c] shadow-xs'
                      : 'text-[#717978] hover:text-[#181a2e]'
                  }`}
                >
                  Imaging
                </button>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                    activeTab === 'assistant'
                      ? 'bg-white text-[#214b4c] shadow-xs'
                      : 'text-[#717978] hover:text-[#181a2e]'
                  }`}
                >
                  Clinical AI
                </button>
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                    activeTab === 'graph'
                      ? 'bg-white text-[#214b4c] shadow-xs'
                      : 'text-[#717978] hover:text-[#181a2e]'
                  }`}
                >
                  Knowledge Graph
                </button>
              </div>
            </div>

            {/* Sub-Views for Doctor */}
            {activeTab === 'workspace' && (
              <div className="space-y-6">
                <DecisionSupportWorkspace
                  patient={selectedPatient}
                  labReport={latestLab}
                  medications={medications}
                  imagingStudies={imagingStudies}
                  summary={clinicalSummary}
                  onApproveSummary={handleApproveSummary}
                />

                <PatientDirectory
                  patients={patients}
                  selectedPatientId={selectedPatientId}
                  onSelectPatient={setSelectedPatientId}
                />
              </div>
            )}

            {activeTab === 'analyzer' && (
              <div className="space-y-6">
                <MedicalReportUpload
                  patientId={selectedPatient.id}
                  patientName={selectedPatient.name}
                  onExtracted={handleUpdateReport}
                />

                <ReportAnalyzer
                  patient={selectedPatient}
                  currentReport={latestLab}
                  priorReport={priorLab}
                  onUpdateReport={handleUpdateReport}
                />
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <PrescriptionUpload
                  patientId={selectedPatient.id}
                  onExtractedMedications={handleAddExtractedMedications}
                />

                <PrescriptionSafety
                  patient={selectedPatient}
                  medications={medications}
                  drugInteractions={drugInteractions}
                  onAddMedication={handleAddMedication}
                  onRemoveMedication={handleRemoveMedication}
                />
              </div>
            )}

            {activeTab === 'imaging' && (
              <ImagingAnalysis
                patient={selectedPatient}
                studies={imagingStudies}
              />
            )}

            {activeTab === 'assistant' && (
              <ClinicalAssistant
                patient={selectedPatient}
                labReports={currentPatientLabs}
                medications={medications}
                imagingStudies={imagingStudies}
              />
            )}

            {activeTab === 'graph' && (
              <KnowledgeGraph patient={selectedPatient} />
            )}
          </>
        )}

        {/* PATIENT PORTAL VIEWPORT */}
        {currentUser.role === 'patient' && (
          <PatientPortal
            patient={selectedPatient}
            summary={clinicalSummary}
            labReport={latestLab}
            medications={medications}
            timeline={timelineEvents}
          />
        )}

        {/* ADMIN VIEWPORT */}
        {currentUser.role === 'admin' && (
          <AdminPanel auditLogs={auditLogs} authToken={authToken || undefined} />
        )}
      </main>

      {/* Floating Context-Aware Gemini Clinical Co-Pilot Chatbot */}
      {currentUser && (currentUser.role === 'doctor' || currentUser.role === 'patient') && (
        <FloatingClinicalChatbot
          patient={selectedPatient}
          latestLab={latestLab}
          medications={medications}
          drugInteractions={drugInteractions}
        />
      )}

      {/* Haute-Clinical Footer */}
      <footer className="mt-auto border-t border-[#3a6364]/10 bg-white/70 py-6 text-xs text-[#717978]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-clinical font-bold text-[#181a2e]">
              MEDIGEN
            </span>
            <span>·</span>
            <span>Haute-Clinical Diagnostic Intelligence Platform</span>
          </div>

          <div className="text-[11px] text-[#717978] text-center sm:text-right">
            MEDIGEN provides AI-assisted decision support and does not replace professional clinical diagnosis.
          </div>
        </div>
      </footer>
    </div>
  );
}
