<template>
  <AsyncState :loading="loading" :error="error">
    <DataTable :columns="columns" :rows="rows" />
  </AsyncState>
</template>

<script setup lang="ts">
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import { formatDate, formatDateTime } from '../../../shared/utils/date';
import { formatNumber } from '../../../shared/utils/format';
import type { PurchaseOrder } from '../../domain/types';

defineProps<{ rows: PurchaseOrder[]; loading: boolean; error: string | null }>();

type ColumnDef = {
  key: string;
  label: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: PurchaseOrder) => unknown;
};

const columns: ColumnDef[] = [
  { key: 'id', label: 'מזהה', dir: 'ltr' },
  { key: 'product_id', label: 'מזהה מוצר', dir: 'ltr' },
  { key: 'qty_ordered', label: 'כמות מוזמנת', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'order_date', label: 'תאריך הזמנה', formatter: (v: unknown) => formatDateTime(v as string), dir: 'auto' },
  { key: 'expected_arrival', label: 'הגעה צפויה', formatter: (v: unknown) => formatDate(v as string), dir: 'auto' },
  { key: 'status', label: 'סטטוס', dir: 'auto' },
  { key: 'created_at', label: 'נוצר ב', formatter: (v: unknown) => formatDateTime(v as string), dir: 'auto' },
];
</script>
