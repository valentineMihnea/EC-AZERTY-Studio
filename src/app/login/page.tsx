'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      if (result.success) {
        router.push(redirectPath);
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#262a36] bg-[#1a1d26] p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black tracking-tight text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-[#9ca3af]">
          Sign in to your AZERTY Studio account
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#6b7280]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@azertystudio.com"
              className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">
            Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#6b7280]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#f59e0b] py-2.5 text-sm font-bold text-black transition hover:bg-[#d97706] disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[#9ca3af]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-[#f59e0b] hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-[#0f1117] px-4 py-12">
      <Suspense fallback={<div className="text-[#9ca3af]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
