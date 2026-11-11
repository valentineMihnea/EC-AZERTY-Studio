'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { User, Mail, Shield, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-[#0f1117] text-[#9ca3af]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f59e0b] border-t-transparent mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-100px)] bg-[#0f1117] px-4 py-12 text-[#f3f4f6]">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Profile Banner */}
        <div className="rounded-2xl border border-[#262a36] bg-[#1a1d26] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b]">
              <User className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-white">{user.name || 'Keyboard Enthusiast'}</h1>
                <span
                  className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    user.role === 'ADMIN'
                      ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                  <span>{user.role}</span>
                </span>
              </div>
              <p className="mt-1 flex items-center space-x-1.5 text-sm text-[#9ca3af]">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="inline-flex items-center space-x-2 rounded-lg border border-[#374151] bg-[#0f1117] px-4 py-2 text-sm font-medium text-[#f3f4f6] hover:bg-[#262a36] hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Links & Information Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Order History Card (Mihnea - A8) */}
          <div className="rounded-2xl border border-[#262a36] bg-[#1a1d26] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-white">Order History</h2>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Track current custom keyboard builds and review previous hardware invoices.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/account/orders"
                className="inline-flex items-center space-x-1 text-sm font-semibold text-[#f59e0b] hover:underline"
              >
                <span>View your orders</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Admin Management Card (Mihnea & Mihai - A9, A10) */}
          {user.role === 'ADMIN' ? (
            <div className="rounded-2xl border border-[#d97706]/40 bg-[#1a1d26] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="rounded-lg bg-[#f59e0b]/10 p-2 text-[#f59e0b]">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Admin Dashboard</h2>
                </div>
                <p className="text-sm text-[#9ca3af]">
                  Manage store products, update inventory stock, and oversee customer orders.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1 text-sm font-semibold text-[#f59e0b] hover:underline"
                >
                  <span>Go to Admin Panel</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#262a36] bg-[#1a1d26] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Security & Password</h2>
                </div>
                <p className="text-sm text-[#9ca3af]">
                  Your credentials are secure and hashed with industry-standard bcrypt encryption.
                </p>
              </div>
              <div className="mt-6 text-xs text-[#6b7280]">
                Logged in with session token (valid for 7 days)
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
