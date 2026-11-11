import React from 'react';
import { getStockStatus } from '@/lib/catalog';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  detailed?: boolean;
}

export function StockBadge({ stock, lowStockThreshold = 5, detailed = false }: StockBadgeProps) {
  const status = getStockStatus(stock, lowStockThreshold);

  const styles = {
    in_stock: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    low_stock: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    out_of_stock: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  }[status.variant];

  const Icon = {
    in_stock: CheckCircle2,
    low_stock: AlertTriangle,
    out_of_stock: XCircle,
  }[status.variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{detailed ? status.detailText : status.badgeText}</span>
    </span>
  );
}
