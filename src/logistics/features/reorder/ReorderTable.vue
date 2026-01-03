<template>
  <section class="section">
    <div class="section-head">
      <h2 class="section-title">המלצות הזמנה</h2>
      <label class="filter">
        <input v-model="onlyPositive" type="checkbox" />
        הצג רק פריטים עם המלצת הזמנה חיובית
      </label>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable
        :columns="columns"
        :rows="sortedRows"
        :sort-key="sortKey"
        :sort-dir="sortDir"
        @sort="setSort"
      >
        <template #cell-status="{ row }">
          <StatusPill :status="row.status" />
        </template>
        <template #cell-days_until_rop="{ row }">
          <span dir="rtl" class="rtl-days" :class="row.days_until_rop < 0 ? 'danger' : ''">
            {{ formatDaysWithHours(row.days_until_rop) }}
          </span>
        </template>
        <template #cell-pack="{ row }">
          <div class="pack-block">
            <div>כמות אריזות: {{ packSize(row.product_id) }}</div>
            <div>מינימום: {{ minOrder(row.product_id) }}</div>
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
              סמן שהוזמן
            </button>
            <button class="btn" @click="$emit('override', row.product_id)">חריגה…</button>
            <button class="btn" @click="$emit('inventory', row.product_id)">מלאי…</button>
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
import { useTableSort, type SortableColumn } from '../../../shared/utils/tableSort';

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
  sortable?: boolean;
  sortValue?: (row: ReorderRow) => string | number | null | undefined;
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
  { key: 'sku', label: 'מק"ט', info: 'מזהה הפריט במערכת', dir: 'ltr', sortable: true },
  { key: 'name', label: 'שם פריט', info: 'השם כפי שמופיע בקטלוג', dir: 'auto', sortable: true },
  {
    key: 'status',
    label: 'סטטוס מלאי',
    info: 'מצב נוכחי לפי הדוח היומי והאם יש סיכון 60 יום',
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'days_until_rop',
    label: 'ימים לROP',
    info: 'כמה ימים נשארו עד נקודת ההזמנה מחדש; מספר שלילי אומר שכבר עברנו אותה',
    dir: 'rtl',
    sortable: true,
  },
  {
    key: 'available',
    label: 'זמין',
    info: 'כמות זמינה במחסן כרגע',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'in_transit',
    label: 'בדרך',
    info: 'כמות שכבר נשלחה ועדיין לא התקבלה',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'target_units_30d',
    label: 'יעד 30 יום',
    info: 'כמה יחידות צריך בחודש הקרוב כדי לעמוד בביקוש',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'recommended_order_qty',
    label: 'המלצה',
    info: 'כמה להזמין כעת כדי להגיע ליעד ולמנוע חוסר',
    formatter: (v: unknown) => formatNumber(v as number),
    dir: 'ltr',
    sortable: true,
  },
  {
    key: 'pack',
    label: 'אריזה/מינימום',
    info: 'גודל אריזה אחת והמינימום שספק מאפשר להזמין',
    dir: 'ltr',
  },
  {
    key: 'arrival',
    label: 'הגעה מוצעת',
    info: 'תאריך יעד להזמנה לפי זמן האספקה הצפוי',
    dir: 'auto',
    sortable: true,
    sortValue: (row) => suggestedArrival(row.product_id, dailyLeadTime(row.product_id), false),
  },
  { key: 'actions', label: 'פעולות', info: 'פתיחת הזמנה, חריגה או בדיקת מלאי', dir: 'ltr', sortable: false },
];

const { sortKey, sortDir, sortedRows, setSort } = useTableSort(
  filteredRows,
  columns as SortableColumn<ReorderRow>[],
  'sku',
  'asc',
);
</script>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-head h2 {
  margin: 0;
  padding: 0;
  border: none;
}

.filter {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #1e293b;
  font-weight: 500;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.risk-chip {
  border-radius: 999px;
  background: #fffbeb;
  color: #b45309;
  padding: 0.15rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #fde68a;
}

.pack-block {
  line-height: 1.4;
  font-size: 0.9rem;
}

.btn {
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.15);
}

.btn.primary:hover {
  background: #0284c7;
  border-color: #0284c7;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.danger {
  color: #ef4444;
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
