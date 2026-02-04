import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '@/shared/http/httpClient';
import {
  createPurchaseOrder,
  fetchDaily,
  fetchLogisticsConfig,
  updateInventory,
} from '../logisticsApi';

vi.mock('@/shared/http/httpClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('logisticsApi', () => {
  beforeEach(() => {
    vi.mocked(httpClient.get).mockReset();
    vi.mocked(httpClient.post).mockReset();
    vi.mocked(httpClient.patch).mockReset();
  });

  it('fetches daily report with optional status', async () => {
    const row = {
      product_id: 1,
      sku: 'SKU-1',
      name: 'Product',
      lead_time_days: 2,
      avg_daily_sales: 1,
      forecast_daily_sales: 1,
      rop_units: 4,
      safety_stock_units: 1,
      on_hand: 10,
      reserved: 2,
      in_transit: 1,
      available: 9,
      status: 'ok',
      final_status: 'ok',
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: [row] });

    await fetchDaily('ok');

    expect(httpClient.get).toHaveBeenCalledWith('/api/logistics/daily', { params: { status: 'ok' } });
  });

  it('fetches daily report without status', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({ data: [] });

    await fetchDaily();

    expect(httpClient.get).toHaveBeenCalledWith('/api/logistics/daily', { params: undefined });
  });

  it('transforms logistics config into camelCase fields', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        window_days_short: 7,
        window_days_long: 30,
        forecast_weight_short: 0.6,
        forecast_weight_long: 0.4,
        safety_stock_stats_days: 10,
        service_level_z: 1.65,
        reorder_coverage_days: 15,
        risk_horizon_days: 60,
        dead_stock_window_days: 90,
        dead_stock_drop_min: 0.1,
        dead_stock_drop_max: 0.2,
      },
    });

    const result = await fetchLogisticsConfig();

    expect(result).toEqual({
      windowDaysShort: 7,
      windowDaysLong: 30,
      forecastWeightShort: 0.6,
      forecastWeightLong: 0.4,
      safetyStockStatsDays: 10,
      serviceLevelZ: 1.65,
      reorderCoverageDays: 15,
      riskHorizonDays: 60,
      deadStockWindowDays: 90,
      deadStockDropMin: 0.1,
      deadStockDropMax: 0.2,
    });
  });

  it('creates purchase orders and updates inventory', async () => {
    const purchaseOrder = {
      id: 9,
      product_id: 1,
      qty_ordered: 20,
      expected_arrival: null,
      status: 'open',
      order_date: '2024-01-01',
      created_at: '2024-01-01',
    };

    const inventory = {
      product_id: 1,
      on_hand: 10,
      reserved: 2,
      in_transit: 1,
    };

    vi.mocked(httpClient.post).mockResolvedValue({ data: purchaseOrder });
    vi.mocked(httpClient.patch).mockResolvedValue({ data: inventory });

    const created = await createPurchaseOrder({ productId: 1, qtyOrdered: 20, expectedArrival: '2024-01-15' });
    const updated = await updateInventory(1, { onHand: 10, reserved: 2, inTransit: 1 });

    expect(httpClient.post).toHaveBeenCalledWith('/api/purchase-orders', {
      productId: 1,
      qtyOrdered: 20,
      expectedArrival: '2024-01-15',
    });
    expect(httpClient.patch).toHaveBeenCalledWith('/api/inventory/1', {
      onHand: 10,
      reserved: 2,
      inTransit: 1,
    });
    expect(created).toEqual(purchaseOrder);
    expect(updated).toEqual(inventory);
  });
});
