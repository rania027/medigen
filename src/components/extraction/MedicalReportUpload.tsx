import React, { useState } from 'react';
import { LabReport, LabTestResult } from '../../types/clinical.ts';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface MedicalReportUploadProps {
  patientId: string;
  patientName: string;
  onExtracted: (report: LabReport) => void;
}

export const MedicalReportUpload: React.FC<MedicalReportUploadProps> = ({
  patientId,
  patientName,
  onExtracted,
}) => {
  const [loading, setLoading] = useState(false);
  const [extractedReport, setExtractedReport] = useState<LabReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');

  const sampleReportText = `SUNRISE DIAGNOSTIC LABORATORIES
NABL ACCREDITATION: MC-2941
Patient: Ananya Sharma (UHID-KA-934812)
Collection Date: 11-11-2026 08:00 IST

INVESTIGATION                          RESULT     UNIT        REFERENCE RANGE
Serum Creatinine (Enzymatic)          1.95       mg/dL       0.50 - 1.10 (HIGH)
Estimated GFR (CKD-EPI 2021)          35.0       mL/min      >= 90.0 (CRITICAL LOW)
Blood Urea Nitrogen (BUN)             36.0       mg/dL       7.0 - 20.0 (HIGH)
Serum Potassium (ISE)                 5.3        mEq/L       3.5 - 5.0 (HIGH)
Serum Sodium                          138.0      mEq/L       136 - 145 (NORMAL)
Glycated Hemoglobin (HbA1c)           8.9        %           < 5.7 (HIGH)
Fasting Plasma Glucose                182.0      mg/dL       70 - 99 (HIGH)
Urine Albumin-to-Creatinine Ratio     310.0      mg/g        < 30.0 (CRITICAL)`;

  const handleRunExtraction = async (textToProcess?: string) => {
    setError(null);
    setLoading(true);

    const content = textToProcess || rawText || sampleReportText;
    const token = localStorage.getItem('medigen_token');

    try {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          patientId,
          documentText: content,
          documentType: 'Laboratory Investigation Report',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gemini report extraction failed.');
      }

      setExtractedReport(data.report);
      onExtracted(data.report);
    } catch (err: any) {
      setError(err.message || 'Failed to extract report data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a6364]/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#214b4c]/10 text-[#214b4c] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
              Gemini 3.8 Flash Multimodal Lab Report Ingestion
            </h3>
            <p className="text-[11px] text-[#717978]">
              Parses PDF/Image reports into validated clinical schemas with NABL reference ranges
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRawText(sampleReportText);
            handleRunExtraction(sampleReportText);
          }}
          className="text-xs px-3 py-1.5 bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[#214b4c] font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Load Sample NABL Report
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone / Text Input */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste clinical laboratory report text or OCR output here (e.g., from Sunrise Diagnostics)..."
            className="w-full p-3 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs font-mono text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-[#717978]">
            Targets Patient: <strong className="text-[#181a2e]">{patientName}</strong> ({patientId})
          </span>

          <button
            onClick={() => handleRunExtraction()}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Gemini Extraction...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Extract Lab Analytes & Update Timeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Table Preview */}
      {extractedReport && (
        <div className="pt-4 border-t border-[#3a6364]/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#284b4c]">
            <CheckCircle2 className="w-4 h-4 text-[#284b4c]" />
            <span>
              Successfully Extracted {extractedReport.tests.length} Biomarkers from{' '}
              {extractedReport.facility}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f0e8] text-[#717978] font-semibold">
                <tr>
                  <th className="py-2 px-3">Test</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3">Reference Range</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a6364]/10">
                {extractedReport.tests.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#fdfbf7]">
                    <td className="py-2 px-3 font-semibold text-[#181a2e]">{t.name}</td>
                    <td className="py-2 px-3 text-[#717978]">{t.category}</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#214b4c]">
                      {t.value} {t.unit}
                    </td>
                    <td className="py-2 px-3 text-[#717978]">{t.referenceRange}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          t.status === 'critical'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : t.status === 'abnormal'
                            ? 'bg-[#fff3cd] text-[#664d03]'
                            : 'bg-[#d1e7dd] text-[#284b4c]'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
