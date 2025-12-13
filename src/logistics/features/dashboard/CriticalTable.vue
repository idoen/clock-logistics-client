<template>
  <section class="space-y-2">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Critical – מתחת/קרוב ROP</h2>
        <p class="text-sm text-slate-600">מוצרים שנמצאים מתחת או קרוב ל-ROP (Reorder Point) ומשפיעים על זמינות. הדגש הוא על final_status כדי לשקף התאמות לוגיקה עתידיות.</p>
      </div>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-final_status="{ row }">
          <StatusPill :status="row.final_status" />
        </template>
        <template #cell-forecast="{ row }">
          <div class="leading-tight">
            <div>{{ formatNumber(row.forecast_daily_sales, 1) }}</div>
            <div class="text-xs text-slate-500">avg: {{ formatNumber(row.avg_daily_sales, 1) }}</div>
          </div>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex flex-wrap gap-2">
            <button class="btn primary" @click="$emit('action', { productId: row.product_id, mode: 'po' })">
              Order
            </button>
            <button class="btn" @click="$emit('action', { productId: row.product_id, mode: 'override' })">Override</button>
            <button class="btn" @click="$emit('action', { productId: row.product_id, mode: 'inventory' })">Inventory</button>
          </div>
        </template>
      </DataTable>
    </AsyncState>
  </section>
</template>

<script setup lang="ts">
import DataTable from '../../../shared/ui/DataTable.vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import StatusPill from '../../../shared/ui/StatusPill.vue';
import { formatNumber } from '../../../shared/utils/format';
import type { DailyRow } from '../../domain/types';

defineProps<{ rows: DailyRow[]; loading: boolean; error: string | null }>();

defineEmits<{
  (e: 'action', payload: { productId: number; mode: 'po' | 'override' | 'inventory' }): void;
}>();

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Name' },
  { key: 'final_status', label: 'Final Status' },
  { key: 'available', label: 'Available' },
  { key: 'rop_units', label: 'ROP Units' },
  { key: 'lead_time_days', label: 'Lead time (days)' },
  { key: 'forecast', label: 'Forecast / Avg' },
  { key: 'pack_size', label: 'Pack size' },
  { key: 'min_order_qty', label: 'Min order qty' },
  { key: 'actions', label: 'Actions' },
];
</script>

<style scoped>
.btn {
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.875rem;
}
.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
}
</style>
