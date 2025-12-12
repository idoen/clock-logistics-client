<template>
  <section class="space-y-2">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Risk 60D</h2>
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
  { key: 'days_until_rop', label: 'days_until_rop' },
  { key: 'at_risk_60d', label: 'at_risk_60d' },
  { key: 'forecast_daily_sales', label: 'forecast_daily_sales' },
  { key: 'available', label: 'available' },
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
