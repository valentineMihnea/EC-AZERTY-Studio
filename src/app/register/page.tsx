'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { User, Mail, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({ email, password, name });
      if (result.success) {
        // Automatically login the newly created user
        const loginRes = await login({ email, password });
        if (loginRes.success) {
          router.push('/account');
        } else {
          router.push('/login?registered=true');
        }
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-[#0f1117] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#262a36] bg-[#1a1d26] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white">Create an Account</h1>
          <p className="mt-2 text-sm text-[#9ca3af]">
            Join AZERTY Studio for custom keyboards & parts
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">
              Full Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-[#6b7280]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#6b7280]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#6b7280]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#6b7280]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center space-x-2 rounded-lg bg-[#f59e0b] py-2.5 text-sm font-bold text-black transition hover:bg-[#d97706] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#9ca3af]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#f59e0b] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
