import httpClient from '../../shared/http/httpClient';
import {
  createPurchaseOrderResponseSchema,
  dailyResponseSchema,
  inventoryResponseSchema,
  logisticsConfigSchema,
  overrideResponseSchema,
  purchaseOrdersResponseSchema,
  reorderResponseSchema,
  riskResponseSchema,
} from '../domain/schemas';
import type { LogisticsConfig } from '../domain/types';

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

export async function fetchLogisticsConfig() {
  const { data } = await httpClient.get('/api/logistics-config');
  return logisticsConfigSchema.parse(data);
}

export async function updateLogisticsConfig(payload: Partial<LogisticsConfig>) {
  const mappedPayload = mapLogisticsConfigPayload(payload);
  const { data } = await httpClient.patch('/api/logistics-config', mappedPayload);
  return logisticsConfigSchema.parse(data);
}

function mapLogisticsConfigPayload(payload: Partial<LogisticsConfig>) {
  return {
    window_days_short: payload.windowDaysShort,
    window_days_long: payload.windowDaysLong,
    forecast_weight_short: payload.forecastWeightShort,
    forecast_weight_long: payload.forecastWeightLong,
    safety_stock_stats_days: payload.safetyStockStatsDays,
    service_level_z: payload.serviceLevelZ,
    reorder_coverage_days: payload.reorderCoverageDays,
    risk_horizon_days: payload.riskHorizonDays,
    dead_stock_window_days: payload.deadStockWindowDays,
    dead_stock_drop_min: payload.deadStockDropMin,
    dead_stock_drop_max: payload.deadStockDropMax,
  };
}
