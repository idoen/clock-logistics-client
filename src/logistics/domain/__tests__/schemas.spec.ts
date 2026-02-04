import { describe, expect, it } from 'vitest';
import { dailyRowSchema, logisticsConfigSchema } from '../schemas';

describe('logistics schemas', () => {
  it('coerces numeric strings for daily rows', () => {
    const parsed = dailyRowSchema.parse({
      product_id: '10',
      sku: 'SKU-1',
      name: 'Sample',
      lead_time_days: '4',
      avg_daily_sales: '2',
      forecast_daily_sales: '3',
      rop_units: '5',
      safety_stock_units: '6',
      on_hand: '7',
      reserved: '1',
      in_transit: '0',
      available: '6',
      status: 'ok',
      final_status: 'ok',
    });

    expect(parsed.product_id).toBe(10);
    expect(parsed.lead_time_days).toBe(4);
    expect(parsed.available).toBe(6);
  });

  it('rejects rows when required fields are missing', () => {
    expect(() =>
      dailyRowSchema.parse({
        product_id: 1,
        sku: 'SKU',
      }),
    ).toThrow();
  });

  it('transforms logistics config keys into camelCase', () => {
    const parsed = logisticsConfigSchema.parse({
      window_days_short: '7',
      window_days_long: 30,
      forecast_weight_short: 0.4,
      forecast_weight_long: 0.6,
      safety_stock_stats_days: 14,
      service_level_z: 1.2,
      reorder_coverage_days: 21,
      risk_horizon_days: 60,
      dead_stock_window_days: 90,
      dead_stock_drop_min: 0.1,
      dead_stock_drop_max: 0.5,
    });

    expect(parsed.windowDaysShort).toBe(7);
    expect(parsed.deadStockDropMax).toBe(0.5);
  });
});
