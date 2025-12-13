<template>
  <div class="space-y-6">
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-semibold mb-2">סקירת מצב יומית</h2>
      <p class="text-sm text-slate-700 mb-2">הדוחות מבוססים על Views בשרת וכוללים ROP, תחזית מכירות וחלון סיכון 60 יום. התצוגה מדגישה את final_status כדי לשקף התאמות לוגיקה עתידיות (לדוגמה DEAD_STOCK).</p>
      <p class="text-sm text-slate-700">לכל מוצר ניתן לפתוח פעולות (Override / Purchase Order / Inventory) ישירות מתוך הווידג׳טים כדי לשמור על רצף עבודה מהיר.</p>
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
