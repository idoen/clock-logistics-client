import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '@/shared/http/httpClient';
import {
  createSalesReportPreset,
  deleteSalesReportPreset,
  exportSalesReportCsv,
  fetchSalesReport,
} from '../salesApi';

vi.mock('@/shared/http/httpClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockRow = {
  product_id: 1,
  sku: 'SKU-1',
  name: 'Product',
  category: null,
  list_price: 120,
  currency: 'USD',
  image_url: null,
  available: 5,
  score: 0.7,
};

describe('salesApi', () => {
  beforeEach(() => {
    vi.mocked(httpClient.get).mockReset();
    vi.mocked(httpClient.post).mockReset();
    vi.mocked(httpClient.delete).mockReset();
  });

  it('builds query params for sales report', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        rows: [mockRow],
        total: 1,
        appliedFilters: {},
      },
    });

    await fetchSalesReport({
      budget: 500,
      filters: { category: 'rings' },
      inStockOnly: true,
      sort: { field: 'score', direction: 'desc' },
      page: 2,
      pageSize: 25,
    });

    expect(httpClient.get).toHaveBeenCalledWith('/api/sales/report', {
      params: {
        budget: 500,
        filters: JSON.stringify({ category: 'rings' }),
        inStockOnly: true,
        sort: 'score:desc',
        page: 2,
        pageSize: 25,
      },
    });
  });

  it('requests CSV export with blob response type', async () => {
    const blob = new Blob(['csv']);

    vi.mocked(httpClient.get).mockResolvedValue({ data: blob });

    const result = await exportSalesReportCsv({ inStockOnly: false });

    expect(httpClient.get).toHaveBeenCalledWith('/api/sales/report/export', {
      params: {
        format: 'csv',
        inStockOnly: false,
      },
      responseType: 'blob',
    });
    expect(result).toBe(blob);
  });

  it('creates and deletes presets', async () => {
    const preset = {
      id: 3,
      name: 'My preset',
      budget: null,
      filters: null,
      inStockOnly: null,
      sort: null,
      created_at: '2024-01-01',
    };

    vi.mocked(httpClient.post).mockResolvedValue({ data: preset });
    vi.mocked(httpClient.delete).mockResolvedValue({ data: preset });

    const created = await createSalesReportPreset({ name: 'My preset' });
    const deleted = await deleteSalesReportPreset(3);

    expect(httpClient.post).toHaveBeenCalledWith('/api/sales/report-presets', { name: 'My preset' });
    expect(httpClient.delete).toHaveBeenCalledWith('/api/sales/report-presets/3');
    expect(created).toEqual(preset);
    expect(deleted).toEqual(preset);
  });
});
