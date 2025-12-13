<template>
  <section class="space-y-2">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Risk 60D</h2>
        <p class="text-xs text-slate-600">
          זיהוי פריטים שיגיעו ל־ROP בתוך 60 יום. ערך days_until_rop שלילי = דחוף, כדאי לבצע פעולה מידית.
        </p>
      </div>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-days_until_rop="{ row }">
          <span :class="row.days_until_rop < 0 ? 'text-red-600 font-semibold' : ''">{{ row.days_until_rop }}</span>
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
import type { RiskRow } from '../../domain/types';

defineProps<{ rows: RiskRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'days_until_rop', label: 'Days until ROP' },
  { key: 'at_risk_60d', label: 'At risk (60d)' },
  { key: 'forecast_daily_sales', label: 'Forecast daily sales' },
  { key: 'available', label: 'Available' },
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
