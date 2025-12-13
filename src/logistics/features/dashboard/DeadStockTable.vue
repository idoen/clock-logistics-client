<template>
  <section class="section">
    <div>
      <h2>Dead Stock – ירידה חדה בקצב מכירה</h2>
      <p class="help">פריטים מסומנים כמלאי מת כאשר המכירות ירדו משמעותית (דמו כולל ~50% ירידה) – קפיצה לפעולה זמינה.</p>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-final_status="{ row }">
          <StatusPill :status="row.final_status" />
        </template>
        <template #cell-actions="{ row }">
          <button class="btn" @click="$emit('action', { productId: row.product_id })">Actions</button>
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
.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section h2 {
  margin: 0;
  font-size: 1.1rem;
}

.help {
  margin: 0.25rem 0 0;
  color: #475569;
}

.btn {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}
</style>
