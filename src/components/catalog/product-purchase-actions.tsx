'use client';

import React, { useState } from 'react';
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice, isFreeShipping } from '@/lib/catalog';
import { Minus, Plus, ShoppingBag, Check, Truck, Zap } from 'lucide-react';

interface ProductPurchaseActionsProps {
  productName: string;
  price: number;
  stock: number;
}

export function ProductPurchaseActions({
  productName,
  price,
  stock,
}: ProductPurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = stock <= 0;
  const maxQuantity = Math.max(1, stock);
  const lineTotalCents = price * quantity;
  const qualifiesFreeShipping = isFreeShipping(lineTotalCents);
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS + 1 - lineTotalCents
  );

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
          Quantity
        </span>
        <div className="inline-flex items-center rounded-lg border border-[#374151] bg-[#0f1117]">
          <button
            type="button"
            disabled={isOutOfStock || quantity <= 1}
            onClick={handleDecrease}
            aria-label="Decrease quantity"
            className="p-2.5 text-[#9ca3af] transition hover:text-white disabled:opacity-30"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-white">
            {isOutOfStock ? 0 : quantity}
          </span>
          <button
            type="button"
            disabled={isOutOfStock || quantity >= maxQuantity}
            onClick={handleIncrease}
            aria-label="Increase quantity"
            className="p-2.5 text-[#9ca3af] transition hover:text-white disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {!isOutOfStock && (
          <span className="text-xs text-[#6b7280]">Max {stock} available</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition ${
            isOutOfStock
              ? 'cursor-not-allowed border border-[#262a36] bg-[#1a1d26] text-[#6b7280]'
              : added
                ? 'bg-emerald-500 text-black'
                : 'bg-[#f59e0b] text-black hover:bg-[#d97706]'
          }`}
        >
          {isOutOfStock ? (
            <span>Currently Sold Out</span>
          ) : added ? (
            <>
              <Check className="h-4 w-4" />
              <span>
                Added {quantity} × {productName}
              </span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>
                Add to Shopping Cart — {formatPrice(lineTotalCents)}
              </span>
            </>
          )}
        </button>

        {!isOutOfStock && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#262a36] bg-[#1a1d26]/60 px-4 py-2.5 text-xs text-[#9ca3af]">
            <Zap className="h-3.5 w-3.5 text-[#f59e0b]" />
            <span>Instant Stripe checkout coming in Week 8</span>
          </div>
        )}
      </div>

      {/* Shipping Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#262a36] bg-[#0f1117] p-4">
        <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#f59e0b]" />
        <div className="text-xs leading-relaxed">
          {qualifiesFreeShipping ? (
            <p className="font-semibold text-emerald-400">
              Qualifies for free tracked EU shipping!
            </p>
          ) : (
            <p className="text-[#d1d5db]">
              Ships within 24h. Add{' '}
              <span className="font-semibold text-[#f59e0b]">
                {formatPrice(remainingForFreeShipping)}
              </span>{' '}
              more to unlock free shipping (orders over €100).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
