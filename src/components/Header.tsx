import React from 'react';
import { UserRole, DoctorVerificationStatus } from '../types/clinical.ts';
import { Shield, CheckCircle2, Clock, AlertTriangle, LogOut, Activity } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  userName: string;
  verificationStatus?: DoctorVerificationStatus;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  userName,
  verificationStatus,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#3a6364]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#214b4c] text-white flex items-center justify-center shadow-xs">
            <Activity className="w-5 h-5 text-[#f4f0e8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg tracking-wider font-bold text-[#214b4c]">
                MEDIGEN
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#3a6364]/10 text-[#3a6364] font-semibold">
                CDSS v3.8
              </span>
            </div>
            <p className="text-[11px] text-[#717978] leading-tight">
              Clinical Diagnostic & Multimodal Decision Intelligence
            </p>
          </div>
        </div>

        {/* Authenticated User Status Strip */}
        <div className="flex items-center gap-3">
          {/* Strict Role Indicator: Static trusted badge from backend, NOT a selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#3a6364]/15 shadow-xs">
            <Shield className="w-4 h-4 text-[#214b4c]" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#717978] font-medium leading-none">
                Authenticated As
              </span>
              <span className="text-xs font-bold text-[#181a2e] capitalize leading-tight">
                {currentRole === 'doctor'
                  ? 'Doctor / Clinician'
                  : currentRole === 'patient'
                  ? 'Patient Account'
                  : 'System Administrator'}
              </span>
            </div>

            {/* Doctor Verification Badge */}
            {currentRole === 'doctor' && (
              <span className="ml-1">
                {verificationStatus === 'verified' ? (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] bg-[#d1e7dd] text-[#284b4c] font-semibold px-2 py-0.5 rounded-full"
                    title="Credentials verified by Administrator"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                ) : verificationStatus === 'pending' || verificationStatus === 'under_review' ? (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] bg-[#fff3cd] text-[#664d03] font-semibold px-2 py-0.5 rounded-full"
                    title="Verification is pending admin review"
                  >
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] bg-[#f8d7da] text-[#842029] font-semibold px-2 py-0.5 rounded-full"
                    title="Action required on credentials"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Action Needed
                  </span>
                )}
              </span>
            )}
          </div>

          {/* User profile & Sign out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#3a6364]/15">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-[#181a2e] leading-tight">
                {userName}
              </div>
              <div className="text-[10px] text-[#717978] font-mono leading-tight">
                IST (Asia/Kolkata)
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-[#717978] hover:text-[#ba1a1a] hover:bg-white rounded-lg border border-transparent hover:border-[#ba1a1a]/20 transition-all"
              title="Secure Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
