import React from 'react';
import { UserRole } from '../../types/clinical.ts';
import { Stethoscope, User, ShieldCheck, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onGoToRegister: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectRole,
  onGoToRegister,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Brand header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6364]/10 border border-[#3a6364]/20 text-[#214b4c] text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Certified Healthcare Portal Access
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#214b4c] tracking-tight">
          MEDIGEN
        </h1>
        <p className="font-serif-clinical text-lg text-[#181a2e]/80 italic mt-1">
          Intelligent Multimodal Medical Diagnosis & Clinical Decision Support
        </p>
        <p className="text-xs text-[#717978] max-w-lg mx-auto mt-2">
          Strict identity-gated access with permanent role isolation. Choose your authorized portal to authenticate.
        </p>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DOCTOR GATEWAY */}
        <div className="bg-white rounded-2xl border-2 border-[#3a6364]/20 hover:border-[#214b4c] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#214b4c]/10 text-[#214b4c] flex items-center justify-center mb-4 group-hover:bg-[#214b4c] group-hover:text-white transition-colors">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#d1e7dd] text-[#284b4c] font-bold">
              Licensed Clinicians
            </span>
            <h2 className="font-serif-clinical text-xl font-bold text-[#181a2e] mt-2">
              Doctor Workspace
            </h2>
            <p className="text-xs text-[#717978] mt-2 leading-relaxed">
              Full diagnostic synthesis, Gemini 3.8 Flash lab & Rx extraction, RSSDI guidelines, and imaging risk assessment.
            </p>

            <div className="mt-4 pt-3 border-t border-[#3a6364]/10 text-[11px] text-[#214b4c] flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-[#536251]" />
              Requires State Medical Council verification
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => onSelectRole('doctor')}
              className="w-full py-2.5 px-4 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Doctor Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onGoToRegister('doctor')}
              className="w-full py-2 px-3 border border-[#3a6364]/20 hover:border-[#3a6364] text-[#214b4c] rounded-xl text-xs font-medium transition-all"
            >
              Register as Doctor
            </button>
          </div>
        </div>

        {/* PATIENT GATEWAY */}
        <div className="bg-white rounded-2xl border-2 border-[#536251]/20 hover:border-[#536251] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#536251]/10 text-[#536251] flex items-center justify-center mb-4 group-hover:bg-[#536251] group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f4f0e8] text-[#536251] font-bold">
              Patients & Caregivers
            </span>
            <h2 className="font-serif-clinical text-xl font-bold text-[#181a2e] mt-2">
              Patient Portal
            </h2>
            <p className="text-xs text-[#717978] mt-2 leading-relaxed">
              Multilingual health summaries in English, Hindi (हिंदी) & Kannada (ಕನ್ನಡ), lab timeline, and emergency hotline 112.
            </p>

            <div className="mt-4 pt-3 border-t border-[#3a6364]/10 text-[11px] text-[#536251] flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-[#536251]" />
              UHID & ABHA health record synchronization
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => onSelectRole('patient')}
              className="w-full py-2.5 px-4 bg-[#536251] hover:bg-[#3d4a3b] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Patient Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onGoToRegister('patient')}
              className="w-full py-2 px-3 border border-[#536251]/20 hover:border-[#536251] text-[#536251] rounded-xl text-xs font-medium transition-all"
            >
              Create Patient Account
            </button>
          </div>
        </div>

        {/* ADMINISTRATOR GATEWAY */}
        <div className="bg-white rounded-2xl border-2 border-[#4d3d66]/20 hover:border-[#4d3d66] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#4d3d66]/10 text-[#4d3d66] flex items-center justify-center mb-4 group-hover:bg-[#4d3d66] group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f4f0e8] text-[#4d3d66] font-bold">
              Hospital Governance
            </span>
            <h2 className="font-serif-clinical text-xl font-bold text-[#181a2e] mt-2">
              Administrator Panel
            </h2>
            <p className="text-xs text-[#717978] mt-2 leading-relaxed">
              Verify doctor State Medical Council registrations, approve credentials, inspect IST security audit logs, and issue invitation tokens.
            </p>

            <div className="mt-4 pt-3 border-t border-[#3a6364]/10 text-[11px] text-[#4d3d66] flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-[#4d3d66]" />
              Authorized invitations & 2FA mandatory
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => onSelectRole('admin')}
              className="w-full py-2.5 px-4 bg-[#4d3d66] hover:bg-[#392d4c] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Administrator Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onGoToRegister('admin')}
              className="w-full py-2 px-3 border border-[#4d3d66]/20 hover:border-[#4d3d66] text-[#4d3d66] rounded-xl text-xs font-medium transition-all"
            >
              Invited Admin Register
            </button>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="mt-8 bg-[#fff3cd]/60 border border-[#ffe69c] rounded-xl p-3 text-center text-xs text-[#664d03]">
        <strong>Role-Based Access Enforcement:</strong> Credentials are verified against backend authority records. Selecting a portal does not grant unauthorized role escalation. Cross-portal requests are automatically rejected.
      </div>
    </div>
  );
};
