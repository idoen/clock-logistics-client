import httpClient from "../../shared/http/httpClient";
import {
  dailyResponseSchema,
  riskResponseSchema,
  reorderResponseSchema,
  purchaseOrdersResponseSchema,
  purchaseOrderSchema,
  inventorySchema,
  overrideSchema,
} from "../domain/schemas";
import type { DailyRow, RiskRow, ReorderRow, PurchaseOrder } from "../domain/types";

export async function fetchDaily(status?: string): Promise<DailyRow[]> {
  const response = await httpClient.get("/api/logistics/daily", {
    params: status ? { status } : undefined,
  });
  return dailyResponseSchema.parse(response.data);
}

export async function fetchRisk60d(): Promise<RiskRow[]> {
  const response = await httpClient.get("/api/logistics/risk60d");
  return riskResponseSchema.parse(response.data);
}

export async function fetchReorder(): Promise<ReorderRow[]> {
  const response = await httpClient.get("/api/logistics/reorder");
  return reorderResponseSchema.parse(response.data);
}

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const response = await httpClient.get("/api/purchase-orders");
  return purchaseOrdersResponseSchema.parse(response.data);
}

export async function createPurchaseOrder(payload: {
  productId: number;
  qtyOrdered: number;
  expectedArrival: string;
}): Promise<PurchaseOrder> {
  const response = await httpClient.post("/api/purchase-orders", payload);
  return purchaseOrderSchema.parse(response.data);
}

export async function updateInventory(payload: {
  productId: number;
  onHand: number;
  reserved: number;
  inTransit: number;
}) {
  const response = await httpClient.patch(`/api/inventory/${payload.productId}`,
    {
      onHand: payload.onHand,
      reserved: payload.reserved,
      inTransit: payload.inTransit,
    },
  );
  return inventorySchema.parse(response.data);
}

export async function createOverride(payload: {
  productId: number;
  overrideRopUnits?: number | null;
  overrideOrderQty?: number | null;
  reason?: string | null;
}) {
  const response = await httpClient.post("/api/overrides", payload);
  return overrideSchema.parse(response.data);
}

export async function disableOverride(id: number) {
  const response = await httpClient.patch(`/api/overrides/${id}/disable`);
  return overrideSchema.parse(response.data);
}
