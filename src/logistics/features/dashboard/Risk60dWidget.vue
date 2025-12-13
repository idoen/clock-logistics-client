<template>
  <section class="widget">
    <div class="widget-header">
      <div>
        <h2>Risk 60D</h2>
        <p class="hint">מיון עולה לפי days_until_rop. ערכים שליליים = URGENT (כבר מתחת/על ROP).</p>
      </div>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-days_until_rop="{ row }">
          <span dir="rtl" class="rtl-days" :class="row.days_until_rop < 0 ? 'danger' : ''">
            {{ formatDaysWithHours(row.days_until_rop) }}
          </span>
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
import { formatDaysWithHours, formatNumber } from '../../../shared/utils/format';
import type { RiskRow } from '../../domain/types';

defineProps<{ rows: RiskRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'days_until_rop', label: 'Days until ROP' },
  { key: 'at_risk_60d', label: 'At risk (60d)' },
  { key: 'forecast_daily_sales', label: 'Forecast daily sales', formatter: (v: unknown) => formatNumber(v as number) },
  { key: 'available', label: 'Available', formatter: (v: unknown) => formatNumber(v as number) },
  { key: 'actions', label: 'Actions' },
];
</script>

<style scoped>
.widget {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.hint {
  margin: 0.2rem 0 0;
  color: #475569;
}

.btn {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}

.danger {
  color: #dc2626;
  font-weight: 700;
}

.rtl-days {
  direction: rtl;
  display: inline-block;
  text-align: right;
}
</style>
