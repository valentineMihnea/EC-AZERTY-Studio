import React, { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import prisma from '@/lib/prisma';
import { toCatalogProductDTO } from '@/lib/catalog';
import { ProductCard } from '@/components/catalog/product-card';
import { ArrowRight, Keyboard, ShieldCheck, Truck, Layers, Sparkles } from 'lucide-react';

async function HomeCatalogShowcase() {
  await connection();

  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    productCount: number;
  }> = [];
  let featuredProducts: ReturnType<typeof toCatalogProductDTO>[] = [];

  try {
    const [rawCategories, rawFeatured] = await Promise.all([
      prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
    ]);

    categories = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      productCount: c._count.products,
    }));

    featuredProducts = rawFeatured.map(toCatalogProductDTO);
  } catch (error) {
    console.error('Failed to load storefront catalog:', error);
  }

  return (
    <>
      {/* Categories Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-[#9ca3af]">
              Keyboards and the exact components to build, tune, and carry them.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f59e0b] hover:underline"
          >
            <span>Browse all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-xl border border-[#262a36] bg-[#1a1d26] p-8 text-center text-sm text-[#9ca3af]">
            No categories available yet. Ensure PostgreSQL is running and seeded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#262a36] bg-[#1a1d26] p-5 transition hover:border-[#f59e0b]/60 hover:bg-[#1f232e]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-lg bg-[#f59e0b]/15 p-2 text-[#f59e0b]">
                      <Layers className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-[#0f1117] px-2.5 py-0.5 text-xs font-semibold text-[#9ca3af]">
                      {cat.productCount} products
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white transition group-hover:text-[#f59e0b]">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#9ca3af]">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#f59e0b]">
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f59e0b]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Builds & Parts</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Featured Gear
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f59e0b] hover:underline"
          >
            <span>View full catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-xl border border-[#262a36] bg-[#1a1d26] p-8 text-center text-sm text-[#9ca3af]">
            Featured products will appear once the database is connected.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ShowcaseSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-xl bg-[#1a1d26]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-xl bg-[#1a1d26]" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#f3f4f6]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#262a36] bg-gradient-to-b from-[#161922] to-[#0f1117]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-1 text-xs font-bold text-[#f59e0b]">
              <Keyboard className="h-3.5 w-3.5" />
              <span>Custom PC Keyboards & Components</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build your endgame <span className="text-[#f59e0b]">mechanical</span> setup.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#9ca3af] sm:text-lg">
              Ready-to-type boards, CNC housings, dye-sub PBT keycaps, and enthusiast switches
              from curated makers. No pre-order waiting—strictly real-time stock.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#d97706]"
              >
                <span>Browse All Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/category/keyboards"
                className="inline-flex items-center gap-2 rounded-xl border border-[#374151] bg-[#1a1d26] px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#f59e0b]"
              >
                <span>Explore Keyboards</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="border-b border-[#262a36] bg-[#13161f]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm">
            <Truck className="h-5 w-5 shrink-0 text-[#f59e0b]" />
            <span className="text-[#d1d5db]">
              <strong className="text-white">Free EU delivery</strong> on orders over €100
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#f59e0b]" />
            <span className="text-[#d1d5db]">
              <strong className="text-white">Real-time stock</strong> with low-stock indicators
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Keyboard className="h-5 w-5 shrink-0 text-[#f59e0b]" />
            <span className="text-[#d1d5db]">
              <strong className="text-white">Curated hardware</strong> across 5 dedicated categories
            </span>
          </div>
        </div>
      </section>

      <Suspense fallback={<ShowcaseSkeleton />}>
        <HomeCatalogShowcase />
      </Suspense>
    </main>
  );
}
