<template>
  <div class="page-stack">
    <div class="page-actions">
      <button type="button" class="settings-icon-button" aria-label="הגדרות טכניות" @click="settingsOpen = true">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M19.14 12.94a7.73 7.73 0 0 0 .05-.94 7.73 7.73 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.62 7.62 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.62 7.62 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.7 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.73 7.73 0 0 0-.05.94 7.73 7.73 0 0 0 .05.94L2.82 14.52a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.4 1.04.73 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.59-.21 1.13-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
          />
        </svg>
      </button>
    </div>
    <section class="intro">
      <div class="intro-text">
        <h2>דו״ח יומי עדכני- מבט מהיר</h2>
        <p>
          הדו״ח מסכם עבורך את מצב הפריטים לפי סטטוס לוגיסטי, מוסיף חיזוי ביקוש מול ממוצע היסטורי ומסמן איפה יש סיכון ב-60 הימים הקרובים. בכל שורה תראה את ההמלצה הבאה: להזמין, לבצע Override או לעדכן מלאי.
        </p>
      </div>
      <div class="pie-chart-wrapper">
        <StatusPieChart :risk="riskCount" :critical="criticalCount" :dead-stock="deadStockCount" />
      </div>
      <div class="definitions">
        <div class="def-item rop-note">
          <h4>Reorder Point (ROP)</h4>
          <p>
            (Reorder Point) ROP הוא נקודת ההזמנה מחדש: כשמגיעים אליה צריך לתכנן משלוח כדי לא להיתקע בלי מלאי. אם מספר הימים קטן או שלילי, זה סימן לפעול עכשיו.
          </p>
        </div>
        <div class="def-item">
          <h4>Risk 60D</h4>
          <p>מיון לפי כמה ימים נשארו עד נקודת ההזמנה. ערך שלילי אומר שכבר עברנו את הרף וצריך להזמין מיד.</p>
        </div>
        <div class="def-item">
          <h4>Critical</h4>
          <p>פריטים שהגיעו או קרובים ל-ROP, עם זמני אספקה, גודל אריזה והזמנה מינימלית כדי לקבל החלטה מהירה.</p>
        </div>
        <div class="def-item">
          <h4>Dead Stock</h4>
          <p>ירידה חדה בקצב מכירה (כולל סימון demo של ~50%). מאפשר קפיצה לפעולות ידניות.</p>
        </div>
      </div>
    </section>

    <ClosableSection title="Risk (60 days)">
      <Risk60dWidget :rows="riskRows" :loading="riskLoading" :error="riskError" @action="openDrawer($event.productId)" />
    </ClosableSection>

    <ClosableSection title="Critical">
      <CriticalTable
        :rows="criticalRows"
        :loading="criticalLoading"
        :error="criticalError"
        @action="onCriticalAction"
      />
    </ClosableSection>

    <ClosableSection title="Dead Stock">
      <DeadStockTable
        :rows="deadRows"
        :loading="deadLoading"
        :error="deadError"
        @action="(payload) => openDrawer(payload.productId)"
      />
    </ClosableSection>

    <ProductActionsDrawer
      v-if="drawerOpen && selectedProductId !== null"
      :open="drawerOpen"
      :product-id="selectedProductId"
      :title="drawerTitle"
      :initial-tab="initialTab"
      @close="drawerOpen = false"
    />

    <LogisticsConfigPanel :open="settingsOpen" @close="settingsOpen = false" />
  </div>
</template>

<script setup lang="ts">
// script content is the same
import { computed, ref } from 'vue';
import { useDailyReport } from '../../queries/useDailyReport';
import { useRisk60d } from '../../queries/useRisk60d';
import CriticalTable from './CriticalTable.vue';
import DeadStockTable from './DeadStockTable.vue';
import LogisticsConfigPanel from './LogisticsConfigPanel.vue';
import Risk60dWidget from './Risk60dWidget.vue';
import ProductActionsDrawer from '../product-actions/ProductActionsDrawer.vue';
import ClosableSection from '../../../shared/ui/ClosableSection.vue';
import StatusPieChart from './StatusPieChart.vue';

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

const criticalCount = computed(() => criticalRows.value.length);
const deadStockCount = computed(() => deadRows.value.length);
const riskCount = computed(() => riskRows.value.length);

const drawerOpen = ref(false);
const selectedProductId = ref<number | null>(null);
const drawerTitle = ref('');
const initialTab = ref<'po' | 'override' | 'inventory'>('po');
const settingsOpen = ref(false);

function openDrawer(productId: number, tab: 'po' | 'override' | 'inventory' = 'po', title?: string) {
  selectedProductId.value = productId;
  drawerTitle.value = title ?? `Product ${productId}`;
  initialTab.value = tab;
  drawerOpen.value = true;
}

function onCriticalAction(payload: { productId: number; name?: string }) {
  openDrawer(payload.productId, 'po', payload.name);
}
</script>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.page-actions {
  display: flex;
  justify-content: flex-end;
}

.settings-icon-button {
  border: none;
  background: #ffffff;
  color: #0ea5e9;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.settings-icon-button svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.settings-icon-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(14, 165, 233, 0.2);
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(145deg, #e6f7ff, #d0e7ff);
  border: 1px solid #cce7ff;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.intro-text {
  text-align: right;
}

.intro-text h2 {
  margin: 0 0 0.75rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1a2b47;
}

.intro-text p {
  color: #475569;
  line-height: 1.6;
  max-width: 60ch;
}

.pie-chart-wrapper {
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  margin: 0 auto;
}

.definitions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 280px;
}

.def-item {
  background: #e6f7ff;
  border: 1px solid #cce7ff;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.9rem;
  color: #1e293b;
  text-align: right;
}

.def-item h4 {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  color: #0f172a;
}

.def-item p {
  margin: 0;
  line-height: 1.5;
  color: #475569;
}

@media (min-width: 1024px) {
  .intro {
    flex-direction: row;
    align-items: center;
    gap: 2.5rem;
    padding: 2rem 2.5rem;
  }

  .intro-text {
    flex: 1 1 30%;
    text-align: right;
  }
  
  .intro-text p {
    max-width: none;
    margin: 0;
  }

  .pie-chart-wrapper {
    flex: 1 1 40%;
    margin: 0;
    max-width: none;
  }

  .definitions {
    flex: 1 1 30%;
  }
}
</style>
