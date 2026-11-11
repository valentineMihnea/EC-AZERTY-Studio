'use client';

import React from 'react';
import { CatalogCategoryDTO } from '@/lib/catalog';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

export interface ProductFilterValues {
  search: string;
  category: string;
  minPriceEuros: string;
  maxPriceEuros: string;
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: ProductFilterValues;
  categories: CatalogCategoryDTO[];
  lockCategory?: boolean;
  onChange: (next: Partial<ProductFilterValues>) => void;
  onReset: () => void;
}

export function ProductFilters({
  filters,
  categories,
  lockCategory = false,
  onChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    (!lockCategory && filters.category !== '' && filters.category !== 'all') ||
    filters.minPriceEuros !== '' ||
    filters.maxPriceEuros !== '' ||
    filters.inStockOnly;

  return (
    <aside className="rounded-xl border border-[#262a36] bg-[#1a1d26] p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-[#262a36] pb-3">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
          <SlidersHorizontal className="h-4 w-4 text-[#f59e0b]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#f59e0b] hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6b7280]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Keyword, switch, layout..."
            className="w-full rounded-lg border border-[#374151] bg-[#0f1117] py-2 pl-9 pr-3 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
          />
        </div>
      </div>

      {/* Category Filter */}
      {!lockCategory && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Category
          </label>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onChange({ category: '' })}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                filters.category === '' || filters.category === 'all'
                  ? 'bg-[#f59e0b]/15 font-semibold text-[#f59e0b]'
                  : 'text-[#d1d5db] hover:bg-[#0f1117]'
              }`}
            >
              <span>All Products</span>
            </button>
            {categories.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onChange({ category: isSelected ? '' : cat.slug })}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? 'bg-[#f59e0b]/15 font-semibold text-[#f59e0b]'
                      : 'text-[#d1d5db] hover:bg-[#0f1117]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-[#6b7280]">{cat.productCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
          Price Range (€)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Min €"
              value={filters.minPriceEuros}
              onChange={(e) => onChange({ minPriceEuros: e.target.value })}
              className="w-full rounded-lg border border-[#374151] bg-[#0f1117] px-3 py-2 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
          <div>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Max €"
              value={filters.maxPriceEuros}
              onChange={(e) => onChange({ maxPriceEuros: e.target.value })}
              className="w-full rounded-lg border border-[#374151] bg-[#0f1117] px-3 py-2 text-sm text-white placeholder-[#6b7280] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
          Availability
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#262a36] bg-[#0f1117] px-3 py-2.5 text-sm text-[#f3f4f6] transition hover:border-[#374151]">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded border-[#374151] bg-[#1a1d26] accent-[#f59e0b]"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
