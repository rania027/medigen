import React, { useState } from 'react';
import { UserRole, UserAccount } from '../../types/clinical.ts';
import {
  Stethoscope,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Lock,
  Mail,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface LoginProps {
  selectedRole: UserRole;
  onLoginSuccess: (user: UserAccount, token: string) => void;
  onBackToRoles: () => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({
  selectedRole,
  onLoginSuccess,
  onBackToRoles,
  onGoToRegister,
  onForgotPassword,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone.trim(),
          password,
          requestedPortal: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please verify credentials.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Demo autofill presets
  const handleAutoFill = (presetEmail: string, presetPass: string) => {
    setEmailOrPhone(presetEmail);
    setPassword(presetPass);
    setErrorMessage(null);
  };

  const roleTheme = {
    doctor: {
      color: '#214b4c',
      bgLight: 'bg-[#214b4c]/10',
      text: 'text-[#214b4c]',
      btn: 'bg-[#214b4c] hover:bg-[#3a6364]',
      icon: Stethoscope,
      title: 'Doctor & Clinician Login',
      badge: 'State Medical Council Registry Gated',
    },
    patient: {
      color: '#536251',
      bgLight: 'bg-[#536251]/10',
      text: 'text-[#536251]',
      btn: 'bg-[#536251] hover:bg-[#3d4a3b]',
      icon: User,
      title: 'Patient Health Portal',
      badge: 'UHID / ABDM Linked',
    },
    admin: {
      color: '#4d3d66',
      bgLight: 'bg-[#4d3d66]/10',
      text: 'text-[#4d3d66]',
      btn: 'bg-[#4d3d66] hover:bg-[#392d4c]',
      icon: ShieldCheck,
      title: 'Hospital Governance Admin',
      badge: '2FA & Audit Logging Active',
    },
  }[selectedRole];

  const RoleIcon = roleTheme.icon;

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBackToRoles}
        className="inline-flex items-center gap-1.5 text-xs text-[#717978] hover:text-[#214b4c] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Portal Selection
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#3a6364]/15 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className={`w-12 h-12 rounded-xl ${roleTheme.bgLight} ${roleTheme.text} flex items-center justify-center mx-auto mb-3 shadow-xs`}
          >
            <RoleIcon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f4f0e8] text-[#717978] font-bold">
            {roleTheme.badge}
          </span>
          <h2 className="font-serif-clinical text-2xl font-bold text-[#181a2e] mt-2">
            {roleTheme.title}
          </h2>
          <p className="text-xs text-[#717978] mt-1">
            Sign in to access your secure medical data
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl p-3 text-xs text-[#ba1a1a] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#181a2e] mb-1.5">
              Email Address or Registered Mobile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#717978]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={
                  selectedRole === 'doctor'
                    ? 'dr.varma@medigen.in'
                    : selectedRole === 'patient'
                    ? 'ananya.sharma@gmail.com'
                    : 'admin.governance@medigen.in'
                }
                className="w-full pl-9 pr-3 py-2.5 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] placeholder-[#717978]/60 focus:outline-none focus:border-[#214b4c] focus:ring-1 focus:ring-[#214b4c]"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#181a2e]">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] text-[#214b4c] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#717978]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] placeholder-[#717978]/60 focus:outline-none focus:border-[#214b4c] focus:ring-1 focus:ring-[#214b4c]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#717978] hover:text-[#181a2e]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#3a6364]/30 text-[#214b4c] focus:ring-[#214b4c]"
              />
              <span className="text-[#717978]">Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 ${roleTheme.btn} text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Identity...</span>
              </>
            ) : (
              <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
            )}
          </button>
        </form>

        {/* Demo Fast-Login Presets */}
        <div className="mt-6 pt-5 border-t border-[#3a6364]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#717978] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#214b4c]" />
              Evaluation Demo Accounts
            </span>
            <span className="text-[10px] text-[#717978]">Click to populate</span>
          </div>

          <div className="space-y-1.5">
            {selectedRole === 'doctor' && (
              <>
                <button
                  type="button"
                  onClick={() => handleAutoFill('dr.varma@medigen.in', 'VarmaSecure#2026')}
                  className="w-full text-left p-2 rounded-lg bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[11px] text-[#181a2e] transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">Dr. Rajesh K. Varma (Verified Clinician)</span>
                  <span className="text-[9px] font-mono text-[#284b4c] bg-[#d1e7dd] px-1.5 py-0.5 rounded">
                    KMC Verified
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutoFill('dr.priya@jeevancare.in', 'PriyaNair#2026')}
                  className="w-full text-left p-2 rounded-lg bg-[#fff3cd]/50 hover:bg-[#fff3cd] text-[11px] text-[#664d03] transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">Dr. Priya Nair (Unverified Clinician)</span>
                  <span className="text-[9px] font-mono bg-[#ffe69c] text-[#664d03] px-1.5 py-0.5 rounded">
                    Test Gate Screen
                  </span>
                </button>
              </>
            )}

            {selectedRole === 'patient' && (
              <button
                type="button"
                onClick={() => handleAutoFill('ananya.sharma@gmail.com', 'PatientPass#2026')}
                className="w-full text-left p-2 rounded-lg bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[11px] text-[#181a2e] transition-colors flex items-center justify-between"
              >
                <span className="font-medium">Ananya Sharma (Diabetic Nephropathy)</span>
                <span className="text-[9px] font-mono text-[#536251] bg-[#d1e7dd] px-1.5 py-0.5 rounded">
                  UHID-KA-934812
                </span>
              </button>
            )}

            {selectedRole === 'admin' && (
              <button
                type="button"
                onClick={() => handleAutoFill('admin.governance@medigen.in', 'AdminMaster#2026')}
                className="w-full text-left p-2 rounded-lg bg-[#f4f0e8] hover:bg-[#e8e2d5] text-[11px] text-[#181a2e] transition-colors flex items-center justify-between"
              >
                <span className="font-medium">Admin Governance (Aarogya Hospital)</span>
                <span className="text-[9px] font-mono text-[#4d3d66] bg-[#e2d9f3] px-1.5 py-0.5 rounded">
                  Full Authority
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Registration link */}
        <div className="mt-5 text-center text-xs text-[#717978]">
          Don't have an account?{' '}
          <button
            onClick={onGoToRegister}
            className="text-[#214b4c] font-semibold hover:underline"
          >
            Register new {selectedRole} account
          </button>
        </div>
      </div>
    </div>
  );
};
