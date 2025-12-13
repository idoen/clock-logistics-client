<template>
  <section class="space-y-2">
    <h2 class="text-lg font-semibold">Purchase Orders</h2>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows" />
    </AsyncState>
  </section>
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
  { key: 'id', label: 'ID', dir: 'ltr' },
  { key: 'product_id', label: 'product_id', dir: 'ltr' },
  { key: 'qty_ordered', label: 'qty_ordered', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'order_date', label: 'order_date', formatter: (v: unknown) => formatDateTime(v as string), dir: 'ltr' },
  { key: 'expected_arrival', label: 'expected_arrival', formatter: (v: unknown) => formatDate(v as string), dir: 'ltr' },
  { key: 'status', label: 'status', dir: 'ltr' },
  { key: 'created_at', label: 'created_at', formatter: (v: unknown) => formatDateTime(v as string), dir: 'ltr' },
];
</script>
