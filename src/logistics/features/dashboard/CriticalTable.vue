<template>
  <AsyncState :loading="loading" :error="error">
    <DataTable
      :columns="columns"
      :rows="sortedRows"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="setSort"
    >
      <template #cell-final_status="{ row }">
        <StatusPill :status="row.final_status" />
      </template>
      <template #cell-forecast="{ row }">
        <div class="forecast">
          <div>{{ formatNumber(row.forecast_daily_sales) }}</div>
          <div class="forecast-hint">avg: {{ formatNumber(row.avg_daily_sales) }}</div>
        </div>
      </template>
      <template #cell-actions="{ row }">
        <button class="btn" @click="$emit('action', { productId: row.product_id, name: row.name })">פעולות</button>
      </template>
    </DataTable>
  </AsyncState>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import StatusPill from '../../../shared/ui/StatusPill.vue';
import { formatNumber } from '../../../shared/utils/format';
import { useTableSort, type SortableColumn } from '../../../shared/utils/tableSort';
import type { DailyRow } from '../../domain/types';

const props = defineProps<{ rows: DailyRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number; name?: string }): void }>();

type ColumnDef = {
  key: string;
  label: string;
  info?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: DailyRow) => unknown;
  sortable?: boolean;
  sortValue?: (row: DailyRow) => string | number | null | undefined;
};

const columns: ColumnDef[] = [
  { key: 'sku', label: 'מק"ט', info: 'קוד הפריט (SKU)', dir: 'ltr', sortable: true },
  { key: 'name', label: 'שם פריט', info: 'איך הוא מופיע במחסן', dir: 'auto', sortable: true },
  { key: 'final_status', label: 'סטטוס סופי', info: 'דחיפות פעולה', dir: 'ltr', sortable: true },
  {
    key: 'available',
    label: 'זמין במלאי',
    info: 'יחידות על המדף',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'rop_units',
    label: 'ROP ביחידות',
    info: 'רף הזמנה מחדש',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'lead_time_days',
    label: 'זמן אספקה',
    info: 'Lead time (ימים)',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'forecast',
    label: 'חיזוי מול ממוצע',
    info: 'קצב יומי',
    dir: 'ltr',
    sortable: true,
    sortValue: (row) => row.forecast_daily_sales,
  },
  {
    key: 'pack_size',
    label: 'גודל אריזה',
    info: 'יחידות בכל קרטון',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'min_order_qty',
    label: 'כמות הזמנה מינימלית',
    info: 'מגבלת ספק',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  { key: 'actions', label: 'פעולות', info: 'פתיחת המלצות', dir: 'ltr', sortable: false },
];

const rowsRef = computed(() => props.rows);

const { sortKey, sortDir, sortedRows, setSort } = useTableSort(
  rowsRef,
  columns as SortableColumn<DailyRow>[],
  'sku',
);
</script>

<style scoped>
.forecast-hint {
  font-size: 0.8rem;
  color: #64748b;
}

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
