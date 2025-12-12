import type { z } from 'zod'
import {
  dailyRowSchema,
  riskRowSchema,
  reorderRowSchema,
  purchaseOrderSchema,
  overrideSchema,
  inventorySchema,
} from './schemas'

export type DailyRow = z.infer<typeof dailyRowSchema>
export type RiskRow = z.infer<typeof riskRowSchema>
export type ReorderRow = z.infer<typeof reorderRowSchema>
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>
export type Override = z.infer<typeof overrideSchema>
export type Inventory = z.infer<typeof inventorySchema>
