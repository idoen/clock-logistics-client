<template>
  <AsyncState :loading="loading" :error="error">
    <DataTable :columns="columns" :rows="rows">
      <template #cell-days_until_rop="{ row }">
        <span dir="rtl" class="rtl-days" :class="row.days_until_rop < 0 ? 'danger' : ''">
          {{ formatDaysWithHours(row.days_until_rop) }}
        </span>
      </template>
      <template #cell-actions="{ row }">
        <button class="btn" @click="$emit('action', { productId: row.product_id })">פעולות</button>
      </template>
    </DataTable>
  </AsyncState>
</template>

<script setup lang="ts">
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import { formatDaysWithHours, formatNumber } from '../../../shared/utils/format';
import type { RiskRow } from '../../domain/types';

defineProps<{ rows: RiskRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

type ColumnDef = {
  key: string;
  label: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: RiskRow) => unknown;
};

const columns: ColumnDef[] = [
  { key: 'sku', label: 'מק"ט', info: 'קוד הפריט (SKU)', dir: 'ltr' },
  { key: 'days_until_rop', label: 'ימים עד ROP', info: 'כמה זמן נשאר להזמנה', dir: 'rtl' },
  { key: 'at_risk_60d', label: 'בסיכון ל-60 יום', info: 'היקף חסר צפוי', dir: 'ltr' },
  {
    key: 'forecast_daily_sales',
    label: 'חיזוי יומי',
    info: 'כמה יחידות צפויות להימכר ביום',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
  },
  { key: 'available', label: 'זמין במלאי', info: 'יחידות על המדף', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
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
