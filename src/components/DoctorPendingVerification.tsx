import React from 'react';
import { UserAccount } from '../types/clinical.ts';
import {
  Clock,
  ShieldAlert,
  FileText,
  Building2,
  Phone,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface DoctorPendingVerificationProps {
  doctor: UserAccount;
  onLogout: () => void;
  onRefresh: () => void;
}

export const DoctorPendingVerification: React.FC<DoctorPendingVerificationProps> = ({
  doctor,
  onLogout,
  onRefresh,
}) => {
  const statusConfig = {
    pending: {
      title: 'State Medical Council Verification Pending',
      color: 'bg-[#fff3cd] text-[#664d03] border-[#ffe69c]',
      badgeColor: 'bg-[#ffe69c] text-[#664d03]',
      icon: Clock,
      message:
        'Your medical credentials have been submitted and are in the verification queue. In compliance with National Medical Commission (NMC) regulations, access to patient medical records is gated until hospital administrators verify your State Medical Council registration.',
    },
    under_review: {
      title: 'Credential Inspection Under Active Review',
      color: 'bg-[#cfe2ff] text-[#084298] border-[#b6d4fe]',
      badgeColor: 'bg-[#b6d4fe] text-[#084298]',
      icon: Clock,
      message:
        'An authorized hospital administrator is actively validating your registration against the State Medical Council registry.',
    },
    rejected: {
      title: 'Verification Request Declined',
      color: 'bg-[#f8d7da] text-[#842029] border-[#f5c2c7]',
      badgeColor: 'bg-[#f5c2c7] text-[#842029]',
      icon: AlertTriangle,
      message:
        doctor.verificationNotes ||
        'The submitted credentials could not be validated against the official State Medical Council records. Please contact hospital medical administration.',
    },
    additional_documents_required: {
      title: 'Additional Documentation Required',
      color: 'bg-[#fff3cd] text-[#664d03] border-[#ffe69c]',
      badgeColor: 'bg-[#ffe69c] text-[#664d03]',
      icon: AlertTriangle,
      message:
        doctor.verificationNotes ||
        'The verification committee requires an updated certificate or NOC from your institutional head. Please submit supporting documents.',
    },
    verified: {
      title: 'Credentials Verified',
      color: 'bg-[#d1e7dd] text-[#0f5132] border-[#badbcc]',
      badgeColor: 'bg-[#badbcc] text-[#0f5132]',
      icon: Clock,
      message: 'Your account is verified. You now have full clinical access.',
    },
  }[doctor.verificationStatus || 'pending'];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Status Header Banner */}
        <div className={`p-4 rounded-xl border ${statusConfig.color} flex items-start gap-3`}>
          <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold">{statusConfig.title}</h2>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${statusConfig.badgeColor}`}>
                {(doctor.verificationStatus || 'pending').replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs leading-relaxed">{statusConfig.message}</p>
          </div>
        </div>

        {/* Doctor Credential Profile Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#3a6364]/10 pb-2">
            <span className="text-xs font-semibold text-[#181a2e] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#214b4c]" />
              Submitted Clinical Profile
            </span>
            <span className="text-[11px] font-mono text-[#717978]">
              Submitted: {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-GB') : 'Today'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#3a6364]/10">
              <span className="text-[10px] uppercase font-mono text-[#717978]">Doctor Name</span>
              <p className="font-bold text-[#181a2e] mt-0.5">{doctor.name}</p>
              <p className="text-[#717978] text-[11px]">{doctor.qualificationDetails || 'MBBS, MD'}</p>
            </div>

            <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#3a6364]/10">
              <span className="text-[10px] uppercase font-mono text-[#717978]">Specialization</span>
              <p className="font-bold text-[#181a2e] mt-0.5">{doctor.medicalSpecialization || 'Clinical Specialist'}</p>
              <p className="text-[#717978] text-[11px]">{doctor.hospitalAffiliation || 'Aarogya Hospital'}</p>
            </div>

            <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#3a6364]/10">
              <span className="text-[10px] uppercase font-mono text-[#717978]">Medical Registration Number</span>
              <p className="font-bold font-mono text-[#214b4c] mt-0.5">{doctor.registrationNumber}</p>
              <p className="text-[#717978] text-[11px]">{doctor.stateMedicalCouncil}</p>
            </div>

            <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#3a6364]/10">
              <span className="text-[10px] uppercase font-mono text-[#717978]">Registered Email & Phone</span>
              <p className="font-bold text-[#181a2e] mt-0.5">{doctor.email}</p>
              <p className="text-[#717978] text-[11px]">{doctor.phone || '+91 Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Clinical Data Quarantine notice */}
        <div className="bg-[#f4f0e8] rounded-xl p-4 text-xs space-y-2 border border-[#3a6364]/10">
          <div className="flex items-center gap-2 font-semibold text-[#214b4c]">
            <ShieldAlert className="w-4 h-4" />
            Protected Health Information (PHI) Quarantined
          </div>
          <p className="text-[#717978] leading-relaxed">
            Patient EHRs, pathology lab results, and medication ordering systems are strictly inaccessible while your account status is unverified. This security protocol prevents unauthorized clinician access in compliance with CDSCO and ABDM standards.
          </p>
        </div>

        {/* Hospital Contact Info */}
        <div className="flex items-center justify-between text-xs text-[#717978] pt-2 border-t border-[#3a6364]/10">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#214b4c]" />
            <span>Aarogya Healthcare Governance Committee</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Phone className="w-3.5 h-3.5" />
            <span>Desk: 080-4921-8800 (Ext 402)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onRefresh}
            className="w-full sm:flex-1 py-2.5 px-4 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Approval Status (Refresh)</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full sm:w-auto py-2.5 px-5 border border-[#ba1a1a]/30 hover:bg-[#ffdad6]/20 text-[#ba1a1a] rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
