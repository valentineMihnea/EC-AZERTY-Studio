import type { Category, Product } from '@prisma/client';

export const FREE_SHIPPING_THRESHOLD_CENTS = 10000; // €100.00 (Presentation 1 Slide 5)

export interface StockBadgeInfo {
  label: string;
  variant: 'in_stock' | 'low_stock' | 'out_of_stock';
  badgeText: string;
  detailText: string;
  isAvailable: boolean;
}

export interface CatalogCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
}

export interface CatalogProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  isFeatured: boolean;
  images: string[];
  specs: Record<string, string | number | boolean>;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

/**
 * Formats an integer euro cent amount into a euro price string (e.g., 18999 -> "€189.99").
 */
export function formatPrice(cents: number): string {
  const safeCents = Number.isFinite(cents) ? cents : 0;
  return `€${(safeCents / 100).toFixed(2)}`;
}

/**
 * Computes real-time stock badge details (Arbiter Studio style low-stock alerts).
 */
export function getStockStatus(stock: number, lowStockThreshold: number = 5): StockBadgeInfo {
  if (stock <= 0) {
    return {
      label: 'Sold Out',
      variant: 'out_of_stock',
      badgeText: 'Sold Out',
      detailText: 'Currently unavailable',
      isAvailable: false,
    };
  }

  if (stock <= lowStockThreshold) {
    return {
      label: 'Low Stock',
      variant: 'low_stock',
      badgeText: `Low Stock - ${stock} left!`,
      detailText: `Only ${stock} ${stock === 1 ? 'unit' : 'units'} left — order soon`,
      isAvailable: true,
    };
  }

  return {
    label: 'In Stock',
    variant: 'in_stock',
    badgeText: `In Stock (${stock})`,
    detailText: `In Stock — ${stock} units ready to ship`,
    isAvailable: true,
  };
}

/**
 * Returns true when order/product subtotal qualifies for free EU shipping (> €100).
 */
export function isFreeShipping(cents: number): boolean {
  return cents > FREE_SHIPPING_THRESHOLD_CENTS;
}

/**
 * Maps a Prisma Product + Category record into the API/UI CatalogProductDTO shape.
 */
export function toCatalogProductDTO(
  product: Product & { category: Pick<Category, 'id' | 'name' | 'slug'> }
): CatalogProductDTO {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const rawSpecs =
    product.specs && typeof product.specs === 'object' && !Array.isArray(product.specs)
      ? (product.specs as Record<string, string | number | boolean>)
      : {};

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    isLowStock,
    isOutOfStock,
    isFeatured: product.isFeatured,
    images: product.images,
    specs: rawSpecs,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    createdAt: product.createdAt.toISOString(),
  };
}
