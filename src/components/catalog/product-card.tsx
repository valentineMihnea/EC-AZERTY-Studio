'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CatalogProductDTO, formatPrice } from '@/lib/catalog';
import { StockBadge } from './stock-badge';
import { ShoppingBag, Check, Sparkles, Keyboard } from 'lucide-react';

interface ProductCardProps {
  product: CatalogProductDTO;
}

function getSpecHighlights(specs: Record<string, string | number | boolean>): string {
  const priorityKeys = ['layout', 'type', 'mount', 'profile', 'material', 'connectivity', 'actuationForce'];
  const values: string[] = [];

  for (const key of priorityKeys) {
    const val = specs[key];
    if (val !== undefined && val !== null && typeof val !== 'boolean') {
      values.push(String(val));
      if (values.length >= 2) break;
    }
  }

  if (values.length === 0) {
    const fallbackValues = Object.values(specs)
      .filter((val) => val !== undefined && val !== null && typeof val !== 'boolean')
      .slice(0, 2)
      .map(String);
    return fallbackValues.join(' · ');
  }

  return values.join(' · ');
}

export function ProductCard({ product }: ProductCardProps) {
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageUrl = product.images[0];
  const specSummary = getSpecHighlights(product.specs);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isOutOfStock) return;
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[#262a36] bg-[#1a1d26] transition hover:border-[#f59e0b]/50 hover:shadow-lg hover:shadow-black/30">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#0f1117]">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized
            onError={() => setImgError(true)}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#374151]">
            <Keyboard className="h-12 w-12" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f59e0b] px-2.5 py-0.5 text-xs font-bold text-black shadow">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3">
          <StockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <Link
            href={`/category/${product.category.slug}`}
            className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b] hover:underline"
          >
            {product.category.name}
          </Link>
          <span className="text-base font-bold text-white">{formatPrice(product.price)}</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-base font-bold text-[#f3f4f6] transition group-hover:text-[#f59e0b]"
        >
          {product.name}
        </Link>

        <p className="mt-1 line-clamp-1 text-xs text-[#9ca3af]">
          {specSummary || product.description}
        </p>

        <div className="mt-4 pt-3 border-t border-[#262a36] flex items-center gap-2">
          <button
            type="button"
            disabled={product.isOutOfStock}
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
              product.isOutOfStock
                ? 'cursor-not-allowed border border-[#262a36] bg-[#0f1117] text-[#6b7280]'
                : addedFeedback
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#f59e0b] text-black hover:bg-[#d97706]'
            }`}
          >
            {product.isOutOfStock ? (
              <span>Sold Out</span>
            ) : addedFeedback ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-lg border border-[#374151] px-3 py-2 text-xs font-semibold text-[#f3f4f6] transition hover:border-[#f59e0b] hover:text-[#f59e0b]"
          >
            Specs
          </Link>
        </div>
      </div>
    </div>
  );
}
