<template>
  <section class="space-y-2">
    <h2 class="text-lg font-semibold">Purchase Orders</h2>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-order_date="{ row }">{{ formatDate(row.order_date) }}</template>
        <template #cell-expected_arrival="{ row }">{{ row.expected_arrival ? formatDate(row.expected_arrival) : '—' }}</template>
        <template #cell-created_at="{ row }">{{ formatDate(row.created_at) }}</template>
      </DataTable>
    </AsyncState>
  </section>
</template>

<script setup lang="ts">
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import type { PurchaseOrder } from '../../domain/types';
import { formatDate } from '../../../shared/utils/date';

defineProps<{ rows: PurchaseOrder[]; loading: boolean; error: string | null }>();

const columns = [
  { key: 'id', label: 'PO ID' },
  { key: 'product_id', label: 'Product ID' },
  { key: 'qty_ordered', label: 'Qty ordered' },
  { key: 'order_date', label: 'Order date' },
  { key: 'expected_arrival', label: 'Expected arrival' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created at' },
];
</script>
