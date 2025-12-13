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
import type { PurchaseOrder } from '../../domain/types';

defineProps<{ rows: PurchaseOrder[]; loading: boolean; error: string | null }>();

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'product_id', label: 'Product ID' },
  { key: 'qty_ordered', label: 'Qty ordered' },
  { key: 'order_date', label: 'Order date' },
  { key: 'expected_arrival', label: 'Expected arrival' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created at' },
];
</script>
