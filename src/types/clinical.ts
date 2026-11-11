export type UserRole = 'doctor' | 'patient' | 'admin';

export type DoctorVerificationStatus =
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'additional_documents_required';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  // Doctor-specific verification credentials
  medicalSpecialization?: string;
  registrationNumber?: string;
  stateMedicalCouncil?: string;
  hospitalAffiliation?: string;
  qualificationDetails?: string;
  supportingDocumentUrl?: string;
  verificationStatus?: DoctorVerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  // Patient-specific
  uhid?: string;
  abhaAddress?: string;
  emergencyContact?: string;
  // Admin-specific
  organization?: string;
  invitedBy?: string;
  createdAt: string;
}

export interface PatientVitals {
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: string;
  spO2: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  uhid: string;
  mrn?: string;
  abhaAddress?: string;
  city: string;
  state: string;
  pinCode: string;
  status: 'Critical Attention' | 'Monitoring' | 'Stable';
  chiefComplaint: string;
  vitals: PatientVitals;
  allergies: string[];
  diagnoses: string[];
  lastVisit: string;
}

export interface LabTestResult {
  id: string;
  name: string;
  category: 'Metabolic' | 'Renal' | 'Hematology' | 'Lipid' | 'Cardiovascular';
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  clinicalNote?: string;
}

export interface LabReport {
  id: string;
  patient_id: string;
  report_type: string;
  facility: string;
  collection_date: string;
  report_date: string;
  technician_name: string;
  tests: LabTestResult[];
  abnormal_count: number;
  critical_count: number;
  clinical_impression: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  activeIngredient: string;
  dosage: string;
  frequency: 'OD' | 'BD' | 'TDS' | 'QDS' | 'SOS' | 'Once Weekly';
  timing: 'Before Food' | 'After Food' | 'With Food' | 'At Bedtime';
  route: string;
  duration: string;
  prescribingDoctor: string;
  prescribedDate: string;
  inrPrice: number;
  status: 'active' | 'discontinued' | 'held' | 'adjusted';
  safetyWarning?: string;
}

export interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'Severe' | 'Moderate' | 'Minor';
  mechanism: string;
  clinicalConsequence: string;
  recommendation: string;
}

export interface ImagingStudy {
  id: string;
  patient_id: string;
  modality: 'Chest X-Ray (PA)' | 'CT Thorax' | 'Ultrasound Abdomen' | 'MRI Brain';
  accession_number: string;
  performed_at: string;
  facility: string;
  radiologist_name: string;
  findings: string;
  cardiothoracicRatio?: number;
  segmentationFindings?: string;
  confidenceScore?: number;
  image_url: string;
  status: 'Reported' | 'Review Required' | 'Preliminary';
}

export interface ClinicalReviewSummary {
  patient_id: string;
  synthesis: string;
  key_findings: string[];
  rssdi_guideline_alignment: string;
  cdsco_precautions: string;
  differential_diagnosis: string[];
  suggested_action_plan: string[];
  review_status: 'Pending Review' | 'Approved' | 'Requires Clarification';
  doctor_notes?: string;
  reviewer_name?: string;
  approved_at?: string;
  // Patient multilingual summary
  patient_summary_en: string;
  patient_summary_hi: string;
  patient_summary_kn: string;
}

export interface TimelineEvent {
  id: string;
  patient_id: string;
  date: string;
  category: 'lab' | 'prescription' | 'imaging' | 'review' | 'vitals';
  title: string;
  description: string;
  badgeText: string;
  severity: 'critical' | 'attention' | 'stable';
}

export interface AuditLog {
  id: string;
  timestamp: string; // IST
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  ipAddress: string;
  details: string;
}
