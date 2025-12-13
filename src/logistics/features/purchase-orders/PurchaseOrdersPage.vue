<template>
  <div>
    <PurchaseOrdersTable
      :rows="rows"
      :loading="loading"
      :error="error"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePurchaseOrders } from '../../queries/usePurchaseOrders';
import PurchaseOrdersTable from './PurchaseOrdersTable.vue';

const query = usePurchaseOrders();
const rows = computed(() => query.data.value ?? []);
const loading = computed(() => query.isLoading.value);
const error = computed(() => (query.error.value ? query.error.value.message : null));
</script>
