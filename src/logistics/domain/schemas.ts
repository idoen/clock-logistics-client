import { z } from 'zod';

export const dailyRowSchema = z.object({
  product_id: z.number(),
  sku: z.string(),
  name: z.string(),
  lead_time_days: z.number(),
  avg_daily_sales: z.number(),
  forecast_daily_sales: z.number(),
  rop_units: z.number(),
  safety_stock_units: z.number(),
  on_hand: z.number(),
  reserved: z.number(),
  in_transit: z.number(),
  available: z.number(),
  status: z.string(),
  min_order_qty: z.number().nullable().optional(),
  pack_size: z.number().nullable().optional(),
  is_dead_stock: z.boolean().optional(),
  final_status: z.string(),
});

export const riskRowSchema = z.object({
  product_id: z.number(),
  sku: z.string(),
  final_status: z.string(),
  available: z.number(),
  rop_units: z.number(),
  forecast_daily_sales: z.number(),
  days_until_rop: z.number(),
  at_risk_60d: z.boolean(),
});

export const reorderRowSchema = z.object({
  product_id: z.number(),
  sku: z.string(),
  name: z.string(),
  status: z.string(),
  at_risk_60d: z.boolean(),
  days_until_rop: z.number(),
  rop_units: z.number(),
  available: z.number(),
  in_transit: z.number(),
  target_units_30d: z.number(),
  recommended_order_qty: z.number(),
});

export const createPurchaseOrderResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  qty_ordered: z.number(),
  expected_arrival: z.string(),
  status: z.string(),
  order_date: z.string(),
  created_at: z.string(),
});

export const purchaseOrderSchema = createPurchaseOrderResponseSchema;

export const inventoryResponseSchema = z.object({
  product_id: z.number(),
  on_hand: z.number(),
  reserved: z.number(),
  in_transit: z.number(),
  updated_at: z.string().optional(),
});

export const overrideResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  override_rop_units: z.number().nullable().optional(),
  override_order_qty: z.number().nullable().optional(),
  reason: z.string().nullable().optional(),
  created_at: z.string().optional(),
  active: z.boolean().optional(),
});

export const dailyResponseSchema = z.array(dailyRowSchema);
export const riskResponseSchema = z.array(riskRowSchema);
export const reorderResponseSchema = z.array(reorderRowSchema);
export const purchaseOrdersResponseSchema = z.array(purchaseOrderSchema);
