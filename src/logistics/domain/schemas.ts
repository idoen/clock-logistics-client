import { z } from 'zod'

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
  min_order_qty: z.number(),
  pack_size: z.number(),
  is_dead_stock: z.boolean(),
  final_status: z.string(),
})

export const riskRowSchema = z.object({
  product_id: z.number(),
  sku: z.string(),
  final_status: z.string(),
  available: z.number(),
  rop_units: z.number(),
  forecast_daily_sales: z.number(),
  days_until_rop: z.number(),
  at_risk_60d: z.boolean(),
})

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
})

export const purchaseOrderSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  qty_ordered: z.number(),
  order_date: z.string(),
  expected_arrival: z.string(),
  status: z.string(),
  created_at: z.string(),
})

export const overrideSchema = z.object({
  id: z.number(),
  productId: z.number(),
  overrideRopUnits: z.number().nullable().optional(),
  overrideOrderQty: z.number().nullable().optional(),
  reason: z.string().nullable().optional(),
})

export const inventorySchema = z.object({
  productId: z.number(),
  onHand: z.number(),
  reserved: z.number(),
  inTransit: z.number(),
})

export const createOverrideRequestSchema = z.object({
  productId: z.number(),
  overrideRopUnits: z.number().optional(),
  overrideOrderQty: z.number().optional(),
  reason: z.string().optional(),
})

export const createPurchaseOrderRequestSchema = z.object({
  productId: z.number(),
  qtyOrdered: z.number(),
  expectedArrival: z.string(),
})
