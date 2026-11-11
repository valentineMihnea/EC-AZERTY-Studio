import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import prisma from '@/lib/prisma';
import { CatalogBrowser } from '@/components/catalog/catalog-browser';
import { ChevronRight } from 'lucide-react';

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#9ca3af]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-white transition">
            Catalog
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-white">{category.name}</span>
        </nav>
      </div>

      <CatalogBrowser
        lockedCategorySlug={category.slug}
        pageTitle={category.name}
        pageDescription={
          category.description || `Browse all products in the ${category.name} collection.`
        }
      />
    </>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#f3f4f6]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="h-96 animate-pulse rounded-xl bg-[#1a1d26]" />
          </div>
        }
      >
        <CategoryContent params={params} />
      </Suspense>
    </main>
  );
}
