import { describe, expect, it } from 'vitest';

import {
  canAccessOrderRecords,
  canReserveStock,
  filterCatalogForRole,
  isValidOrderTransition,
  ProductRecord,
} from './domain';

const catalog: ProductRecord[] = [
  {
    id: 'prod-1',
    name: 'Draft Silk Sample',
    category: 'Raw materials',
    description: 'Not yet verified.',
    unit: 'kg',
    price: null,
    availability: null,
    image: null,
    lowStockThreshold: null,
    status: 'draft',
    sourceUrl: '',
    sourceNotes: 'Awaiting review',
    priceVisibility: 'contact_ptri',
    priceEvidence: 'Price pending PTRI confirmation.',
    photoStatus: 'pending_staff_upload',
    photoSourceUrl: '',
    photoRightsStatus: 'unavailable',
    verifiedBy: '',
    verifiedAt: '',
    lastUpdatedBy: 'staff reviewer',
    lastUpdatedAt: '2026-11-17T00:00:00Z',
    isPublished: false,
    isArchived: false,
  },
  {
    id: 'prod-2',
    name: 'Published Silk Thread',
    category: 'Textile input',
    description: 'Verified public record',
    unit: 'bundle',
    price: 250,
    availability: 12,
    image: null,
    lowStockThreshold: 5,
    status: 'published',
    sourceUrl: 'https://ptri.dost.gov.ph/',
    sourceNotes: 'Official record once confirmed',
    priceVisibility: 'published',
    priceEvidence: 'Official published price from PTRI listing',
    photoStatus: 'unavailable',
    photoSourceUrl: '',
    photoRightsStatus: 'unavailable',
    verifiedBy: 'PTRI staff',
    verifiedAt: '2026-11-17T00:00:00Z',
    lastUpdatedBy: 'PTRI staff',
    lastUpdatedAt: '2026-11-17T00:00:00Z',
    isPublished: true,
    isArchived: false,
  },
];

describe('catalog publication rules', () => {
  it('customers only see published catalog entries', () => {
    expect(filterCatalogForRole(catalog, 'customer')).toHaveLength(1);
    expect(filterCatalogForRole(catalog, 'customer')[0].id).toBe('prod-2');
  });

  it('staff can see draft and published catalog entries', () => {
    expect(filterCatalogForRole(catalog, 'staff')).toHaveLength(2);
  });
});

describe('authorization boundaries', () => {
  it('prevents customers from accessing another customer record', () => {
    expect(canAccessOrderRecords('customer', 'cust-1', 'cust-2')).toBe(false);
  });

  it('allows staff and admin to review any order record', () => {
    expect(canAccessOrderRecords('staff', 'staff-1', 'cust-2')).toBe(true);
    expect(canAccessOrderRecords('admin', 'admin-1', 'cust-2')).toBe(true);
  });
});

describe('order state transition validation', () => {
  it('accepts valid transitions and rejects invalid ones', () => {
    expect(isValidOrderTransition('Pending', 'Confirmed')).toBe(true);
    expect(isValidOrderTransition('Pending', 'Completed')).toBe(false);
    expect(isValidOrderTransition('Scheduled', 'Completed')).toBe(true);
  });
});

describe('stock handling', () => {
  it('blocks stock oversell when the requested quantity exceeds available stock', () => {
    expect(canReserveStock(4, 5)).toBe(false);
    expect(canReserveStock(7, 5)).toBe(true);
  });
});
