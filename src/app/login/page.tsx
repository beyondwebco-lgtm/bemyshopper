'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth, cleanAuthErrorMessage } from '../../context/AuthContext';
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

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

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
          }, 500);
        } else {
          setError(res.error || 'Invalid email or password. Please try again.');
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
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });

        if (res.success) {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 600);
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else if (mode === 'forgot') {
        if (!resetEmail.trim()) {
          setError('Please enter your registered email address.');
          setIsSubmitting(false);
          return;
        }

        const res = await requestResetMutation({ email: resetEmail.trim() });
        if (res.success) {
          let emailSent = false;
          try {
            const emailRes = await sendEmailAction({ email: res.email, code: res.code });
            if (emailRes && emailRes.sent) {
              emailSent = true;
            }
          } catch (mailErr) {
            console.warn('Convex email error:', mailErr);
          }

          if (emailSent) {
            setSuccessMessage(`Verification code sent to ${res.email}`);
          } else {
            setSuccessMessage(`Verification code: ${res.code}`);
          }
          setResetCode(res.code);
          setMode('reset-code');
        }
      } else if (mode === 'reset-code') {
        if (!resetCode.trim()) {
          setError('Please enter the 6-digit code.');
          setIsSubmitting(false);
          return;
        }
        if (newPassword.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }

        await resetPasswordMutation({
          email: resetEmail.trim(),
          code: resetCode.trim(),
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
      setError(cleanAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:py-16 px-4">
      {/* Back to store navigation */}
      <div className="max-w-[400px] w-full mx-auto mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Minimal Auth Card */}
      <div className="max-w-[400px] w-full mx-auto bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
        {/* Minimal Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="BeMyShopper"
              className="h-9 w-auto object-contain mx-auto"
            />
          </Link>

          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {mode === 'login'
              ? 'Welcome Back'
              : mode === 'signup'
              ? 'Create Account'
              : mode === 'forgot'
              ? 'Reset Password'
              : 'Verify Code'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Sign in to place orders and manage your account'
              : mode === 'signup'
              ? 'Sign up to shop groceries and express delivery'
              : mode === 'forgot'
              ? 'Enter your registered email to receive a code'
              : `Code sent to ${resetEmail}`}
          </p>
        </div>

        {/* Tab Selector */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
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
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#137A2C] flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          {(mode === 'login' || mode === 'signup') && (
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Mobile Phone (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password (Login & Sign Up) */}
          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-gray-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                    }}
                    className="text-[11px] font-medium text-[#137A2C] hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Flow */}
          {mode === 'forgot' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Reset Code Flow */}
          {mode === 'reset-code' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">6-Digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold tracking-widest text-gray-900 placeholder:tracking-normal focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#137A2C] bg-gray-50/50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-[#137A2C] hover:bg-[#0E5C21] text-white font-bold text-xs shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === 'login' ? (
              <span>Sign In</span>
            ) : mode === 'signup' ? (
              <span>Create Account</span>
            ) : mode === 'forgot' ? (
              <span>Send Code</span>
            ) : (
              <span>Set Password</span>
            )}
          </button>

          {/* Mode Switch Helper */}
          <div className="text-center text-[11px] text-gray-500 pt-2">
            {mode === 'login' ? (
              <span>
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-bold text-[#137A2C] hover:underline cursor-pointer"
                >
                  Create account
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
                  Sign in
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="inline-flex items-center gap-1 font-bold text-gray-600 hover:text-[#137A2C] cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="text-center text-[11px] text-gray-400 mt-6">
        &copy; 2026 BeMyShopper. Bapatla, AP.
      </div>
    </div>
  );
}
