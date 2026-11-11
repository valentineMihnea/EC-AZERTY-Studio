'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { User, Shield, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="border-b border-[#262a36] bg-[#0f1117] text-[#f3f4f6]">
      {/* Promo Banner */}
      <div className="bg-[#f59e0b] px-4 py-1.5 text-center text-xs font-semibold text-black">
        Free tracked shipping in EU for all orders over €100!
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 text-xl font-black tracking-wider text-white">
            <span className="rounded bg-[#f59e0b] px-2 py-0.5 text-sm font-bold text-black">AZERTY</span>
            <span>STUDIO</span>
          </Link>

          <div className="hidden space-x-6 md:flex text-sm font-medium text-[#9ca3af]">
            <Link href="/category/keyboards" className="transition hover:text-white">
              Keyboards
            </Link>
            <Link href="/category/cases" className="transition hover:text-white">
              Cases
            </Link>
            <Link href="/category/keycaps" className="transition hover:text-white">
              Keycaps
            </Link>
            <Link href="/category/switches" className="transition hover:text-white">
              Switches
            </Link>
            <Link href="/category/accessories" className="transition hover:text-white">
              Accessories
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center space-x-1 rounded bg-[#d97706]/20 px-2.5 py-1 text-xs font-medium text-[#f59e0b] hover:bg-[#d97706]/30 transition"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="inline-flex items-center space-x-1.5 rounded-md px-3 py-1.5 font-medium text-[#f3f4f6] hover:bg-[#1a1d26] transition"
                  >
                    <User className="h-4 w-4 text-[#f59e0b]" />
                    <span>{user.name || user.email.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="inline-flex items-center space-x-1 rounded-md px-2.5 py-1.5 text-xs text-[#9ca3af] hover:text-white hover:bg-[#1a1d26] transition"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="rounded-md px-3 py-1.5 font-medium text-[#f3f4f6] hover:bg-[#1a1d26] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-[#f59e0b] px-3.5 py-1.5 font-semibold text-black hover:bg-[#d97706] transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
