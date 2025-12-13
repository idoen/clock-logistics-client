import httpClient from '../../shared/http/httpClient';
import {
  createPurchaseOrderResponseSchema,
  dailyResponseSchema,
  inventoryResponseSchema,
  overrideResponseSchema,
  purchaseOrdersResponseSchema,
  reorderResponseSchema,
  riskResponseSchema,
} from '../domain/schemas';

export async function fetchDaily(status?: string) {
  const params = status ? { status } : undefined;
  const { data } = await httpClient.get('/api/logistics/daily', { params });
  return dailyResponseSchema.parse(data);
}

export async function fetchRisk60d() {
  const { data } = await httpClient.get('/api/logistics/risk60d');
  return riskResponseSchema.parse(data);
}

export async function fetchReorder() {
  const { data } = await httpClient.get('/api/logistics/reorder');
  return reorderResponseSchema.parse(data);
}

export async function fetchPurchaseOrders() {
  const { data } = await httpClient.get('/api/purchase-orders');
  return purchaseOrdersResponseSchema.parse(data);
}

export async function createPurchaseOrder(payload: { productId: number; qtyOrdered: number; expectedArrival: string }) {
  const { data } = await httpClient.post('/api/purchase-orders', payload);
  return createPurchaseOrderResponseSchema.parse(data);
}

export async function updateInventory(productId: number, payload: { onHand: number; reserved: number; inTransit: number }) {
  const { data } = await httpClient.patch(`/api/inventory/${productId}`, payload);
  return inventoryResponseSchema.parse(data);
}

export async function createOverride(payload: { productId: number; overrideRopUnits?: number | null; overrideOrderQty?: number | null; reason?: string | null }) {
  const { data } = await httpClient.post('/api/overrides', payload);
  return overrideResponseSchema.parse(data);
}

export async function disableOverride(id: number) {
  const { data } = await httpClient.patch(`/api/overrides/${id}/disable`, {});
  return overrideResponseSchema.parse(data);
}
