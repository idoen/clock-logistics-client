<template>
  <div class="page-stack">
    <section class="intro">
      <div>
        <p class="eyebrow">Reorder</p>
        <h2>המלצות הזמנה מותאמות Lead Time, Pack Size ו־Min Order</h2>
        <p class="help">ברירת המחדל מציגה רק הצעות עם recommended_order_qty > 0. ניתן לפתוח פעולות PO/Override/Inventory מכל שורה.</p>
      </div>
    </section>
    <ReorderTable
      :rows="rows"
      :loading="loading"
      :error="error"
      :daily-map="dailyMap"
      @order="openDrawer($event.productId, 'po', $event.qty, $event.arrival ?? undefined)"
      @override="(id) => openDrawer(id, 'override')"
      @inventory="(id) => openDrawer(id, 'inventory')"
    />
    <ProductActionsDrawer
      v-if="drawerOpen && selectedProductId !== null"
      :open="drawerOpen"
      :product-id="selectedProductId"
      :title="drawerTitle"
      :default-qty="defaultQty"
      :default-arrival="defaultArrival"
      :initial-tab="initialTab"
      variant="modal"
      @close="drawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDailyReport } from '../../queries/useDailyReport';
import { useReorder } from '../../queries/useReorder';
import ReorderTable from './ReorderTable.vue';
import ProductActionsDrawer from '../product-actions/ProductActionsDrawer.vue';

const reorderQuery = useReorder();
const dailyAllQuery = useDailyReport();

const rows = computed(() => reorderQuery.data.value ?? []);
const loading = computed(() => reorderQuery.isLoading.value);
const error = computed(() => (reorderQuery.error.value ? reorderQuery.error.value.message : null));

const dailyMap = computed<Record<number, import('../../domain/types').DailyRow>>(() => {
  const map: Record<number, import('../../domain/types').DailyRow> = {};
  (dailyAllQuery.data.value ?? []).forEach((row) => {
    map[row.product_id] = row;
  });
  return map;
});

const drawerOpen = ref(false);
const selectedProductId = ref<number | null>(null);
const drawerTitle = ref('');
const defaultQty = ref<number | undefined>(undefined);
const defaultArrival = ref<string | undefined>(undefined);
const initialTab = ref<'po' | 'override' | 'inventory'>('po');

function openDrawer(productId: number, tab: 'po' | 'override' | 'inventory', qty?: number, arrival?: string) {
  selectedProductId.value = productId;
  drawerTitle.value = `Product ${productId}`;
  defaultQty.value = qty;
  defaultArrival.value = arrival;
  initialTab.value = tab;
  drawerOpen.value = true;
}
</script>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.intro {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.intro h2 {
  margin: 0.1rem 0 0.3rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0ea5e9;
  font-weight: 700;
  margin: 0;
  font-size: 0.8rem;
}

.help {
  margin: 0;
  color: #475569;
}
</style>
