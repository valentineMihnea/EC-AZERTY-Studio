import React from 'react';
import { Cpu } from 'lucide-react';

interface ProductSpecsProps {
  specs: Record<string, string | number | boolean>;
}

function formatSpecKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function formatSpecValue(value: string | number | boolean): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#262a36] bg-[#1a1d26] p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2.5 border-b border-[#262a36] pb-4">
        <Cpu className="h-5 w-5 text-[#f59e0b]" />
        <h2 className="text-lg font-bold tracking-tight text-white">
          Technical Specifications
        </h2>
      </div>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-baseline justify-between gap-4 border-b border-[#262a36]/70 pb-3"
          >
            <dt className="text-sm font-medium text-[#9ca3af]">{formatSpecKey(key)}</dt>
            <dd className="text-right text-sm font-semibold text-[#f3f4f6]">
              {formatSpecValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
