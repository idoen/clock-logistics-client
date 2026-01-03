<template>
  <div class="page-stack">
    <section class="intro">
      <div>
        <h2>הזמנות רכש</h2>
        <p>דוח זה מציג את כל הזמנות הרכש שנוצרו. ניתן לעקוב אחר הסטטוס ותאריכי ההגעה הצפויים שלהן.</p>
      </div>
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

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.intro {
  background: linear-gradient(145deg, #f0f8ff, #e6f7ff);
  border: 1px solid #d0e0f0;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
}

.intro h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.intro p {
  margin: 0.5rem 0;
  color: #475569;
  line-height: 1.6;
}

</style>
