'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Check,
  X as XIcon,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate the reset token with Convex live query
  const tokenValidation = useQuery(api.passwordReset.validateResetToken, { token });
  const resetPasswordMutation = useMutation(api.passwordReset.resetPasswordWithToken);

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  let strengthScore = 0;
  if (hasMinLength) strengthScore += 1;
  if (hasUpperCase && hasLowerCase) strengthScore += 1;
  if (hasNumber) strengthScore += 1;
  if (hasSpecial) strengthScore += 1;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-red-500';
  let strengthText = 'text-red-600';
  if (strengthScore === 2) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
    strengthText = 'text-amber-600';
  } else if (strengthScore === 3) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
    strengthText = 'text-blue-600';
  } else if (strengthScore === 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-[#087D2C]';
    strengthText = 'text-[#087D2C]';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError('Missing reset token. Please request a new link from the Forgot Password page.');
      return;
    }

    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please re-check both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordMutation({
        token,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F5] via-white to-[#FDF8F3] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#087D2C] transition-colors py-1.5 px-3 rounded-full bg-white shadow-xs border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
        <span className="text-[11px] font-bold text-gray-400">Bapatla, AP</span>
      </div>

      {/* Main Card */}
      <div className="max-w-[460px] w-full mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header with Logo */}
        <div className="pt-8 pb-5 px-6 sm:px-8 bg-gradient-to-b from-emerald-50/90 via-emerald-50/40 to-white border-b border-gray-100/80 text-center">
          <Link href="/" className="inline-block mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Be My Shopper Logo"
              className="h-11 sm:h-12 w-auto object-contain mx-auto"
              style={{ maxHeight: '48px' }}
            />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#087D2C] text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#087D2C]" />
            <span>Secure Password Recovery</span>
          </div>

          <h1 className="text-2xl font-black text-[#17211B] tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Choose a strong, memorable password to secure your Be My Shopper account.
          </p>
        </div>

        {/* Token Validation Check / Loading / Error State */}
        {tokenValidation === undefined ? (
          <div className="p-10 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#087D2C] animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Validating your secure reset link...</p>
          </div>
        ) : !tokenValidation.valid ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Invalid or Expired Link</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                {tokenValidation.error ||
                  'This password reset link is invalid or has already been used.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087D2C] hover:bg-[#065A20] text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Request a New Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#087D2C] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Password Reset Complete!</h3>
              <p className="text-xs text-gray-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Your password has been securely updated. You can now sign in using your new credentials.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 w-full justify-center py-3 rounded-xl bg-[#087D2C] hover:bg-[#065A20] text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-4 text-xs">
            {tokenValidation.email && (
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] text-gray-600 flex items-center justify-between">
                <span>Account:</span>
                <span className="font-bold text-gray-900">{tokenValidation.email}</span>
              </div>
            )}

            {/* Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{formError}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#17211B] placeholder:text-gray-400 focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 font-medium">Strength:</span>
                    <span className={`font-bold ${strengthText}`}>{strengthLabel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        strengthScore >= 1 ? strengthColor : 'bg-transparent'
                      } ${strengthScore === 1 ? 'w-1/4' : strengthScore === 2 ? 'w-2/4' : strengthScore === 3 ? 'w-3/4' : 'w-full'}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1">
                      {hasMinLength ? (
                        <Check className="w-3 h-3 text-[#087D2C]" />
                      ) : (
                        <XIcon className="w-3 h-3 text-gray-300" />
                      )}
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasNumber ? (
                        <Check className="w-3 h-3 text-[#087D2C]" />
                      ) : (
                        <XIcon className="w-3 h-3 text-gray-300" />
                      )}
                      <span>Includes number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasUpperCase && hasLowerCase ? (
                        <Check className="w-3 h-3 text-[#087D2C]" />
                      ) : (
                        <XIcon className="w-3 h-3 text-gray-300" />
                      )}
                      <span>Upper & lower case</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasSpecial ? (
                        <Check className="w-3 h-3 text-[#087D2C]" />
                      ) : (
                        <XIcon className="w-3 h-3 text-gray-300" />
                      )}
                      <span>Special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#17211B] placeholder:text-gray-400 focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#087D2C] to-[#065A20] hover:from-[#065A20] hover:to-[#044016] text-white font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to Sign In Link */}
            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#087D2C] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>

            {/* Security Assurance */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-3 border-t border-gray-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087D2C]" />
              <span>256-Bit SSL Encrypted &bull; Single-Use Token</span>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-400 mt-6">
        &copy; 2026 BeMyShopper. Bapatla, Andhra Pradesh.
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9F5]">
          <Loader2 className="w-8 h-8 text-[#087D2C] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

