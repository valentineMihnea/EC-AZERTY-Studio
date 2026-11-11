'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { User, Shield, LogOut, Search } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="border-b border-[#262a36] bg-[#0f1117] text-[#f3f4f6]">
      {/* Promo Banner */}
      <div className="bg-[#f59e0b] px-4 py-1.5 text-center text-xs font-semibold text-black">
        Free tracked shipping in EU for all orders over €100!
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 text-xl font-black tracking-wider text-white shrink-0">
            <span className="rounded bg-[#f59e0b] px-2 py-0.5 text-sm font-bold text-black">AZERTY</span>
            <span>STUDIO</span>
          </Link>

          <div className="hidden space-x-5 lg:flex text-sm font-medium text-[#9ca3af]">
            <Link href="/products" className="transition hover:text-white">
              Catalog
            </Link>
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

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-xs items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6b7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyboards, switches..."
              aria-label="Search catalog"
              className="w-full rounded-lg border border-[#374151] bg-[#1a1d26] py-1.5 pl-9 pr-3 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
            />
          </div>
        </form>

        <div className="flex items-center space-x-4 text-sm shrink-0">
          <Link
            href="/products"
            className="sm:hidden rounded-md p-1.5 text-[#9ca3af] hover:bg-[#1a1d26] hover:text-white transition"
            aria-label="Search catalog"
          >
            <Search className="h-4 w-4" />
          </Link>

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
