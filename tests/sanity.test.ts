import { describe, it, expect } from 'vitest';

describe('A12 - Automated Testing Suite Sanity Check', () => {
  it('runs vitest properly', () => {
    expect(1 + 1).toBe(2);
  });

  it('validates currency formatting for store', () => {
    const formatEUR = (cents: number) => `€${(cents / 100).toFixed(2)}`;
    expect(formatEUR(14999)).toBe('€149.99');
    expect(formatEUR(2450)).toBe('€24.50');
  });
});
