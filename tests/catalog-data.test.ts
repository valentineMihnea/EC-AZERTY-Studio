import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('A1 & A12: Product Catalog & Seed Data Verification', () => {
  const seedFilePath = path.resolve(__dirname, '../prisma/seed.ts');
  const seedContent = fs.readFileSync(seedFilePath, 'utf-8');

  it('contains the 5 required store categories from Presentation 1 Slide 3', () => {
    const requiredCategories = ['Keyboards', 'Cases', 'Keycaps', 'Switches', 'Accessories'];
    for (const cat of requiredCategories) {
      expect(seedContent).toContain(`name: '${cat}'`);
    }
  });

  it('specifies exactly 35 products in total (7 per category)', () => {
    // Count occurrences of slug definitions in products array
    const slugMatches = seedContent.match(/slug:\s*'[a-z0-9-]+'/g) || [];
    // Subtract category slugs (5)
    const productSlugs = slugMatches.length - 5;
    expect(productSlugs).toBe(35);
  });

  it('contains initial default Admin and Customer credentials', () => {
    expect(seedContent).toContain('admin@azertystudio.com');
    expect(seedContent).toContain('customer@azertystudio.com');
    expect(seedContent).toContain('Role.ADMIN');
    expect(seedContent).toContain('Role.CUSTOMER');
  });

  it('includes low-stock thresholds to support competitor feature (Arbiter Studio style)', () => {
    expect(seedContent).toContain('lowStockThreshold');
  });
});
