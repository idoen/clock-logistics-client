<template>
  <section class="space-y-2">
    <div>
      <h2 class="text-lg font-semibold">Dead Stock – ירידה חדה בקצב מכירה</h2>
      <p class="text-sm text-slate-600">
        פריטים מסומנים כמלאי מת כאשר המכירות ירדו משמעותית (דמו כולל ~50% ירידה). מומלץ לבצע פעולות שחרור מלאי או
        התאמות מלאי לפני שווי ערך נשחק.
      </p>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-final_status="{ row }">
          <StatusPill :status="row.final_status" />
        </template>
        <template #cell-actions="{ row }">
          <div class="flex flex-wrap gap-2">
            <button class="btn" @click="$emit('action', { productId: row.product_id })">Actions</button>
          </div>
        </template>
      </DataTable>
    </AsyncState>
  </section>
</template>

<script setup lang="ts">
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import StatusPill from '../../../shared/ui/StatusPill.vue';
import type { DailyRow } from '../../domain/types';

defineProps<{ rows: DailyRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Name' },
  { key: 'final_status', label: 'Final Status' },
  { key: 'available', label: 'Available' },
  { key: 'forecast_daily_sales', label: 'Forecast daily sales' },
  { key: 'on_hand', label: 'On hand' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'actions', label: 'Actions' },
];
</script>

<style scoped>
.btn {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}
</style>
