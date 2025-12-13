<template>
  <div class="page-stack">
    <section class="intro">
      <div class="intro-text">
        <p class="eyebrow">דוח יומי – מבט מהיר</p>
        <h2>כל מה שמנהל לוגיסטיקה צריך במסך אחד</h2>
        <p>
          הדוח מסכם עבורך את מצב הפריטים לפי סטטוס לוגיסטי, מוסיף חיזוי ביקוש מול ממוצע היסטורי ומסמן איפה יש סיכון ב־60 הימים
          הקרובים. בכל שורה תראה את ההמלצה הבאה: להזמין, לבצע Override או לעדכן מלאי.
        </p>
        <p class="rop-note">
          ROP (Reorder Point) הוא נקודת ההזמנה מחדש: כשמגיעים אליה צריך לתכנן משלוח כדי לא להיתקע בלי מלאי. אם מספר הימים קטן או
          שלילי, זה סימן לפעול עכשיו.
        </p>
      </div>
      <div class="intro-cards">
        <div class="card">
          <h3>Risk 60D</h3>
          <p>מיון לפי כמה ימים נשארו עד נקודת ההזמנה. ערך שלילי אומר שכבר עברנו את הרף וצריך להזמין מיד.</p>
        </div>
        <div class="card">
          <h3>Critical</h3>
          <p>פריטים שהגיעו או קרובים ל־ROP, עם זמני אספקה, גודל אריזה והזמנה מינימלית כדי לקבל החלטה מהירה.</p>
        </div>
        <div class="card">
          <h3>Dead Stock</h3>
          <p>ירידה חדה בקצב מכירה (כולל סימון demo של ~50%). מאפשר קפיצה לפעולות ידניות.</p>
        </div>
      </div>
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
      :initial-tab="initialTab"
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
const initialTab = ref<'po' | 'override' | 'inventory'>('po');

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
  gap: 1.5rem;
}

.intro {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
}

.intro-text h2 {
  margin: 0.15rem 0 0.35rem 0;
  font-size: 1.3rem;
}

.intro-text p {
  margin: 0.25rem 0;
  color: #334155;
  line-height: 1.5;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #0ea5e9;
  margin: 0;
  font-size: 0.75rem;
}

.intro-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.card {
  padding: 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.card h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.card p {
  margin: 0;
  color: #475569;
}

.rop-note {
  margin-top: 0.35rem;
  padding: 0.65rem 0.75rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #0f172a;
  line-height: 1.5;
}

@media (min-width: 900px) {
  .intro {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
    padding: 1.25rem 1.5rem;
  }

  .intro-text h2 {
    font-size: 1.5rem;
  }
}
</style>
