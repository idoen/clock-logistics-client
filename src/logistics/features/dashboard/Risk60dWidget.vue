<template>
  <AsyncState :loading="loading" :error="error">
    <DataTable
      :columns="columns"
      :rows="sortedRows"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="setSort"
    >
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
import { computed } from 'vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import { formatDaysWithHours, formatNumber } from '../../../shared/utils/format';
import { useTableSort } from '../../../shared/utils/tableSort';
import type { RiskRow } from '../../domain/types';

const props = defineProps<{ rows: RiskRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

type ColumnDef = {
  key: string;
  label: string;
  info?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: RiskRow) => unknown;
  sortable?: boolean;
  sortValue?: (row: RiskRow) => string | number | null | undefined;
};

const columns: ColumnDef[] = [
  { key: 'sku', label: 'מק"ט', info: 'קוד הפריט (SKU)', dir: 'ltr', sortable: true },
  { key: 'days_until_rop', label: 'ימים עד ROP', info: 'כמה זמן נשאר להזמנה', dir: 'rtl', sortable: true },
  {
    key: 'at_risk_60d',
    label: 'בסיכון ל-60 יום',
    info: 'היקף חסר צפוי',
    dir: 'ltr',
    sortable: true,
    sortValue: (row) => (row.at_risk_60d ? 0 : 1),
  },
  {
    key: 'forecast_daily_sales',
    label: 'חיזוי יומי',
    info: 'כמה יחידות צפויות להימכר ביום',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'available',
    label: 'זמין במלאי',
    info: 'יחידות על המדף',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  { key: 'actions', label: 'פעולות', info: 'פתיחת המלצות', dir: 'ltr', sortable: false },
];

const rowsRef = computed(() => props.rows);

const { sortKey, sortDir, sortedRows, setSort } = useTableSort(
  rowsRef,
  columns,
  'days_until_rop',
);
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
