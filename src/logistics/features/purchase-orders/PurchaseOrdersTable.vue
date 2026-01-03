<template>
  <AsyncState :loading="loading" :error="error">
    <DataTable
      :columns="columns"
      :rows="sortedRows"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort="setSort"
    />
  </AsyncState>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import { formatDate, formatDateTime } from '../../../shared/utils/date';
import { formatNumber } from '../../../shared/utils/format';
import { useTableSort, type SortableColumn } from '../../../shared/utils/tableSort';
import type { PurchaseOrder } from '../../domain/types';

const props = defineProps<{ rows: PurchaseOrder[]; loading: boolean; error: string | null }>();

type ColumnDef = {
  key: string;
  label: string;
  info?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: PurchaseOrder) => unknown;
  sortable?: boolean;
  sortValue?: (row: PurchaseOrder) => string | number | null | undefined;
};

const columns: ColumnDef[] = [
  { key: 'id', label: 'מזהה', dir: 'ltr', sortable: true },
  { key: 'product_id', label: 'מזהה מוצר', dir: 'ltr', sortable: true },
  {
    key: 'qty_ordered',
    label: 'כמות מוזמנת',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'order_date',
    label: 'תאריך הזמנה',
    formatter: (v: unknown) => formatDateTime(v as string),
    dir: 'auto',
    sortable: true,
  },
  {
    key: 'expected_arrival',
    label: 'הגעה צפויה',
    formatter: (v: unknown) => formatDate(v as string),
    dir: 'auto',
    sortable: true,
  },
  { key: 'status', label: 'סטטוס', dir: 'auto', sortable: true },
  {
    key: 'created_at',
    label: 'נוצר ב',
    formatter: (v: unknown) => formatDateTime(v as string),
    dir: 'auto',
    sortable: true,
  },
];

const rowsRef = computed(() => props.rows);

const { sortKey, sortDir, sortedRows, setSort } = useTableSort(
  rowsRef,
  columns as SortableColumn<PurchaseOrder>[],
  'created_at',
  'desc',
);
</script>
