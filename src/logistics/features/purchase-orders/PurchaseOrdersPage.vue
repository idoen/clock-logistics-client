<template>
  <div class="page-stack">
    <section class="intro">
      <div>
        <h2>הזמנות רכש</h2>
        <p>דוח זה מציג את כל הזמנות הרכש שנוצרו. ניתן לעקוב אחר הסטטוס ותאריכי ההגעה הצפויים שלהן.</p>
      </div>
    </section>
    <ClosableSection title="Purchase Orders">
      <PurchaseOrdersTable :rows="rows" :loading="loading" :error="error" />
    </ClosableSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePurchaseOrders } from '../../queries/usePurchaseOrders';
import PurchaseOrdersTable from './PurchaseOrdersTable.vue';
import ClosableSection from '../../../shared/ui/ClosableSection.vue';

const query = usePurchaseOrders();
const rows = computed(() => query.data.value ?? []);
const loading = computed(() => query.isLoading.value);
const error = computed(() => (query.error.value ? query.error.value.message : null));
</script>
