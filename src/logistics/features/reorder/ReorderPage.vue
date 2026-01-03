<template>
  <div class="page-stack">
    <section class="intro">
      <div>
        <h2>הזמן מחדש</h2>
        <p>דוח זה מציג המלצות להזמנה מחדש של פריטים, על בסיס רמות מלאי, זמני הובלה, ויעדי מכירות.</p>
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
