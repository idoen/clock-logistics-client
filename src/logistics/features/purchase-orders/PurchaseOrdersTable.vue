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
  { key: 'product_id', label: 'product_id' },
  { key: 'qty_ordered', label: 'qty_ordered' },
  { key: 'order_date', label: 'order_date' },
  { key: 'expected_arrival', label: 'expected_arrival' },
  { key: 'status', label: 'status' },
  { key: 'created_at', label: 'created_at' },
];
</script>
