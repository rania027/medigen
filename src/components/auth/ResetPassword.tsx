import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResetPasswordProps {
  email: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  email,
  onSuccess,
  onBackToLogin,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setDone(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <button
        onClick={onBackToLogin}
        className="inline-flex items-center gap-1.5 text-xs text-[#717978] hover:text-[#214b4c] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </button>

      <div className="bg-white rounded-2xl border border-[#3a6364]/15 shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#214b4c]/10 text-[#214b4c] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif-clinical text-2xl font-bold text-[#181a2e]">
            Set New Password
          </h2>
          <p className="text-xs text-[#717978] mt-1">
            Updating password for <strong className="text-[#214b4c]">{email}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {done ? (
          <div className="bg-[#d1e7dd] text-[#284b4c] p-4 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <strong>Password Updated Successfully!</strong> Redirecting you to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181a2e] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#3a6364]/20 rounded-xl text-xs text-[#181a2e] focus:outline-none focus:border-[#214b4c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#214b4c] hover:bg-[#3a6364] text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
