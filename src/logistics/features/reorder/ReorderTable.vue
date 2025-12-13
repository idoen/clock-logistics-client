<template>
  <section class="section">
    <div class="section-head">
      <h2>המלצות הזמנה</h2>
      <label class="filter">
        <input v-model="onlyPositive" type="checkbox" />
        הצג רק פריטים עם המלצת הזמנה חיובית
      </label>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="filteredRows">
        <template #cell-status="{ row }">
          <div class="status-pill">
            <StatusPill :status="row.status" />
            <span v-if="row.at_risk_60d" class="risk-chip">Risk60d</span>
          </div>
        </template>
        <template #cell-days_until_rop="{ row }">
          <span dir="rtl" class="rtl-days" :class="row.days_until_rop < 0 ? 'danger' : ''">
            {{ formatDaysWithHours(row.days_until_rop) }}
          </span>
        </template>
        <template #cell-pack="{ row }">
          <div class="pack-block">
            <div>Pack: {{ packSize(row.product_id) }}</div>
            <div>Min: {{ minOrder(row.product_id) }}</div>
          </div>
        </template>
        <template #cell-arrival="{ row }">
          {{ suggestedArrival(row.product_id, dailyLeadTime(row.product_id)) }}
        </template>
        <template #cell-actions="{ row }">
          <div class="actions">
            <button
              class="btn primary"
              @click="$emit('order', {
                productId: row.product_id,
                qty: row.recommended_order_qty,
                arrival: suggestedArrival(row.product_id, dailyLeadTime(row.product_id), false),
              })"
            >
              Mark as ordered
            </button>
            <button class="btn" @click="$emit('override', row.product_id)">Override…</button>
            <button class="btn" @click="$emit('inventory', row.product_id)">Inventory…</button>
          </div>
        </template>
      </DataTable>
    </AsyncState>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import DataTable from '../../../shared/ui/DataTable.vue';
import StatusPill from '../../../shared/ui/StatusPill.vue';
import type { DailyRow, ReorderRow } from '../../domain/types';
import { addDays, formatDate } from '../../../shared/utils/date';
import { formatDaysWithHours, formatNumber } from '../../../shared/utils/format';

const props = defineProps<{
  rows: ReorderRow[];
  loading: boolean;
  error: string | null;
  dailyMap: Record<number, DailyRow>;
}>();

defineEmits<{
  (e: 'order', payload: { productId: number; qty: number; arrival?: string | null }): void;
  (e: 'override', productId: number): void;
  (e: 'inventory', productId: number): void;
}>();

const onlyPositive = ref(true);

const filteredRows = computed(() =>
  props.rows.filter((row) => (onlyPositive.value ? row.recommended_order_qty > 0 : true)),
);

  type ColumnDef = {
    key: string;
    label: string;
    info?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
    formatter?: (value: unknown, row?: ReorderRow) => unknown;
  };

function packSize(productId: number) {
  const value = props.dailyMap[productId]?.pack_size;
  return value === undefined ? '—' : formatNumber(value);
}
function minOrder(productId: number) {
  const value = props.dailyMap[productId]?.min_order_qty;
  return value === undefined ? '—' : formatNumber(value);
}
function dailyLeadTime(productId: number) {
  return props.dailyMap[productId]?.lead_time_days ?? null;
}
function suggestedArrival(productId: number, lead?: number | null, formatted = true) {
  const days = lead ?? 0;
  const date = addDays(new Date(), days);
  return formatted ? formatDate(date) : date.toISOString().slice(0, 10);
}

const columns: ColumnDef[] = [
  { key: 'sku', label: 'מק"ט', info: 'מזהה הפריט במערכת', dir: 'ltr' },
  { key: 'name', label: 'שם פריט', info: 'השם כפי שמופיע בקטלוג', dir: 'auto' },
  { key: 'status', label: 'סטטוס מלאי', info: 'מצב נוכחי לפי הדוח היומי והאם יש סיכון 60 יום', dir: 'ltr' },
  {
    key: 'days_until_rop',
    label: 'ימים ל־ROP',
    info: 'כמה ימים נשארו עד נקודת ההזמנה מחדש; מספר שלילי אומר שכבר עברנו אותה',
    dir: 'rtl',
  },
  { key: 'available', label: 'זמין עכשיו', info: 'כמות זמינה במחסן כרגע', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  {
    key: 'in_transit',
    label: 'בדרך',
    info: 'כמות שכבר נשלחה ועדיין לא התקבלה',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
  },
  {
    key: 'target_units_30d',
    label: 'יעד ל־30 יום',
    info: 'כמה יחידות צריך בחודש הקרוב כדי לעמוד בביקוש',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
  },
  {
    key: 'recommended_order_qty',
    label: 'המלצת הזמנה',
    info: 'כמה להזמין כעת כדי להגיע ליעד ולמנוע חוסר',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
  },
  {
    key: 'pack',
    label: 'אריזות ומינימום',
    info: 'גודל אריזה אחת והמינימום שספק מאפשר להזמין',
    dir: 'ltr',
  },
  { key: 'arrival', label: 'תאריך הגעה מוצע', info: 'תאריך יעד להזמנה לפי זמן האספקה הצפוי', dir: 'auto' },
  { key: 'actions', label: 'פעולות', info: 'פתיחת הזמנה, חריגה או בדיקת מלאי', dir: 'ltr' },
];
</script>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-head h2 {
  margin: 0;
  font-size: 1.1rem;
}

.filter {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: #334155;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.risk-chip {
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  padding: 0.1rem 0.6rem;
  font-size: 0.75rem;
}

.pack-block {
  line-height: 1.25;
}

.btn {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.9rem;
}
.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.danger {
  color: #dc2626;
  font-weight: 700;
}

.rtl-days {
  direction: rtl;
  display: inline-block;
  text-align: right;
}

@media (min-width: 768px) {
  .section-head {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
