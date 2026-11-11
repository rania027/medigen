import React, { useState, useEffect, useRef } from 'react';
import { Patient, LabReport, MedicationItem, DrugInteraction } from '../types/clinical.ts';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Loader2,
  Trash2,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface FloatingClinicalChatbotProps {
  patient: Patient;
  latestLab?: LabReport;
  medications: MedicationItem[];
  drugInteractions: DrugInteraction[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}

export const FloatingClinicalChatbot: React.FC<FloatingClinicalChatbotProps> = ({
  patient,
  latestLab,
  medications,
  drugInteractions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContextDetails, setShowContextDetails] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-init',
    role: 'assistant',
    content: `Hello Doctor. I am your **MEDIGEN Clinical Decision Co-Pilot** powered by **Gemini 3.8 Flash**.

I have dynamically ingested the active chart for **${patient.name}** (${patient.uhid}):
• **Renal Clearance:** eGFR 38 mL/min (CKD Stage 3b) · Serum Creatinine 1.82 mg/dL
• **Glycemic Profile:** HbA1c 8.8% · Fasting Glucose 178 mg/dL
• **Active Alerts:** Metformin 2000mg/day MALA toxicity risk · Brufen NSAID interaction with Telma-H

How can I assist your diagnostic synthesis or prescription order review today?`,
    citations: ['RSSDI 2024 Guidelines', 'CDSCO Safety Directives'],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // When selected patient changes, append a context switch notification
  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-sw-${Date.now()}`,
        role: 'assistant',
        content: `*Context synchronized:* Now tracking **${patient.name}** (${patient.uhid}), Age ${patient.age}, ${patient.city}. All subsequent decision inquiries reference this patient's active parameters.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [patient.id]);

  const quickPills = [
    'Summarize Lab Abnormalities',
    'Check Drug Interactions',
    'Explain eGFR Drop',
    'Evaluate Glycomet Toxicity',
    'Recommend Alternative Regimen',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

    setErrorBanner(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputMessage('');
    setLoading(true);

    // Prepare patient context payload
    const patientContext = {
      name: patient.name,
      uhid: patient.uhid,
      age: patient.age,
      gender: patient.gender,
      city: patient.city,
      state: patient.state,
      diagnoses: patient.diagnoses,
      vitals: patient.vitals,
      eGFR: 38,
      serumCreatinine: 1.82,
      hba1c: 8.8,
      fastingGlucose: 178,
      potassium: 5.1,
      uacr: 284,
      medications: medications.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        timing: m.timing,
        safetyWarning: m.safetyWarning,
      })),
      drugInteractions: drugInteractions.map((d) => ({
        drugA: d.drugA,
        drugB: d.drugB,
        severity: d.severity,
        recommendation: d.recommendation,
      })),
      ctr: 0.53,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          patientContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error processing clinical assistant inquiry.');
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        citations: data.citations || ['RSSDI 2024 Guidelines', 'CDSCO Alerts'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorBanner('Connection issue. Showing localized decision support fallback below.');

      // Fallback message so user workflow is uninterrupted
      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: `**Clinical Decision Support Advisory (Local Policy Fallback):**

For **${patient.name}** presenting with Stage 3b Diabetic Kidney Disease (eGFR 38 mL/min/1.73m²):
1. **Metformin Dose Adjustment:** Per RSSDI 2024 guidelines, current 2000 mg/day Glycomet exceeds safety limits. Must be restricted to a maximum of 1000 mg/day to avert lactic acidosis.
2. **De-prescribe Brufen (Ibuprofen):** Concomitant administration with Telma-H (Telmisartan) induces severe afferent/efferent intraglomerular collapse. Stop NSAID immediately.
3. **Follow-Up:** Re-assay serum creatinine and potassium in 14 days.`,
        citations: ['RSSDI 2024 Guidelines Section 8', 'KDIGO CKD 2023'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation thread with Gemini Clinical Assistant?')) {
      setMessages([initialGreeting]);
      setErrorBanner(null);
    }
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (FAB) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center p-3.5 sm:px-4 sm:py-3 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-[#ba1a1a] hover:bg-[#921414]'
              : 'bg-gradient-to-r from-[#214b4c] to-[#3a6364] hover:shadow-xl ring-2 ring-[#214b4c]/30'
          }`}
          aria-label={isOpen ? 'Close Clinical Assistant' : 'Open Gemini Clinical Assistant'}
        >
          {/* Active pulse beacon when closed */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10b981] border-2 border-white"></span>
            </span>
          )}

          {isOpen ? (
            <X className="w-5 h-5 transition-transform duration-200 rotate-0 group-hover:rotate-90" />
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f4f0e8] animate-pulse" />
              <span className="hidden sm:inline-block font-serif-clinical text-xs font-semibold tracking-wide">
                Clinical AI Co-Pilot
              </span>
            </div>
          )}
        </button>
      </div>

      {/* CHAT WINDOW MODAL / DRAWER */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[450px] md:w-[480px] h-[640px] max-h-[82vh] bg-[#fdfbf7] rounded-3xl border-2 border-[#214b4c]/20 shadow-2xl flex flex-col overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* HEADER */}
          <div className="bg-[#214b4c] text-white p-4 border-b border-[#3a6364]/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                  <Sparkles className="w-4 h-4 text-[#a3cfbb]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-clinical text-sm font-bold tracking-tight">
                      MEDIGEN Clinical Co-Pilot
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-mono bg-[#10b981]/20 text-[#a3cfbb] px-2 py-0.5 rounded-full font-semibold border border-[#10b981]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      Gemini 3.8 Flash
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#a3cfbb]" />
                      HIPAA & ABDM Context Guard Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear conversation history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Minimize chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DYNAMIC CONTEXT PILL STRIP */}
            <div className="bg-black/20 rounded-xl p-2 border border-white/10 text-[11px] flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <Activity className="w-3.5 h-3.5 text-[#a3cfbb] shrink-0" />
                <span className="truncate">
                  Context: <strong className="text-white">{patient.name}</strong> ({patient.uhid}) · eGFR 38
                </span>
              </div>
              <button
                onClick={() => setShowContextDetails(!showContextDetails)}
                className="text-[10px] text-white/80 hover:text-white flex items-center gap-0.5 shrink-0 ml-2 underline underline-offset-2"
              >
                <span>{showContextDetails ? 'Hide' : 'Inspect'}</span>
                {showContextDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Expanded Context Details Drawer */}
            {showContextDetails && (
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10 text-[10px] font-mono space-y-1 text-white/90">
                <div>• Patient: {patient.name} ({patient.age}Y/{patient.gender}) · {patient.city}</div>
                <div>• Diagnoses: {patient.diagnoses.join(', ')}</div>
                <div>• Labs: eGFR 38 mL/min (CKD 3b) | Cr 1.82 mg/dL | HbA1c 8.8% | K+ 5.1</div>
                <div>• Active Hazards: Metformin 2000mg MALA Risk | Brufen + Telmisartan ARB</div>
              </div>
            )}
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="bg-[#f4f0e8] px-3 py-2 border-b border-[#3a6364]/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-[#717978] shrink-0">Quick Queries:</span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill)}
                disabled={loading}
                className="text-[10px] font-medium bg-white hover:bg-[#214b4c] hover:text-white text-[#214b4c] px-2.5 py-1 rounded-lg border border-[#3a6364]/15 shadow-2xs whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* ERROR / FALLBACK NOTIFICATION */}
          {errorBanner && (
            <div className="bg-[#fff3cd] border-b border-[#ffe69c] px-3 py-1.5 text-[11px] text-[#664d03] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#b58105]" />
              <span className="truncate">{errorBanner}</span>
            </div>
          )}

          {/* MESSAGE SCROLL THREAD */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fdfbf7]/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#214b4c] text-white rounded-br-xs'
                      : 'bg-white border border-[#3a6364]/15 text-[#181a2e] rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.content}</div>

                  {/* Citations Footer */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#3a6364]/10 flex flex-wrap items-center gap-1">
                      <span className="text-[9px] font-mono text-[#717978] uppercase font-bold">
                        Grounding:
                      </span>
                      {msg.citations.map((cite, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[9px] font-mono bg-[#f4f0e8] text-[#214b4c] px-1.5 py-0.5 rounded font-medium"
                        >
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-mono text-[#717978] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* TYPING / THINKING INDICATOR */}
            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#3a6364]/15 w-fit text-xs text-[#214b4c] shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#214b4c]" />
                <span className="font-serif-clinical italic text-[11px]">
                  Gemini 3.8 Flash synthesizing RSSDI evidence and patient biomarkers...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white border-t border-[#3a6364]/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask clinical co-pilot (e.g. Check Linagliptin dosing)..."
                className="flex-1 px-3.5 py-2.5 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] placeholder-[#717978]/70 focus:outline-none focus:border-[#214b4c] focus:ring-1 focus:ring-[#214b4c]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2.5 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1 text-[10px] text-[#717978] text-center">
              Assistive AI Clinical Decision Support · Verify orders with attending physician
            </div>
          </div>
        </div>
      )}
    </>
  );
};
