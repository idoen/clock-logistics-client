import type {
  dailyRowSchema,
  riskRowSchema,
  reorderRowSchema,
  purchaseOrderSchema,
  inventorySchema,
  overrideSchema,
} from "./schemas";
import { z } from "zod";

export type DailyRow = z.infer<typeof dailyRowSchema>;
export type RiskRow = z.infer<typeof riskRowSchema>;
export type ReorderRow = z.infer<typeof reorderRowSchema>;
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;
export type InventoryPayload = z.infer<typeof inventorySchema>;
export type OverridePayload = z.infer<typeof overrideSchema>;
