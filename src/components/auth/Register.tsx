import React, { useState } from 'react';
import { UserRole, UserAccount } from '../../types/clinical.ts';
import {
  Stethoscope,
  User,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2,
  Lock,
  Mail,
  Phone,
  Building2,
  Award,
} from 'lucide-react';

interface RegisterProps {
  initialRole: UserRole;
  onRegistered: (user: UserAccount, token: string) => void;
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  initialRole,
  onRegistered,
  onBackToLogin,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Doctor fields
  const [specialization, setSpecialization] = useState('Internal Medicine & Diabetology');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [stateMedicalCouncil, setStateMedicalCouncil] = useState('Karnataka Medical Council (KMC)');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('Aarogya Multispeciality Hospital, Bengaluru');
  const [qualificationDetails, setQualificationDetails] = useState('MBBS, MD (General Medicine)');
  const [docFileUploaded, setDocFileUploaded] = useState(false);

  // Patient fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Admin fields
  const [adminToken, setAdminToken] = useState('');
  const [adminOrg, setAdminOrg] = useState('Aarogya Healthcare Trust');

  const indianMedicalCouncils = [
    'Karnataka Medical Council (KMC)',
    'Maharashtra Medical Council (MMC)',
    'Tamil Nadu Medical Council (TNMC)',
    'Delhi Medical Council (DMC)',
    'Travancore Cochin Medical Council (TCMC)',
    'Telangana State Medical Council (TSMC)',
    'National Medical Commission (NMC / MCI)',
    'West Bengal Medical Council (WBMC)',
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (role === 'patient' && !consentAccepted) {
      setError('Please accept the informed medical data consent.');
      return;
    }

    if (role === 'admin' && !adminToken.trim()) {
      setError('An authorized administrator invitation token is mandatory.');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '/api/auth/register/patient';
      let payload: any = {
        name,
        email,
        phone,
        password,
        dateOfBirth,
        emergencyContact,
      };

      if (role === 'doctor') {
        endpoint = '/api/auth/register/doctor';
        payload = {
          name,
          email,
          phone,
          password,
          medicalSpecialization: specialization,
          registrationNumber: registrationNumber || 'KMC-' + Math.floor(10000 + Math.random() * 90000) + '-2026',
          stateMedicalCouncil,
          hospitalAffiliation,
          qualificationDetails,
          supportingDocumentUrl: docFileUploaded
            ? 'https://medigen.internal/docs/credentials_verified.pdf'
            : 'document_attached_pending_upload.pdf',
        };
      } else if (role === 'admin') {
        endpoint = '/api/auth/register/admin';
        payload = {
          name,
          email,
          phone,
          password,
          organization: adminOrg,
          invitationToken: adminToken.trim(),
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      if (role === 'doctor' && data.user?.verificationStatus === 'pending') {
        setSuccessInfo(
          'Registration received! Your State Medical Council credentials have been queued for administrative review. You can now proceed to login to view your pending verification status.'
        );
      }

      onRegistered(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto px-4 py-8">
      {/* Back to login */}
      <button
        onClick={onBackToLogin}
        className="inline-flex items-center gap-1.5 text-xs text-[#717978] hover:text-[#214b4c] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </button>

      <div className="bg-white rounded-2xl border border-[#3a6364]/15 shadow-sm p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-serif-clinical text-2xl font-bold text-[#181a2e]">
            Create MEDIGEN Account
          </h2>
          <p className="text-xs text-[#717978] mt-1">
            Permanent identity and role-governed healthcare platform
          </p>
        </div>

        {/* Role toggle tabs */}
        <div className="grid grid-cols-3 gap-2 bg-[#f4f0e8] p-1.5 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'doctor'
                ? 'bg-white text-[#214b4c] shadow-xs'
                : 'text-[#717978] hover:text-[#181a2e]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Doctor
          </button>
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'patient'
                ? 'bg-white text-[#536251] shadow-xs'
                : 'text-[#717978] hover:text-[#181a2e]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-white text-[#4d3d66] shadow-xs'
                : 'text-[#717978] hover:text-[#181a2e]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Feedback notices */}
        {error && (
          <div className="mb-5 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl p-3 text-xs text-[#ba1a1a] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div className="mb-5 bg-[#d1e7dd] border border-[#284b4c]/30 rounded-xl p-3 text-xs text-[#284b4c] flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Common Fields */}
          <div>
            <label className="block text-xs font-semibold text-[#181a2e] mb-1">
              {role === 'doctor' ? 'Full Name with Title (e.g. Dr. Rajesh K. Varma)' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'doctor' ? 'Dr. Anita Desai' : 'Arun Kumar'}
              className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                Professional / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#717978] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.in"
                  className="w-full pl-9 pr-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                Mobile Number (+91)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#717978] absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181a2e] mb-1">
              Secure Password (minimum 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#717978] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
              />
            </div>
          </div>

          {/* DOCTOR-SPECIFIC CREDENTIALS */}
          {role === 'doctor' && (
            <div className="pt-3 border-t border-[#3a6364]/10 space-y-3">
              <div className="text-xs font-bold text-[#214b4c] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Medical Council & Hospital Credentials (Mandatory for Clinical Access)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                    Medical Specialization
                  </label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Diabetology & Endocrinology"
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                    State Council Registration #
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. KMC-72941-2015"
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                    State Medical Council
                  </label>
                  <select
                    value={stateMedicalCouncil}
                    onChange={(e) => setStateMedicalCouncil(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                  >
                    {indianMedicalCouncils.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                    Hospital / Clinical Affiliation
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-[#717978] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={hospitalAffiliation}
                      onChange={(e) => setHospitalAffiliation(e.target.value)}
                      placeholder="e.g. Aarogya Multispeciality Hospital"
                      className="w-full pl-9 pr-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                  Professional Qualification Details
                </label>
                <input
                  type="text"
                  required
                  value={qualificationDetails}
                  onChange={(e) => setQualificationDetails(e.target.value)}
                  placeholder="e.g. MBBS (CMC Vellore), MD (AIIMS New Delhi)"
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                  Supporting Professional Document (Council Registration Certificate)
                </label>
                <div
                  onClick={() => setDocFileUploaded(!docFileUploaded)}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-3 text-center transition-all ${
                    docFileUploaded
                      ? 'border-[#284b4c] bg-[#d1e7dd]/30 text-[#284b4c]'
                      : 'border-[#3a6364]/30 hover:border-[#214b4c] bg-[#fdfbf7] text-[#717978]'
                  }`}
                >
                  <Upload className="w-5 h-5 mx-auto mb-1 text-[#214b4c]" />
                  <span className="text-xs font-semibold">
                    {docFileUploaded
                      ? 'Document Attached: Medical_Registration_Cert.pdf (Click to change)'
                      : 'Click to simulate uploading Medical Council Certificate (PDF/PNG)'}
                  </span>
                  <p className="text-[10px] text-[#717978]">
                    {docFileUploaded ? 'Verified file format' : 'Max 10MB; will be reviewed by Hospital Administrator'}
                  </p>
                </div>
              </div>

              <div className="bg-[#fff3cd] border border-[#ffe69c] rounded-xl p-2.5 text-[11px] text-[#664d03]">
                <strong>Notice:</strong> Following registration, doctor accounts are placed in <em>"Pending Verification"</em> status until authenticated by hospital administration. Clinical patient charts remain gated until approval.
              </div>
            </div>
          )}

          {/* PATIENT-SPECIFIC FIELDS */}
          {role === 'patient' && (
            <div className="pt-3 border-t border-[#3a6364]/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                    Date of Birth (DD-MM-YYYY)
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#536251]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                    Emergency Contact (Relative Phone)
                  </label>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#536251]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="rounded border-[#3a6364]/30 text-[#536251] focus:ring-[#536251] mt-0.5"
                />
                <span className="text-[11px] text-[#717978]">
                  I consent to the processing of clinical diagnostics and health data under the Digital Personal Data Protection (DPDP) Act of India and ABDM health record protocols.
                </span>
              </label>
            </div>
          )}

          {/* ADMIN-SPECIFIC FIELDS */}
          {role === 'admin' && (
            <div className="pt-3 border-t border-[#3a6364]/10 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                  Authorized Admin Invitation Token (Required)
                </label>
                <input
                  type="text"
                  required
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="e.g. INVITE-AAROGYA-2026"
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#4d3d66]/30 rounded-xl text-xs text-[#181a2e] font-mono focus:outline-none focus:border-[#4d3d66]"
                />
                <p className="text-[10px] text-[#717978] mt-1">
                  Demo invitation token available: <code className="bg-[#f4f0e8] px-1 py-0.5 rounded font-mono text-[#4d3d66]">INVITE-AAROGYA-2026</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                  Healthcare Governance Organization
                </label>
                <input
                  type="text"
                  required
                  value={adminOrg}
                  onChange={(e) => setAdminOrg(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#4d3d66]/30 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#4d3d66]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 ${
              role === 'doctor'
                ? 'bg-[#214b4c] hover:bg-[#3a6364]'
                : role === 'patient'
                ? 'bg-[#536251] hover:bg-[#3d4a3b]'
                : 'bg-[#4d3d66] hover:bg-[#392d4c]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Registration...</span>
              </>
            ) : (
              <span>Complete {role.toUpperCase()} Registration</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#717978]">
          Already have an account?{' '}
          <button
            onClick={onBackToLogin}
            className="text-[#214b4c] font-semibold hover:underline"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
};
