import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import prisma from '@/lib/prisma';
import { formatPrice, toCatalogProductDTO } from '@/lib/catalog';
import { StockBadge } from '@/components/catalog/stock-badge';
import { ProductGallery } from '@/components/catalog/product-gallery';
import { ProductSpecs } from '@/components/catalog/product-specs';
import { ProductPurchaseActions } from '@/components/catalog/product-purchase-actions';
import { ProductCard } from '@/components/catalog/product-card';
import { ChevronRight } from 'lucide-react';

async function ProductDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;

  const rawProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!rawProduct) {
    notFound();
  }

  const product = toCatalogProductDTO(rawProduct);

  const rawRelated = await prisma.product.findMany({
    where: {
      categoryId: rawProduct.categoryId,
      id: { not: rawProduct.id },
    },
    take: 3,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  const relatedProducts = rawRelated.map(toCatalogProductDTO);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#9ca3af]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-white transition">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-white">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-[#262a36] bg-[#1a1d26] p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/category/${product.category.slug}`}
                className="rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f59e0b] hover:bg-[#f59e0b]/20 transition"
              >
                {product.category.name}
              </Link>
              <StockBadge
                stock={product.stock}
                lowStockThreshold={product.lowStockThreshold}
                detailed
              />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-[#f59e0b]">
              {formatPrice(product.price)}
            </div>

            <p className="text-sm leading-relaxed text-[#d1d5db] sm:text-base">
              {product.description}
            </p>
          </div>

          <div className="border-t border-[#262a36] pt-6">
            <ProductPurchaseActions
              productName={product.name}
              price={product.price}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <ProductSpecs specs={product.specs} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-[#262a36] pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white">
              More in {product.category.name}
            </h2>
            <Link
              href={`/category/${product.category.slug}`}
              className="text-sm font-semibold text-[#f59e0b] hover:underline"
            >
              View all {product.category.name}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#f3f4f6]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div className="aspect-[4/3] animate-pulse rounded-2xl bg-[#1a1d26]" />
              <div className="h-96 animate-pulse rounded-2xl bg-[#1a1d26]" />
            </div>
          </div>
        }
      >
        <ProductDetailContent params={params} />
      </Suspense>
    </main>
  );
}
