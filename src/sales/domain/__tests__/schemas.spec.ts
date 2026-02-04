import { describe, expect, it } from 'vitest';
import { salesReportResponseSchema, salesReportRowSchema } from '../schemas';

describe('sales schemas', () => {
  it('coerces numeric fields for sales report rows', () => {
    const parsed = salesReportRowSchema.parse({
      product_id: '22',
      sku: 'SKU-22',
      name: 'Ring',
      category: null,
      list_price: '199.99',
      currency: 'USD',
      available: '5',
      score: '4',
    });

    expect(parsed.product_id).toBe(22);
    expect(parsed.list_price).toBe(199.99);
    expect(parsed.available).toBe(5);
  });

  it('provides default applied filters when missing', () => {
    const parsed = salesReportResponseSchema.parse({
      rows: [],
      total: 0,
    });

    expect(parsed.appliedFilters).toEqual({});
  });
});
