<template>
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
</template>

<script setup lang="ts">
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import StatusPill from '../../../shared/ui/StatusPill.vue';
import { formatNumber } from '../../../shared/utils/format';
import type { DailyRow } from '../../domain/types';

defineProps<{ rows: DailyRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

type ColumnDef = {
  key: string;
  label: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: DailyRow) => unknown;
};

const columns: ColumnDef[] = [
  { key: 'sku', label: 'מק"ט', info: 'קוד הפריט (SKU)', dir: 'ltr' },
  { key: 'name', label: 'שם פריט', info: 'איך הוא מופיע במחסן', dir: 'auto' },
  { key: 'final_status', label: 'סטטוס סופי', info: 'דחיפות פעולה', dir: 'ltr' },
  { key: 'available', label: 'זמין במלאי', info: 'יחידות על המדף', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  {
    key: 'forecast_daily_sales',
    label: 'חיזוי יומי',
    info: 'כמה יחידות צפויות להימכר ביום',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
  },
  {
    key: 'on_hand',
    label: 'במחסן עכשיו',
    info: 'כולל קרטונים פתוחים',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
  },
  { key: 'in_transit', label: 'בדרך', info: 'משלוחים פתוחים', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'actions', label: 'פעולות', info: 'פתיחת המלצות', dir: 'ltr' },
];
</script>

<style scoped>
.btn {
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}
</style>
