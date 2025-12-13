<template>
  <div class="space-y-5">
    <section class="space-y-2">
      <h1 class="text-2xl font-semibold">Reorder recommendations</h1>
      <p class="text-sm text-slate-700">
        התמקדות בהצעות הזמנה שמכבדות pack size ו־min order qty, עם תאריך הגעה מומלץ לפי lead time מהדוח היומי.
        כמות החודש (target_units_30d) משמשת כמצפן לחידוש מלאי מאוזן.
      </p>
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
