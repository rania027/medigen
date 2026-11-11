import React, { useState, useEffect } from 'react';
import { AuditLog, UserAccount } from '../types/clinical.ts';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  KeyRound,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface AdminPanelProps {
  auditLogs: AuditLog[];
  authToken?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ auditLogs, authToken }) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'invitations' | 'audit'>('verification');
  const [doctors, setDoctors] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New invitation state
  const [newTokenOrg, setNewTokenOrg] = useState('CityCare Health Network');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [invitationsList, setInvitationsList] = useState<any[]>([
    {
      token: 'INVITE-AAROGYA-2026',
      organization: 'Aarogya Healthcare Trust',
      createdBy: 'admin.governance@medigen.in',
      createdAt: '11-11-2026 12:00 IST',
      used: false,
    },
  ]);

  const fetchDoctors = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/doctors', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [authToken]);

  const handleVerifyDoctor = async (
    doctorEmail: string,
    status: 'verified' | 'rejected' | 'additional_documents_required',
    notes: string
  ) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/doctors/${encodeURIComponent(doctorEmail)}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Updated status for ${doctorEmail} to: ${status.toUpperCase()}`);
        fetchDoctors();
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ organization: newTokenOrg }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedToken(data.token);
        setInvitationsList((prev) => [data.invitation, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#4d3d66]/20 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#4d3d66]/10 text-[#4d3d66] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-clinical text-xl font-bold text-[#181a2e]">
                Hospital Governance & Identity Administration
              </h1>
              <span className="text-[10px] font-mono bg-[#4d3d66] text-white px-2 py-0.5 rounded-full font-bold">
                Level-4 Security
              </span>
            </div>
            <p className="text-xs text-[#717978]">
              Verify State Medical Council registrations, control clinical privileges, and review audit trails
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[#f4f0e8] p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-white text-[#4d3d66] shadow-xs'
                : 'text-[#717978] hover:text-[#181a2e]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Doctor Credentials ({doctors.filter((d) => d.verificationStatus !== 'verified').length} pending)
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'invitations'
                ? 'bg-white text-[#4d3d66] shadow-xs'
                : 'text-[#717978] hover:text-[#181a2e]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Admin Tokens
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-white text-[#4d3d66] shadow-xs'
                : 'text-[#717978] hover:text-[#181a2e]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Audit Logs
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-[#d1e7dd] border border-[#284b4c]/30 p-3 rounded-xl text-xs text-[#284b4c] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* DOCTOR CREDENTIAL VERIFICATION TAB */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#181a2e]">
                Medical Council Credential Approval Queue
              </h2>
              <p className="text-xs text-[#717978]">
                Every clinician must be validated against State Medical Council or National Medical Commission records before gaining EHR access.
              </p>
            </div>
            <button
              onClick={fetchDoctors}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[#181a2e] rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Queue
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {doctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#3a6364]/10 p-8 text-center text-xs text-[#717978]">
                No doctors registered currently.
              </div>
            ) : (
              doctors.map((doc) => {
                const isVerified = doc.verificationStatus === 'verified';
                const isPending = doc.verificationStatus === 'pending' || doc.verificationStatus === 'under_review';

                return (
                  <div
                    key={doc.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                      isVerified
                        ? 'border-[#3a6364]/15'
                        : 'border-[#ffc107]/50 ring-1 ring-[#ffc107]/30'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Clinician details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif-clinical text-lg font-bold text-[#181a2e]">
                            {doc.name}
                          </h3>
                          <span className="text-xs text-[#717978]">({doc.qualificationDetails || 'MBBS, MD'})</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                              isVerified
                                ? 'bg-[#d1e7dd] text-[#284b4c]'
                                : doc.verificationStatus === 'rejected'
                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                : 'bg-[#fff3cd] text-[#664d03]'
                            }`}
                          >
                            {(doc.verificationStatus || 'pending').replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-[#717978]">
                          <div>
                            <span className="font-semibold text-[#181a2e]">Specialization:</span>{' '}
                            {doc.medicalSpecialization}
                          </div>
                          <div>
                            <span className="font-semibold text-[#181a2e]">Council:</span>{' '}
                            {doc.stateMedicalCouncil}
                          </div>
                          <div>
                            <span className="font-semibold text-[#181a2e]">Registration #:</span>{' '}
                            <span className="font-mono font-bold text-[#214b4c]">{doc.registrationNumber}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#181a2e]">Affiliation:</span>{' '}
                            {doc.hospitalAffiliation}
                          </div>
                          <div>
                            <span className="font-semibold text-[#181a2e]">Email:</span> {doc.email}
                          </div>
                          <div>
                            <span className="font-semibold text-[#181a2e]">Phone:</span> {doc.phone || 'N/A'}
                          </div>
                        </div>

                        {doc.verificationNotes && (
                          <div className="text-xs bg-[#f4f0e8] p-2 rounded-lg text-[#181a2e]">
                            <span className="font-semibold">Reviewer Notes:</span> {doc.verificationNotes}
                          </div>
                        )}
                      </div>

                      {/* Right: Administrative Decision Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                        {!isVerified && (
                          <button
                            onClick={() =>
                              handleVerifyDoctor(
                                doc.email,
                                'verified',
                                'Validated against State Medical Council official registry records.'
                              )
                            }
                            className="w-full sm:w-auto py-2 px-3.5 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#a3cfbb]" />
                            <span>Approve & Grant EHR Access</span>
                          </button>
                        )}

                        {isPending && (
                          <>
                            <button
                              onClick={() =>
                                handleVerifyDoctor(
                                  doc.email,
                                  'additional_documents_required',
                                  'Please upload updated degree certificate or registration renewal.'
                                )
                              }
                              className="w-full sm:w-auto py-2 px-3 border border-[#3a6364]/20 hover:bg-[#f4f0e8] text-[#181a2e] rounded-xl text-xs font-medium transition-all"
                            >
                              Request Documents
                            </button>

                            <button
                              onClick={() =>
                                handleVerifyDoctor(
                                  doc.email,
                                  'rejected',
                                  'Registration number does not correspond with State Medical Council database.'
                                )
                              }
                              className="w-full sm:w-auto py-2 px-3 border border-[#ba1a1a]/30 hover:bg-[#ffdad6]/30 text-[#ba1a1a] rounded-xl text-xs font-medium transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isVerified && (
                          <span className="text-xs text-[#284b4c] font-semibold flex items-center gap-1 bg-[#d1e7dd] px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" /> Full Privileges Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ADMIN INVITATION MANAGEMENT TAB */}
      {activeTab === 'invitations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#3a6364]/10 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#181a2e] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#4d3d66]" />
              Generate Admin Invitation
            </h2>
            <p className="text-xs text-[#717978]">
              Administrators cannot self-register without an authorized cryptographic invitation token issued by hospital governance.
            </p>

            <form onSubmit={handleCreateInvitation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                  Healthcare Facility / Trust
                </label>
                <input
                  type="text"
                  required
                  value={newTokenOrg}
                  onChange={(e) => setNewTokenOrg(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#4d3d66]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#4d3d66] hover:bg-[#392d4c] text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                Issue Single-Use Token
              </button>
            </form>

            {generatedToken && (
              <div className="p-3 bg-[#e2d9f3] rounded-xl border border-[#4d3d66]/30 space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#4d3d66] font-bold">
                  Generated Token:
                </span>
                <p className="font-mono font-bold text-xs text-[#181a2e] select-all">
                  {generatedToken}
                </p>
                <p className="text-[10px] text-[#4d3d66]">
                  Share securely with the authorized institutional admin.
                </p>
              </div>
            )}
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-[#3a6364]/10 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#181a2e]">
              Active & Historic Invitation Tokens
            </h2>

            <div className="space-y-2">
              {invitationsList.map((inv, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#fdfbf7] border border-[#3a6364]/10 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#4d3d66]">{inv.token}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          inv.used ? 'bg-[#f4f0e8] text-[#717978]' : 'bg-[#d1e7dd] text-[#284b4c]'
                        }`}
                      >
                        {inv.used ? 'USED' : 'ACTIVE'}
                      </span>
                    </div>
                    <p className="text-[#717978] text-[11px]">
                      Org: {inv.organization} · Issued by {inv.createdBy}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#717978]">{inv.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECURITY AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#3a6364]/10 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#181a2e]">
                System Security & Access Audit Trail
              </h2>
              <p className="text-xs text-[#717978]">
                Immutable chronological log of authentication events, credential reviews, and cross-portal access blocks.
              </p>
            </div>
            <span className="text-xs font-mono text-[#717978]">Timezone: Asia/Kolkata (IST)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f0e8] text-[#717978] font-semibold border-b border-[#3a6364]/10">
                <tr>
                  <th className="py-2.5 px-3">IST Timestamp</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a6364]/10">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fdfbf7]">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#717978] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#181a2e]">{log.actorName}</div>
                      <span className="text-[10px] font-mono uppercase text-[#717978]">{log.actorRole}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f4f0e8] text-[#214b4c]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#181a2e]">{log.target}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#717978] whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                    <td className="py-2.5 px-3 text-[#717978] max-w-xs">{log.details}</td>
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
