import React, { useState } from 'react';
import {
  Patient,
  LabReport,
  MedicationItem,
  ImagingStudy,
  ClinicalReviewSummary,
} from '../types/clinical.ts';
import { generateClinicalPdf } from '../utils/pdfGenerator.ts';
import {
  Sparkles,
  AlertTriangle,
  FileCheck2,
  FileDown,
  CheckCircle2,
  BookOpen,
  Shield,
  Activity,
  Award,
} from 'lucide-react';

interface DecisionSupportWorkspaceProps {
  patient: Patient;
  labReport: LabReport;
  medications: MedicationItem[];
  imagingStudies: ImagingStudy[];
  summary: ClinicalReviewSummary;
  onApproveSummary: (notes: string) => void;
}

export const DecisionSupportWorkspace: React.FC<DecisionSupportWorkspaceProps> = ({
  patient,
  labReport,
  medications,
  summary,
  onApproveSummary,
}) => {
  const [doctorNotes, setDoctorNotes] = useState(
    summary.doctor_notes ||
      'Concur with proposed dose reduction of Glycomet to 500mg BD. Discontinue Brufen; prescribe Paracetamol 500mg SOS. Repeat renal function panel in 14 days.'
  );
  const [approvedSuccess, setApprovedSuccess] = useState(false);

  const handleApprove = () => {
    onApproveSummary(doctorNotes);
    setApprovedSuccess(true);
    setTimeout(() => setApprovedSuccess(false), 5000);
  };

  const isApproved = summary.review_status === 'Approved' || approvedSuccess;

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Strip */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif-clinical text-xl font-bold text-[#181a2e]">
              Multimodal Clinical Diagnostic Synthesis
            </h2>
            <span className="text-[10px] font-mono uppercase bg-[#214b4c]/10 text-[#214b4c] font-bold px-2 py-0.5 rounded-full">
              Gemini 3.8 Flash + RSSDI Grounding
            </span>
          </div>
          <p className="text-xs text-[#717978] mt-0.5">
            Cross-analyzing lab biomarkers, current pharmacotherapy, and thoracic radiograph
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => generateClinicalPdf(patient, labReport, medications, summary)}
            className="py-2 px-3.5 border border-[#3a6364]/20 hover:border-[#214b4c] text-[#214b4c] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Clinical PDF</span>
          </button>
        </div>
      </div>

      {approvedSuccess && (
        <div className="bg-[#d1e7dd] border border-[#284b4c]/30 p-3 rounded-xl text-xs text-[#284b4c] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Physician orders and clinical concurrence signed successfully into patient chart.</span>
        </div>
      )}

      {/* Synthesis Card */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#3a6364]/10 pb-3">
          <Sparkles className="w-4 h-4 text-[#214b4c]" />
          <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
            Holistic Case Synthesis & Organ Status
          </h3>
        </div>

        <p className="text-sm font-serif-clinical text-[#181a2e] leading-relaxed">
          {summary.synthesis}
        </p>

        {/* Diagnostic Key Findings */}
        <div className="pt-2 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#717978]">
            Key Diagnostic Findings
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {summary.key_findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#fdfbf7] border border-[#3a6364]/10 text-xs flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-[#214b4c]/10 text-[#214b4c] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[#181a2e] leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guidelines Alignment Strip: RSSDI & CDSCO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#fdfbf7] rounded-2xl border border-[#3a6364]/15 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#214b4c]">
            <BookOpen className="w-4 h-4 text-[#536251]" />
            RSSDI 2024 Clinical Practice Guidelines Alignment
          </div>
          <p className="text-xs text-[#181a2e]/90 leading-relaxed">
            {summary.rssdi_guideline_alignment}
          </p>
        </div>

        <div className="bg-[#fdfbf7] rounded-2xl border border-[#ba1a1a]/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ba1a1a]">
            <AlertTriangle className="w-4 h-4" />
            CDSCO Safety Warnings & Drug Alerts
          </div>
          <p className="text-xs text-[#181a2e]/90 leading-relaxed">
            {summary.cdsco_precautions}
          </p>
        </div>
      </div>

      {/* Suggested Action Plan */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#3a6364]/10 pb-3">
          <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
            Recommended Clinical Action Plan
          </h3>
          <span className="text-xs font-mono text-[#717978]">Prioritized Orders</span>
        </div>

        <div className="space-y-2.5">
          {summary.suggested_action_plan.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#fdfbf7] border border-[#3a6364]/10 flex items-start gap-3 text-xs"
            >
              <div className="w-5 h-5 rounded-lg bg-[#214b4c] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="text-[#181a2e] leading-relaxed flex-1">{item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Attending Physician Review & Sign-Off Block */}
      <div className="bg-white rounded-2xl border-2 border-[#214b4c]/30 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#3a6364]/10 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#214b4c]" />
            <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
              Physician Concurrence & Clinical Order Sign-Off
            </h3>
          </div>
          {isApproved ? (
            <span className="text-xs bg-[#d1e7dd] text-[#284b4c] px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Clinically Signed & Approved
            </span>
          ) : (
            <span className="text-xs bg-[#fff3cd] text-[#664d03] px-3 py-1 rounded-full font-bold">
              Pending Attending Review
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#181a2e] mb-1.5">
            Physician Modification / Addendum Notes
          </label>
          <textarea
            rows={3}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full p-3 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
            placeholder="Document your clinical concurrence or modifications to orders..."
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-[#717978]">
            {isApproved && summary.approved_at && (
              <span>
                Approved by {summary.reviewer_name || 'Attending Physician'} on{' '}
                {new Date(summary.approved_at).toLocaleString('en-GB')}
              </span>
            )}
          </div>

          <button
            onClick={handleApprove}
            className="w-full sm:w-auto py-2.5 px-6 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#a3cfbb]" />
            <span>Approve Orders & Sign Off</span>
          </button>
        </div>
      </div>
    </div>
  );
};
