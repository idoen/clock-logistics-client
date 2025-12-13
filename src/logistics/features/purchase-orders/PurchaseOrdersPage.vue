<template>
  <div class="space-y-4">
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-semibold mb-2">הזמנות שבוצעו</h2>
      <p class="text-sm text-slate-700">ריכוז כל ההזמנות שנוצרו במערכת, כולל תאריך הזמנה ותאריך הגעה צפוי. ניתן לעקוב בקלות אחר הסטטוס גם מהמובייל.</p>
    </section>
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
