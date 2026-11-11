'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Keyboard } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const activeUrl = images[selectedIndex];
  const hasFailed = !activeUrl || failedIndices.has(selectedIndex);

  const markFailed = (idx: number) => {
    setFailedIndices((prev) => new Set(prev).add(idx));
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#262a36] bg-[#1a1d26]">
        {!hasFailed ? (
          <Image
            src={activeUrl}
            alt={productName}
            fill
            unoptimized
            onError={() => markFailed(selectedIndex)}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#4b5563]">
            <Keyboard className="h-16 w-16" />
            <span className="text-xs uppercase tracking-wider">No Preview Available</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border transition ${
                selectedIndex === idx
                  ? 'border-[#f59e0b] ring-2 ring-[#f59e0b]/40'
                  : 'border-[#262a36] opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={url}
                alt={`${productName} preview ${idx + 1}`}
                fill
                unoptimized
                onError={() => markFailed(idx)}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
