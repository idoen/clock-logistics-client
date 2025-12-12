import { httpClient, normalizeError } from '@/shared/http/httpClient'
import {
  createOverrideRequestSchema,
  createPurchaseOrderRequestSchema,
  dailyRowSchema,
  inventorySchema,
  purchaseOrderSchema,
  reorderRowSchema,
  riskRowSchema,
  overrideSchema,
} from '../domain/schemas'
import type { DailyRow, PurchaseOrder, ReorderRow, RiskRow } from '../domain/types'

export async function fetchDaily(status?: string): Promise<DailyRow[]> {
  try {
    const res = await httpClient.get('/api/logistics/daily', {
      params: status ? { status } : undefined,
    })
    return dailyRowSchema.array().parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function fetchRisk60d(): Promise<RiskRow[]> {
  try {
    const res = await httpClient.get('/api/logistics/risk60d')
    return riskRowSchema.array().parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function fetchReorder(): Promise<ReorderRow[]> {
  try {
    const res = await httpClient.get('/api/logistics/reorder')
    return reorderRowSchema.array().parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const res = await httpClient.get('/api/purchase-orders')
    return purchaseOrderSchema.array().parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createPurchaseOrder(input: {
  productId: number
  qtyOrdered: number
  expectedArrival: string
}) {
  try {
    const payload = createPurchaseOrderRequestSchema.parse(input)
    const res = await httpClient.post('/api/purchase-orders', payload)
    return purchaseOrderSchema.parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function updateInventory(productId: number, input: { onHand: number; reserved: number; inTransit: number }) {
  try {
    const payload = inventorySchema.pick({ onHand: true, reserved: true, inTransit: true }).parse(input)
    const res = await httpClient.patch(`/api/inventory/${productId}`, payload)
    return inventorySchema.parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createOverride(input: {
  productId: number
  overrideRopUnits?: number
  overrideOrderQty?: number
  reason?: string
}) {
  try {
    const payload = createOverrideRequestSchema.parse(input)
    if (!payload.overrideOrderQty && !payload.overrideRopUnits) {
      throw new Error('חייב להזין לפחות ערך אחד')
    }
    const res = await httpClient.post('/api/overrides', payload)
    return overrideSchema.parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function disableOverride(id: number) {
  try {
    const res = await httpClient.patch(`/api/overrides/${id}/disable`, {})
    return overrideSchema.parse(res.data)
  } catch (error) {
    throw normalizeError(error)
  }
}
