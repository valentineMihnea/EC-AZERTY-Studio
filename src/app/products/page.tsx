import React, { Suspense } from 'react';
import Link from 'next/link';
import { CatalogBrowser } from '@/components/catalog/catalog-browser';
import { ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#f3f4f6]">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#9ca3af]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-white">Catalog</span>
        </nav>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="h-96 animate-pulse rounded-xl bg-[#1a1d26]" />
          </div>
        }
      >
        <CatalogBrowser
          pageTitle="Product Catalog"
          pageDescription="Search and filter all 35 custom keyboards, cases, keycaps, switches, and accessories."
        />
      </Suspense>
    </main>
  );
}
