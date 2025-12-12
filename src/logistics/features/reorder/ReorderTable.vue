<template>
  <AsyncState :is-loading="reorderQuery.isLoading || dailyQuery.isLoading" :error="reorderQuery.error || dailyQuery.error">
    <DataTable
      title="Reorder"
      :columns="[
        'SKU',
        'Name',
        'Status',
        'days_until_rop',
        'available',
        'in_transit',
        'target_units_30d',
        'recommended_order_qty',
        'pack_size / min_order_qty',
        'Expected arrival',
        'Actions',
      ]"
    >
      <tr v-for="row in filteredRows" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td>{{ row.name }}</td>
        <td>
          <StatusPill :status="row.status" />
          <span v-if="row.at_risk_60d" class="badge" style="margin-left:6px;">Risk60d</span>
        </td>
        <td :class="{ 'text-danger': row.days_until_rop < 0 }">{{ row.days_until_rop }}</td>
        <td>{{ row.available }}</td>
        <td>{{ row.in_transit }}</td>
        <td>{{ row.target_units_30d }}</td>
        <td>{{ row.recommended_order_qty }}</td>
        <td>{{ packAndMin(row.product_id) }}</td>
        <td>{{ suggestedArrival(row.product_id) }}</td>
        <td class="flex-center" style="gap:6px;flex-wrap:wrap;">
          <button class="btn btn-primary" @click="emit('open-actions', row, 'purchase', row.recommended_order_qty, suggestedArrival(row.product_id))">
            Mark as ordered
          </button>
          <button class="btn btn-secondary" @click="emit('open-actions', row, 'override')">Override…</button>
          <button class="btn btn-secondary" @click="emit('open-actions', row, 'inventory')">Inventory…</button>
        </td>
      </tr>
    </DataTable>
    <div style="margin-top:8px; display:flex; align-items:center; gap:8px;">
      <label style="display:flex; align-items:center; gap:6px;">
        <input type="checkbox" v-model="onlyRecommendations" />
        ✅ הצג רק הצעות הזמנה (recommended_order_qty > 0)
      </label>
    </div>
  </AsyncState>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AsyncState from "../../../shared/ui/AsyncState.vue";
import DataTable from "../../../shared/ui/DataTable.vue";
import StatusPill from "../../../shared/ui/StatusPill.vue";
import { useReorder } from "../../queries/useReorder";
import { useDailyReport } from "../../queries/useDailyReport";
import { addDays } from "../../../shared/utils/date";
import type { ReorderRow } from "../../domain/types";

const emit = defineEmits<{
  "open-actions": [row: ReorderRow, tab: "purchase" | "override" | "inventory", qty?: number, expectedDate?: string];
}>();

const reorderQuery = useReorder();
const dailyQuery = useDailyReport();
const onlyRecommendations = ref(true);

const dailyByProduct = computed(() => {
  const map = new Map<number, { pack_size: number; min_order_qty: number; lead_time_days: number }>();
  (dailyQuery.data?.value || []).forEach((row) => {
    map.set(row.product_id, {
      pack_size: row.pack_size,
      min_order_qty: row.min_order_qty,
      lead_time_days: row.lead_time_days,
    });
  });
  return map;
});

const filteredRows = computed(() => {
  const rows = reorderQuery.data?.value || [];
  return rows.filter((row) => !onlyRecommendations.value || row.recommended_order_qty > 0);
});

function packAndMin(productId: number) {
  const daily = dailyByProduct.value.get(productId);
  if (!daily) return "—";
  return `${daily.pack_size} / ${daily.min_order_qty}`;
}

function suggestedArrival(productId: number) {
  const daily = dailyByProduct.value.get(productId);
  if (!daily) return "";
  return addDays(new Date(), daily.lead_time_days);
}
</script>
