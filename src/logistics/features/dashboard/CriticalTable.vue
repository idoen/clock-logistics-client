<template>
  <section class="section">
    <div class="section-head">
      <div>
        <h2>Critical – מתחת/קרוב ROP</h2>
        <p class="help">מציג final_status מתוך הדוח היומי עם חיזוי חכם לצד avg. כפתור Actions פותח חלון פעולות מודלי.</p>
      </div>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="rows">
        <template #cell-final_status="{ row }">
          <StatusPill :status="row.final_status" />
        </template>
        <template #cell-forecast="{ row }">
          <div class="forecast">
            <div>{{ formatNumber(row.forecast_daily_sales) }}</div>
            <div class="forecast-hint">avg: {{ formatNumber(row.avg_daily_sales) }}</div>
          </div>
        </template>
        <template #cell-actions="{ row }">
          <button class="btn" @click="$emit('action', { productId: row.product_id, name: row.name })">Actions</button>
        </template>
      </DataTable>
    </AsyncState>
  </section>
</template>

<script setup lang="ts">
import DataTable from '../../../shared/ui/DataTable.vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import StatusPill from '../../../shared/ui/StatusPill.vue';
import { formatNumber } from '../../../shared/utils/format';
import type { DailyRow } from '../../domain/types';

defineProps<{ rows: DailyRow[]; loading: boolean; error: string | null }>();

defineEmits<{ (e: 'action', payload: { productId: number; name?: string }): void }>();

type ColumnDef = {
  key: string;
  label: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  formatter?: (value: unknown, row?: DailyRow) => unknown;
};

const columns: ColumnDef[] = [
  { key: 'sku', label: 'מק"ט', info: 'קוד הפריט (SKU)', dir: 'ltr' },
  { key: 'name', label: 'שם פריט', info: 'איך הוא מופיע במחסן', dir: 'auto' },
  { key: 'final_status', label: 'סטטוס סופי', info: 'דחיפות פעולה', dir: 'ltr' },
  { key: 'available', label: 'זמין במלאי', info: 'יחידות על המדף', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'rop_units', label: 'ROP ביחידות', info: 'רף הזמנה מחדש', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'lead_time_days', label: 'זמן אספקה', info: 'Lead time (ימים)', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'forecast', label: 'חיזוי מול ממוצע', info: 'קצב יומי', dir: 'ltr' },
  { key: 'pack_size', label: 'גודל אריזה', info: 'יחידות בכל קרטון', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'min_order_qty', label: 'כמות הזמנה מינימלית', info: 'מגבלת ספק', formatter: (v: unknown) => formatNumber(v as number), dir: 'ltr' },
  { key: 'actions', label: 'פעולות', info: 'פתיחת המלצות', dir: 'ltr' },
];
</script>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-head h2 {
  margin: 0;
  font-size: 1.1rem;
}

.help {
  margin: 0.3rem 0 0;
  color: #475569;
}

.forecast-hint {
  font-size: 0.78rem;
  color: #64748b;
}

.btn {
  padding: 0.35rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.875rem;
}
</style>
