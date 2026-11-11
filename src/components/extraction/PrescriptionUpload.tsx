import React, { useState } from 'react';
import { MedicationItem } from '../../types/clinical.ts';
import {
  Upload,
  Pill,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface PrescriptionUploadProps {
  patientId: string;
  onExtractedMedications: (meds: MedicationItem[]) => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  patientId,
  onExtractedMedications,
}) => {
  const [loading, setLoading] = useState(false);
  const [rawRxText, setRawRxText] = useState('');
  const [extractedList, setExtractedList] = useState<MedicationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sampleRxText = `Rx Prescription
Dr. Suresh Iyer, MD (Internal Medicine), KMC # 41920
Aarogya Multispeciality Hospital, Bengaluru
Patient: Ananya Sharma (58Y / F)

1. Tab. Glycomet SR 1000 mg - 1 tab BD - After food x 1 month
2. Tab. Telma-H (40/12.5) - 1 tab OD (Morning) - Before food x 1 month
3. Tab. Brufen 400 mg - 1 tab SOS - After food for knee pain
4. Tab. Rozavel 10 mg - 1 tab OD (Night) - At bedtime x 1 month`;

  const handleExtractRx = async (textToProcess?: string) => {
    setError(null);
    setLoading(true);

    const content = textToProcess || rawRxText || sampleRxText;
    const token = localStorage.getItem('medigen_token');

    try {
      const res = await fetch('/api/prescriptions/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          patientId,
          prescriptionText: content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Prescription extraction failed.');
      }

      setExtractedList(data.medications);
      onExtractedMedications(data.medications);
    } catch (err: any) {
      setError(err.message || 'Failed to extract prescription items.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3a6364]/15 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a6364]/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#536251]/10 text-[#536251] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
              Gemini 3.8 Flash Prescription OCR & Parsing
            </h3>
            <p className="text-[11px] text-[#717978]">
              Deciphers handwritten/printed Rx slips, Indian medical dosage codes (OD, BD, TDS, SOS) and food timings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRawRxText(sampleRxText);
            handleExtractRx(sampleRxText);
          }}
          className="text-xs px-3 py-1.5 bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[#214b4c] font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Load Indian Hospital Rx Slip
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        <textarea
          rows={4}
          value={rawRxText}
          onChange={(e) => setRawRxText(e.target.value)}
          placeholder="Paste prescription text or clinical order transcription here..."
          className="w-full p-3 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs font-mono text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
        />

        <div className="flex justify-end">
          <button
            onClick={() => handleExtractRx()}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Pharmacotherapy...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Parse Prescription & Ingest Regimen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {extractedList.length > 0 && (
        <div className="pt-4 border-t border-[#3a6364]/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#284b4c]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Extracted {extractedList.length} Formulations into Patient Regimen</span>
          </div>

          <div className="space-y-2">
            {extractedList.map((med, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#fdfbf7] border border-[#3a6364]/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div>
                  <span className="font-bold text-[#181a2e]">{med.name}</span>
                  <p className="text-[11px] text-[#717978]">
                    {med.activeIngredient} · Dose: {med.dosage} · Freq: {med.frequency} ({med.timing})
                  </p>
                </div>
                <div className="text-right font-mono text-[#214b4c] font-bold">
                  ₹{med.inrPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
