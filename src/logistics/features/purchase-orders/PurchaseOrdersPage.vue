<template>
  <div class="page-stack">
    <h2 class="section-title">Purchase Orders</h2>
    <p class="section-description">
      This report shows all the purchase orders that have been created. You can track their status and expected arrival dates.
    </p>
    <PurchaseOrdersTable :rows="rows" :loading="loading" :error="error" />
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

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-description {
  color: #475569;
  line-height: 1.6;
}
</style>
