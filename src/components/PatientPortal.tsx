import React, { useState } from 'react';
import {
  Patient,
  ClinicalReviewSummary,
  LabReport,
  MedicationItem,
  TimelineEvent,
} from '../types/clinical.ts';
import {
  Heart,
  AlertTriangle,
  Pill,
  FileText,
  PhoneCall,
  Calendar,
  Languages,
  CheckCircle2,
  Clock,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface PatientPortalProps {
  patient: Patient;
  summary: ClinicalReviewSummary;
  labReport?: LabReport;
  medications: MedicationItem[];
  timeline: TimelineEvent[];
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  patient,
  summary,
  labReport,
  medications,
  timeline,
}) => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'kn'>('en');

  const getLocalizedSummary = () => {
    switch (selectedLang) {
      case 'hi':
        return summary.patient_summary_hi;
      case 'kn':
        return summary.patient_summary_kn;
      default:
        return summary.patient_summary_en;
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Greeting & Emergency Hotline Bar */}
      <div className="bg-gradient-to-r from-[#536251] to-[#3a6364] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-white/20 text-[#fdfbf7] font-semibold">
              UHID: {patient.uhid} · ABHA: {patient.abhaAddress}
            </span>
            <span className="text-[11px] bg-[#d1e7dd] text-[#284b4c] px-2 py-0.5 rounded-full font-bold">
              Active Record
            </span>
          </div>
          <h1 className="font-serif-clinical text-2xl sm:text-3xl font-bold">
            Namaste, {patient.name}
          </h1>
          <p className="text-xs text-white/80 mt-1">
            {patient.city}, {patient.state} · Pin: {patient.pinCode} · Primary Care: Dr. Rajesh K. Varma
          </p>
        </div>

        {/* 112 National Emergency Hotline */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-white/70 uppercase font-mono">
              National Emergency (India)
            </div>
            <div className="text-lg font-bold font-mono tracking-wide">
              112 / 108 Ambulance
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Physician Guidance Card */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a6364]/10 pb-4">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-[#214b4c]" />
            <h2 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
              Physician Summary for Patient (Multi-Language)
            </h2>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#f4f0e8] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLang === 'en'
                  ? 'bg-white text-[#214b4c] shadow-xs'
                  : 'text-[#717978] hover:text-[#181a2e]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLang === 'hi'
                  ? 'bg-white text-[#214b4c] shadow-xs'
                  : 'text-[#717978] hover:text-[#181a2e]'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setSelectedLang('kn')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLang === 'kn'
                  ? 'bg-white text-[#214b4c] shadow-xs'
                  : 'text-[#717978] hover:text-[#181a2e]'
              }`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
          </div>
        </div>

        {/* Localized Content */}
        <div className="bg-[#fdfbf7] border border-[#3a6364]/15 rounded-xl p-4 sm:p-5 text-sm text-[#181a2e] leading-relaxed font-serif-clinical">
          {getLocalizedSummary()}
        </div>

        {/* Urgent Patient Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/20 rounded-xl flex items-start gap-2.5 text-xs text-[#ba1a1a]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Stop Brufen (Ibuprofen) Immediately:</strong> Taking NSAID painkillers while your eGFR is 38 mL/min can trigger acute kidney strain. Contact clinic before taking any new pain medication.
            </div>
          </div>

          <div className="p-3 bg-[#fff3cd]/50 border border-[#ffe69c] rounded-xl flex items-start gap-2.5 text-xs text-[#664d03]">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Follow-Up Lab Scheduled:</strong> Repeat Serum Creatinine and Urine Microalbumin test in 14 days at Sunrise Diagnostic Laboratories, Indiranagar.
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Current Medications & Lab Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medications */}
        <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#3a6364]/10 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#214b4c]" />
              <h2 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
                Your Prescriptions & Schedule
              </h2>
            </div>
            <span className="text-xs text-[#717978]">Indian MRP (₹)</span>
          </div>

          <div className="space-y-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-3.5 rounded-xl border border-[#3a6364]/15 bg-[#fdfbf7] space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#181a2e]">{med.name}</h3>
                    <p className="text-[11px] text-[#717978]">{med.activeIngredient}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#214b4c]">
                    ₹{med.inrPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#214b4c]/10 text-[#214b4c] font-bold">
                    {med.dosage}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f4f0e8] text-[#181a2e] font-semibold">
                    Frequency: {med.frequency}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f4f0e8] text-[#717978]">
                    Timing: {med.timing}
                  </span>
                </div>

                {med.safetyWarning && (
                  <div className="text-[11px] bg-[#ffdad6] text-[#ba1a1a] p-2 rounded-lg font-medium flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{med.safetyWarning}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Latest Lab Values */}
        <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#3a6364]/10 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#214b4c]" />
              <h2 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
                Latest Lab Results
              </h2>
            </div>
            <span className="text-xs font-mono text-[#717978]">Sunrise Diagnostics</span>
          </div>

          {labReport && (
            <div className="space-y-3">
              <div className="text-xs text-[#717978] flex items-center justify-between">
                <span>Date: {labReport.report_date}</span>
                <span className="font-semibold text-[#ba1a1a]">
                  {labReport.critical_count} Critical Values
                </span>
              </div>

              <div className="space-y-2">
                {labReport.tests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      test.status === 'critical'
                        ? 'border-[#ba1a1a]/30 bg-[#ffdad6]/20'
                        : test.status === 'abnormal'
                        ? 'border-[#ffc107]/40 bg-[#fff3cd]/20'
                        : 'border-[#3a6364]/10 bg-[#fdfbf7]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[#181a2e]">{test.name}</span>
                      <p className="text-[10px] text-[#717978]">
                        Ref: {test.referenceRange} {test.unit}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          test.status === 'critical'
                            ? 'text-[#ba1a1a]'
                            : test.status === 'abnormal'
                            ? 'text-[#ba1a1a]'
                            : 'text-[#214b4c]'
                        }`}
                      >
                        {test.value} <span className="text-xs font-normal">{test.unit}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patient Health Care Journey Timeline */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#3a6364]/10 pb-3">
          <Calendar className="w-5 h-5 text-[#214b4c]" />
          <h2 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
            Your Care Timeline & Clinical Orders
          </h2>
        </div>

        <div className="space-y-3">
          {timeline.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#3a6364]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#181a2e]">{evt.title}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      evt.severity === 'critical'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : evt.severity === 'attention'
                        ? 'bg-[#fff3cd] text-[#664d03]'
                        : 'bg-[#d1e7dd] text-[#284b4c]'
                    }`}
                  >
                    {evt.badgeText}
                  </span>
                </div>
                <p className="text-xs text-[#717978]">{evt.description}</p>
              </div>

              <div className="text-[11px] font-mono text-[#717978] shrink-0">
                {evt.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
