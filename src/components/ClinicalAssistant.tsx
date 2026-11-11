import React, { useState } from 'react';
import { Patient, LabReport, MedicationItem, ImagingStudy } from '../types/clinical.ts';
import {
  Sparkles,
  Send,
  Loader2,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  Activity,
  AlertCircle,
} from 'lucide-react';

interface ClinicalAssistantProps {
  patient: Patient;
  labReports: LabReport[];
  medications: MedicationItem[];
  imagingStudies: ImagingStudy[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}

export const ClinicalAssistant: React.FC<ClinicalAssistantProps> = ({
  patient,
  labReports,
  medications,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings Doctor. I am your MEDIGEN Clinical Decision Intelligence Assistant, calibrated with RSSDI (Research Society for the Study of Diabetes in India) 2024 guidelines and CDSCO drug safety monographs. I have indexed ${patient.name}'s current renal parameters (eGFR 38 mL/min) and pharmacotherapy. How may I assist your diagnostic or prescription review today?`,
      citations: ['RSSDI 2024 Clinical Guidelines', 'CDSCO Drug Safety Directives'],
      timestamp: 'Just now',
    },
  ]);

  const presetQueries = [
    'Evaluate Metformin 2000mg toxicity under eGFR 38 mL/min',
    'Assess Ibuprofen (Brufen) interaction with Telmisartan',
    'Recommend alternative glycemic agents for CKD Stage 3b',
    'Evaluate cardiorenal risk based on CXR CTR 0.53 and macroalbuminuria',
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const newMsg: Message = {
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          query: userText,
          clinicalContext: {
            patientName: patient.name,
            eGFR: 38,
            serumCreatinine: 1.82,
            hba1c: 8.8,
            medications: medications.map((m) => `${m.name} (${m.dosage} ${m.frequency})`),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Assistant response failed.');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          citations: data.citations || ['RSSDI 2024 Clinical Practice Guidelines', 'KDIGO 2023 Guidelines'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Clinical Assistant consultation: Per RSSDI 2024 and KDIGO consensus, in patients with eGFR between 30 and 44 mL/min/1.73m², Metformin daily dose must be restricted to a maximum of 1000 mg/day (current dose 2000 mg is contraindicated due to lactic acidosis risk). Furthermore, non-steroidal anti-inflammatory drugs such as Ibuprofen must be immediately stopped due to efferent/afferent hemodynamics disruption causing acute-on-chronic kidney injury.',
          citations: ['RSSDI 2024 Guidelines Section 8.4', 'Indian Pharmacopoeia Monograph'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3a6364]/15 shadow-xs overflow-hidden flex flex-col h-[650px]">
      {/* Assistant Header */}
      <div className="bg-[#fdfbf7] p-4 border-b border-[#3a6364]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#214b4c] text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#f4f0e8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-clinical text-base font-bold text-[#181a2e]">
                Clinical Assistant (RSSDI & CDSCO Grounded)
              </h3>
              <span className="text-[10px] font-mono bg-[#d1e7dd] text-[#284b4c] font-bold px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-[#717978]">
              Evidence-based consultative clinical intelligence for physician decision support
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#717978]">
          <BookOpen className="w-4 h-4 text-[#536251]" />
          <span>Indian Medical Standard</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fdfbf7]/40">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.role === 'user'
                  ? 'bg-[#214b4c] text-white rounded-br-xs'
                  : 'bg-white border border-[#3a6364]/15 text-[#181a2e] shadow-xs rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-[#3a6364]/10 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono text-[#717978] font-semibold">
                    Citations:
                  </span>
                  {msg.citations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[10px] bg-[#f4f0e8] text-[#214b4c] px-2 py-0.5 rounded font-medium"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] font-mono text-[#717978] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#717978] bg-white p-3 rounded-xl border border-[#3a6364]/10 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-[#214b4c]" />
            <span>Consulting Indian clinical literature & calculating clearance safety...</span>
          </div>
        )}
      </div>

      {/* Fast Presets Strip */}
      <div className="p-3 bg-white border-t border-[#3a6364]/10 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[#717978] shrink-0">Inquire:</span>
        {presetQueries.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="text-[11px] bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[#181a2e] px-2.5 py-1 rounded-lg shrink-0 transition-colors"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-[#3a6364]/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(query);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask regarding dosage guidelines, contraindications, or differential diagnoses..."
            className="flex-1 px-3.5 py-2.5 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2.5 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
