'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const requestPasswordReset = useAction(api.passwordReset.requestPasswordReset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset({ email: cleanEmail });
      setSuccessMessage(res.message);
    } catch (err: unknown) {
      // In case of unexpected network failure
      const msg = err instanceof Error ? err.message : 'Failed to process request. Please try again.';
      setError(msg);
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
            <span>Bapatla&apos;s Online Marketplace</span>
          </div>

          <h1 className="text-2xl font-black text-[#17211B] tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            No worries! Enter your registered email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-4 text-xs">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{error}</span>
            </div>
          )}

          {/* Success Banner (Generic confirmation for anti-enumeration) */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#087D2C] space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#087D2C]" />
                <span>Password Reset Email Sent</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-2 text-[11px] text-emerald-700">
                Didn&apos;t receive it? Check your spam/junk folder or verify the email spelling.
              </div>
            </div>
          )}

          {!successMessage && (
            <>
              {/* Registered Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Registered Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#17211B] placeholder:text-gray-400 focus:outline-none focus:border-[#087D2C] focus:ring-2 focus:ring-[#087D2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#087D2C] to-[#065A20] hover:from-[#065A20] hover:to-[#044016] text-white font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

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
            <span>256-Bit SSL Encrypted &bull; Secure Tokenized Recovery</span>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-400 mt-6">
        &copy; 2026 BeMyShopper. Bapatla, Andhra Pradesh.
      </div>
    </div>
  );
}

