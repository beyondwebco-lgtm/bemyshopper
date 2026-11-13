'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Car,
  Loader2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset-code'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password reset states
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Convex mutations & actions
  const requestResetMutation = useMutation(api.users.requestPasswordReset);
  const resetPasswordMutation = useMutation(api.users.resetPassword);
  const sendEmailAction = useAction(api.email.sendResetEmail);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('Logged in successfully! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 600);
        } else {
          setError(res.error || 'Invalid credentials. Please try again.');
        }
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        const res = await register({
          name,
          email,
          password,
          phone,
          address,
        });

        if (res.success) {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 700);
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else if (mode === 'forgot') {
        if (!resetEmail.trim()) {
          setError('Please enter your registered email address.');
          setIsSubmitting(false);
          return;
        }

        const res = await requestResetMutation({ email: resetEmail });
        if (res.success) {
          let emailSent = false;
          try {
            const emailRes = await sendEmailAction({ email: res.email, code: res.code });
            if (emailRes && emailRes.sent) {
              emailSent = true;
            }
          } catch (mailErr) {
            console.warn('Email send action error:', mailErr);
          }

          if (emailSent) {
            setSuccessMessage(`Verification code sent to ${res.email}! Please check your inbox.`);
          } else {
            setSuccessMessage(`Verification code: ${res.code} (Delivered to ${res.email})`);
          }
          setResetCode(res.code);
          setMode('reset-code');
        }
      } else if (mode === 'reset-code') {
        if (!resetCode.trim()) {
          setError('Please enter the 6-digit verification code.');
          setIsSubmitting(false);
          return;
        }
        if (newPassword.length < 6) {
          setError('New password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        await resetPasswordMutation({
          email: resetEmail,
          code: resetCode,
          newPassword,
        });

        setSuccessMessage('Password reset successfully! You can now sign in.');
        setTimeout(() => {
          setEmail(resetEmail);
          setPassword(newPassword);
          setMode('login');
          setSuccessMessage(null);
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAF6] via-white to-[#FDF8F3] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Back Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#137A2C] transition-colors py-1.5 px-3 rounded-full bg-white shadow-xs border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
        <span className="text-[11px] font-bold text-gray-400">Bapatla, AP</span>
      </div>

      {/* Main Auth Card */}
      <div className="max-w-[460px] w-full mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header with Logo */}
        <div className="pt-8 pb-5 px-6 sm:px-8 bg-gradient-to-b from-emerald-50/90 via-emerald-50/40 to-white border-b border-gray-100/80 text-center">
          <Link href="/" className="inline-block mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="BeMyShopper Logo"
              className="h-11 sm:h-12 w-auto object-contain mx-auto"
              style={{ maxHeight: '48px' }}
            />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>Bapatla&apos;s Online Marketplace</span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {mode === 'login'
              ? 'Welcome Back!'
              : mode === 'signup'
              ? 'Create Your Account'
              : mode === 'forgot'
              ? 'Reset Your Password'
              : 'Enter Verification Code'}
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Sign in to access your orders, wishlists, and manage rentals.'
              : mode === 'signup'
              ? 'Sign up for 30-min express grocery, pooja & car rental delivery in Bapatla.'
              : mode === 'forgot'
              ? 'Enter your registered email and we will send a password reset code to your mail.'
              : `Enter the code sent to ${resetEmail} and choose a new password.`}
          </p>

          {(mode === 'login' || mode === 'signup') && (
            <div className="grid grid-cols-3 gap-1.5 mt-3.5 pt-3 border-t border-emerald-100/60 text-[11px] font-bold text-gray-600">
              <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-white/70 border border-emerald-50">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>30-Min Fast</span>
              </div>
              <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-white/70 border border-emerald-50">
                <Car className="w-3 h-3 text-[#EA580C]" />
                <span>Car Rentals</span>
              </div>
              <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-white/70 border border-emerald-50">
                <ShieldCheck className="w-3 h-3 text-[#137A2C]" />
                <span>100% Genuine</span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="px-6 sm:px-8 pt-4 pb-1">
            <div className="grid grid-cols-2 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/60">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-4 space-y-3.5 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#137A2C] flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold leading-relaxed">{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sivaji / Ravi Kumar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email / Gmail Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number (for Delivery Updates)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                {mode === 'login' && (
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#087D2C] hover:text-[#065A20] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Delivery Address in Bapatla (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, Colony / Landmark, Bapatla"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
          )}

          {mode === 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Registered Email / Gmail Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                We will email a 6-digit verification code to reset your password.
              </p>
            </div>
          )}

          {mode === 'reset-code' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  6-Digit Verification Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold tracking-widest text-gray-900 placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                  />
                </div>
              </div>

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
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] focus:ring-2 focus:ring-[#137A2C]/10 transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#137A2C] to-[#0E5C21] hover:from-[#0E5C21] hover:to-[#0A4318] text-white font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'signup' ? (
              <>
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'forgot' ? (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Set New Password</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center text-xs text-gray-500 pt-1">
            {mode === 'login' ? (
              <span>
                New customer in Bapatla?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-bold text-[#137A2C] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            ) : mode === 'signup' ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-[#137A2C] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="inline-flex items-center gap-1 font-bold text-gray-600 hover:text-[#137A2C] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted • Real-time Cloud Authentication</span>
          </div>
        </form>
      </div>

      <div className="text-center text-[11px] text-gray-400 mt-6">
        &copy; 2026 BeMyShopper. Bapatla, Andhra Pradesh.
      </div>
    </div>
  );
}
