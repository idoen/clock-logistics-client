import { z } from 'zod';
import {
  createPurchaseOrderResponseSchema,
  dailyRowSchema,
  inventoryResponseSchema,
  overrideResponseSchema,
  purchaseOrderSchema,
  reorderRowSchema,
  riskRowSchema,
} from './schemas';

export type DailyRow = z.infer<typeof dailyRowSchema>;
export type RiskRow = z.infer<typeof riskRowSchema>;
export type ReorderRow = z.infer<typeof reorderRowSchema>;
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;
export type CreatePurchaseOrderResponse = z.infer<typeof createPurchaseOrderResponseSchema>;
export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;
export type OverrideResponse = z.infer<typeof overrideResponseSchema>;
