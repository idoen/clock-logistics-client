import { z } from 'zod';

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return value;
};

const numberish = z.preprocess(toNumber, z.number());
const nullableNumberish = z.preprocess(toNumber, z.number().nullable());

export const dailyRowSchema = z.object({
  product_id: numberish,
  sku: z.string(),
  name: z.string(),
  lead_time_days: numberish,
  avg_daily_sales: numberish,
  forecast_daily_sales: numberish,
  rop_units: numberish,
  safety_stock_units: numberish,
  on_hand: numberish,
  reserved: numberish,
  in_transit: numberish,
  available: numberish,
  status: z.string(),
  min_order_qty: nullableNumberish.optional(),
  pack_size: nullableNumberish.optional(),
  is_dead_stock: z.boolean().optional(),
  final_status: z.string(),
});

export const riskRowSchema = z.object({
  product_id: numberish,
  sku: z.string(),
  final_status: z.string(),
  available: numberish,
  rop_units: numberish,
  forecast_daily_sales: numberish,
  days_until_rop: nullableNumberish,
  at_risk_60d: z.boolean(),
});

export const reorderRowSchema = z.object({
  product_id: numberish,
  sku: z.string(),
  name: z.string(),
  status: z.string(),
  at_risk_60d: z.boolean(),
  days_until_rop: nullableNumberish,
  rop_units: numberish,
  available: numberish,
  in_transit: numberish,
  target_units_30d: numberish,
  recommended_order_qty: numberish,
});

export const createPurchaseOrderResponseSchema = z.object({
  id: numberish,
  product_id: numberish,
  qty_ordered: numberish,
  expected_arrival: z.string().nullable().optional(),
  status: z.string(),
  order_date: z.string(),
  created_at: z.string(),
});

export const purchaseOrderSchema = createPurchaseOrderResponseSchema;

export const inventoryResponseSchema = z.object({
  product_id: numberish,
  on_hand: numberish,
  reserved: numberish,
  in_transit: numberish,
  updated_at: z.string().optional(),
});

export const overrideResponseSchema = z.object({
  id: numberish,
  product_id: numberish,
  override_rop_units: nullableNumberish.optional(),
  override_order_qty: nullableNumberish.optional(),
  reason: z.string().nullable().optional(),
  created_at: z.string().optional(),
  active: z.boolean().optional(),
});

export const logisticsConfigSchema = z.object({
  window_days_short: numberish,
  window_days_long: numberish,
  forecast_weight_short: numberish,
  forecast_weight_long: numberish,
  safety_stock_stats_days: numberish,
  service_level_z: numberish,
  reorder_coverage_days: numberish,
  risk_horizon_days: numberish,
  dead_stock_window_days: numberish,
  dead_stock_drop_min: numberish,
  dead_stock_drop_max: numberish,
}).transform((value) => ({
  windowDaysShort: value.window_days_short,
  windowDaysLong: value.window_days_long,
  forecastWeightShort: value.forecast_weight_short,
  forecastWeightLong: value.forecast_weight_long,
  safetyStockStatsDays: value.safety_stock_stats_days,
  serviceLevelZ: value.service_level_z,
  reorderCoverageDays: value.reorder_coverage_days,
  riskHorizonDays: value.risk_horizon_days,
  deadStockWindowDays: value.dead_stock_window_days,
  deadStockDropMin: value.dead_stock_drop_min,
  deadStockDropMax: value.dead_stock_drop_max,
}));

export const dailyResponseSchema = z.array(dailyRowSchema);
export const riskResponseSchema = z.array(riskRowSchema);
export const reorderResponseSchema = z.array(reorderRowSchema);
export const purchaseOrdersResponseSchema = z.array(purchaseOrderSchema);
