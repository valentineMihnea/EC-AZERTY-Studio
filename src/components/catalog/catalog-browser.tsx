'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CatalogCategoryDTO, CatalogProductDTO } from '@/lib/catalog';
import { ProductCard } from './product-card';
import { ProductFilters, ProductFilterValues } from './product-filters';
import { ArrowUpDown, ChevronLeft, ChevronRight, SearchX, SlidersHorizontal } from 'lucide-react';

interface CatalogBrowserProps {
  initialCategories?: CatalogCategoryDTO[];
  lockedCategorySlug?: string;
  pageTitle?: string;
  pageDescription?: string;
}

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function CatalogBrowser({
  initialCategories = [],
  lockedCategorySlug,
  pageTitle = 'All Products',
  pageDescription = 'Browse custom keyboards, cases, keycaps, switches, and accessories.',
}: CatalogBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CatalogCategoryDTO[]>(initialCategories);
  const [products, setProducts] = useState<CatalogProductDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: ProductFilterValues = useMemo(() => {
    const minParam = searchParams.get('minPrice');
    const maxParam = searchParams.get('maxPrice');
    return {
      search: searchParams.get('search') || '',
      category: lockedCategorySlug || searchParams.get('category') || '',
      minPriceEuros: minParam ? String(Math.floor(Number(minParam) / 100)) : '',
      maxPriceEuros: maxParam ? String(Math.floor(Number(maxParam) / 100)) : '',
      inStockOnly: searchParams.get('inStockOnly') === 'true',
      sortBy: searchParams.get('sortBy') || 'featured',
    };
  }, [searchParams, lockedCategorySlug]);

  const page = useMemo(() => {
    const p = Number.parseInt(searchParams.get('page') || '1', 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [searchParams]);

  // Fetch categories if not pre-supplied
  useEffect(() => {
    if (initialCategories.length > 0) return;
    const controller = new AbortController();
    fetch('/api/categories', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {
        // Non-blocking fallback
      });
    return () => controller.abort();
  }, [initialCategories.length]);

  // Sync filters to URL
  const syncUrl = useCallback(
    (nextFilters: ProductFilterValues, nextPage: number) => {
      const params = new URLSearchParams();
      if (nextFilters.search.trim()) params.set('search', nextFilters.search.trim());
      if (!lockedCategorySlug && nextFilters.category) params.set('category', nextFilters.category);
      if (nextFilters.minPriceEuros !== '') {
        const cents = Math.round(Number(nextFilters.minPriceEuros) * 100);
        if (Number.isFinite(cents) && cents >= 0) params.set('minPrice', String(cents));
      }
      if (nextFilters.maxPriceEuros !== '') {
        const cents = Math.round(Number(nextFilters.maxPriceEuros) * 100);
        if (Number.isFinite(cents) && cents >= 0) params.set('maxPrice', String(cents));
      }
      if (nextFilters.inStockOnly) params.set('inStockOnly', 'true');
      if (nextFilters.sortBy && nextFilters.sortBy !== 'featured') {
        params.set('sortBy', nextFilters.sortBy);
      }
      if (nextPage > 1) params.set('page', String(nextPage));

      const queryStr = params.toString();
      router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
    },
    [lockedCategorySlug, pathname, router]
  );

  // Fetch products whenever filters or page change
  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (filters.search.trim()) params.set('search', filters.search.trim());
    const activeCategory = lockedCategorySlug || filters.category;
    if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory);
    if (filters.minPriceEuros !== '') {
      const cents = Math.round(Number(filters.minPriceEuros) * 100);
      if (Number.isFinite(cents) && cents >= 0) params.set('minPrice', String(cents));
    }
    if (filters.maxPriceEuros !== '') {
      const cents = Math.round(Number(filters.maxPriceEuros) * 100);
      if (Number.isFinite(cents) && cents >= 0) params.set('maxPrice', String(cents));
    }
    if (filters.inStockOnly) params.set('inStockOnly', 'true');
    params.set('sortBy', filters.sortBy || 'featured');
    params.set('page', String(page));
    params.set('limit', '12');

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Could not load products. Please try again.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page, lockedCategorySlug]);

  const handleFilterChange = (patch: Partial<ProductFilterValues>) => {
    const nextFilters = { ...filters, ...patch };
    syncUrl(nextFilters, 1);
  };

  const handleResetFilters = () => {
    const reset: ProductFilterValues = {
      search: '',
      category: lockedCategorySlug || '',
      minPriceEuros: '',
      maxPriceEuros: '',
      inStockOnly: false,
      sortBy: 'featured',
    };
    syncUrl(reset, 1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    syncUrl(filters, nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-[#262a36] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">{pageTitle}</h1>
          <p className="mt-1.5 text-sm text-[#9ca3af]">{pageDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-[#9ca3af]">
            {isLoading ? 'Searching...' : `${pagination.total} ${pagination.total === 1 ? 'product' : 'products'}`}
          </span>

          {/* Mobile Filters Toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#374151] bg-[#1a1d26] px-3 py-2 text-sm font-medium text-white lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#f59e0b]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 rounded-lg border border-[#374151] bg-[#1a1d26] px-3 py-2">
            <ArrowUpDown className="h-4 w-4 text-[#f59e0b]" />
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              aria-label="Sort products"
              className="bg-transparent text-sm font-medium text-white focus:outline-none"
            >
              <option value="featured" className="bg-[#1a1d26]">Featured</option>
              <option value="price-asc" className="bg-[#1a1d26]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#1a1d26]">Price: High to Low</option>
              <option value="newest" className="bg-[#1a1d26]">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
          <ProductFilters
            filters={filters}
            categories={categories}
            lockCategory={Boolean(lockedCategorySlug)}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-400">
              <p className="font-semibold">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-xl border border-[#262a36] bg-[#1a1d26]"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#262a36] bg-[#1a1d26] px-6 py-16 text-center">
              <SearchX className="mb-4 h-12 w-12 text-[#6b7280]" />
              <h3 className="text-lg font-bold text-white">No matching products found</h3>
              <p className="mt-1 max-w-md text-sm text-[#9ca3af]">
                Try clearing some filters or searching for another keyboard, switch, or keycap keyword.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 rounded-lg bg-[#f59e0b] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#d97706]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4 border-t border-[#262a36] pt-6">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#374151] bg-[#1a1d26] px-4 py-2 text-sm font-medium text-white transition hover:border-[#f59e0b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </button>

                  <span className="text-sm font-medium text-[#9ca3af]">
                    Page <span className="text-white font-bold">{pagination.page}</span> of{' '}
                    <span className="text-white font-bold">{pagination.totalPages}</span>
                  </span>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#374151] bg-[#1a1d26] px-4 py-2 text-sm font-medium text-white transition hover:border-[#f59e0b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
