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
import StatusPill from '../../../shared/ui/StatusPill.vue';
import { formatNumber } from '../../../shared/utils/format';
import { useTableSort, type SortableColumn } from '../../../shared/utils/tableSort';
import type { DailyRow } from '../../domain/types';

const props = defineProps<{ rows: DailyRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number }): void }>();

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
    key: 'forecast_daily_sales',
    label: 'חיזוי יומי',
    info: 'כמה יחידות צפויות להימכר ביום',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'on_hand',
    label: 'במחסן עכשיו',
    info: 'כולל קרטונים פתוחים',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'in_transit',
    label: 'בדרך',
    info: 'משלוחים פתוחים',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  { key: 'actions', label: 'פעולות', info: 'פתיחת המלצות', dir: 'ltr' },
];

const rowsRef = computed(() => props.rows);

const { sortKey, sortDir, sortedRows, setSort } = useTableSort(
  rowsRef,
  columns as SortableColumn<DailyRow>[],
  'sku',
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
</style>
