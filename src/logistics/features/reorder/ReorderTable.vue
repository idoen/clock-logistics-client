<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Reorder recommendations</h2>
      <label class="flex items-center gap-2 text-sm text-slate-700">
        <input v-model="onlyPositive" type="checkbox" />
        הצג רק הצעות הזמנה (recommended_order_qty > 0)
      </label>
    </div>
    <AsyncState :loading="loading" :error="error">
      <DataTable :columns="columns" :rows="filteredRows">
        <template #cell-status="{ row }">
          <div class="flex items-center gap-2">
            <StatusPill :status="row.status" />
            <span v-if="row.at_risk_60d" class="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
              Risk60d
            </span>
          </div>
        </template>
        <template #cell-days_until_rop="{ row }">
          <span :class="row.days_until_rop < 0 ? 'text-red-600 font-semibold' : ''">{{ row.days_until_rop }}</span>
        </template>
        <template #cell-pack="{ row }">
          <div class="leading-tight">
            <div>Pack: {{ packSize(row.product_id) }}</div>
            <div>Min: {{ minOrder(row.product_id) }}</div>
          </div>
        </template>
        <template #cell-arrival="{ row }">
          {{ suggestedArrival(row.product_id, dailyLeadTime(row.product_id)) }}
        </template>
        <template #cell-actions="{ row }">
          <div class="flex gap-2">
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

function packSize(productId: number) {
  return props.dailyMap[productId]?.pack_size ?? '—';
}
function minOrder(productId: number) {
  return props.dailyMap[productId]?.min_order_qty ?? '—';
}
function dailyLeadTime(productId: number) {
  return props.dailyMap[productId]?.lead_time_days ?? null;
}
function suggestedArrival(productId: number, lead?: number | null, formatted = true) {
  const days = lead ?? 0;
  const date = addDays(new Date(), days);
  return formatted ? formatDate(date) : formatDate(date);
}

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'days_until_rop', label: 'days_until_rop' },
  { key: 'available', label: 'available' },
  { key: 'in_transit', label: 'in_transit' },
  { key: 'target_units_30d', label: 'target_units_30d' },
  { key: 'recommended_order_qty', label: 'recommended_order_qty' },
  { key: 'pack', label: 'pack_size / min_order_qty' },
  { key: 'arrival', label: 'Suggested arrival' },
  { key: 'actions', label: 'Actions' },
];
</script>

<style scoped>
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
</style>
