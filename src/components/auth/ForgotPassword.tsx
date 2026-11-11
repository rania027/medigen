import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onProceedToReset: (email: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBackToLogin,
  onProceedToReset,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide your registered medical or patient email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <button
        onClick={onBackToLogin}
        className="inline-flex items-center gap-1.5 text-xs text-[#717978] hover:text-[#214b4c] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sign In
      </button>

      <div className="bg-white rounded-2xl border border-[#3a6364]/15 shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#214b4c]/10 text-[#214b4c] flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-serif-clinical text-2xl font-bold text-[#181a2e]">
            Account Recovery
          </h2>
          <p className="text-xs text-[#717978] mt-1">
            Reset credentials for your MEDIGEN account
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-[#d1e7dd] text-[#284b4c] p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Password Reset Request Initiated
              </div>
              <p>
                A verification link has been authorized for <strong>{email}</strong>.
              </p>
            </div>

            {/* Honest Notice */}
            <div className="bg-[#fff3cd] border border-[#ffe69c] rounded-xl p-3 text-xs text-[#664d03] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Notice regarding SMS / Email Gateway:</strong> External SMTP email relay is not configured in this demo sandbox environment. You may proceed immediately with resetting your credentials below.
              </div>
            </div>

            <button
              onClick={() => onProceedToReset(email)}
              className="w-full py-2.5 px-4 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all"
            >
              Set New Password Directly
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#181a2e] mb-1.5">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.varma@medigen.in or patient@example.in"
                className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Validating Account...' : 'Send Password Reset Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
