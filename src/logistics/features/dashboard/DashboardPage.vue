<template>
  <div class="space-y-6">
    <section class="space-y-2">
      <h1 class="text-2xl font-semibold">Logistics Dashboard</h1>
      <p class="text-sm text-slate-700">
        תמונת מצב מלאה: חיזוי מכירות מול מלאי, זיהוי סיכון 60 יום, ופעולות מיידיות לכל מוצר. הנתונים מבוססים על
        final_status והחיזוי מה־API כדי להדגיש מוקדי סיכון אמיתיים.
      </p>
      <p class="text-xs text-slate-600">
        הסבר קצר: ROP (Reorder Point) מחושב מול הביקוש החזוי ו־lead time. ערכים שליליים ב־days_until_rop מצביעים על צורך
        דחוף; DEAD_STOCK מופיע כשקצב המכירות נחתך משמעותית.
      </p>
    </section>
    <Risk60dWidget :rows="riskRows" :loading="riskLoading" :error="riskError" @action="openDrawer($event.productId)" />
    <CriticalTable
      :rows="criticalRows"
      :loading="criticalLoading"
      :error="criticalError"
      @action="onCriticalAction"
    />
    <DeadStockTable
      :rows="deadRows"
      :loading="deadLoading"
      :error="deadError"
      @action="(payload) => openDrawer(payload.productId)"
    />
    <ProductActionsDrawer
      v-if="drawerOpen && selectedProductId !== null"
      :open="drawerOpen"
      :product-id="selectedProductId"
      :title="drawerTitle"
      @close="drawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDailyReport } from '../../queries/useDailyReport';
import { useRisk60d } from '../../queries/useRisk60d';
import CriticalTable from './CriticalTable.vue';
import DeadStockTable from './DeadStockTable.vue';
import Risk60dWidget from './Risk60dWidget.vue';
import ProductActionsDrawer from '../product-actions/ProductActionsDrawer.vue';

const criticalQuery = useDailyReport('CRITICAL');
const deadQuery = useDailyReport('DEAD_STOCK');
const riskQuery = useRisk60d();

const criticalRows = computed(() => (criticalQuery.data.value ?? []).filter((row) => row.final_status === 'CRITICAL'));
const deadRows = computed(() => (deadQuery.data.value ?? []).filter((row) => row.final_status === 'DEAD_STOCK'));
const riskRows = computed(() => riskQuery.data.value ?? []);

const criticalLoading = computed(() => criticalQuery.isLoading.value);
const criticalError = computed(() => criticalQuery.error.value ? criticalQuery.error.value.message : null);
const deadLoading = computed(() => deadQuery.isLoading.value);
const deadError = computed(() => deadQuery.error.value ? deadQuery.error.value.message : null);
const riskLoading = computed(() => riskQuery.isLoading.value);
const riskError = computed(() => riskQuery.error.value ? riskQuery.error.value.message : null);

const drawerOpen = ref(false);
const selectedProductId = ref<number | null>(null);
const drawerTitle = ref('');

function openDrawer(productId: number, title?: string) {
  selectedProductId.value = productId;
  drawerTitle.value = title ?? `Product ${productId}`;
  drawerOpen.value = true;
}

function onCriticalAction(payload: { productId: number; mode: 'po' | 'override' | 'inventory' }) {
  openDrawer(payload.productId);
}
</script>
