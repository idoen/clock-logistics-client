<template>
  <div class="space-y-4">
    <section class="space-y-2">
      <h1 class="text-2xl font-semibold">Purchase Orders</h1>
      <p class="text-sm text-slate-700">
        מעקב אחרי הזמנות שבוצעו דרך המסך או מהממשק הראשי. השתמש בתאריכי ההגעה כדי לוודא שהמלאי יתעדכן בזמן.
      </p>
    </section>
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
