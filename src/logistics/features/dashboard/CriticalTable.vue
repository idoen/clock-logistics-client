<template>
  <AsyncState :is-loading="query.isLoading" :error="query.error">
    <DataTable
      title="Critical – מתחת/קרוב ROP"
      :columns="[
        'SKU',
        'Name',
        'final_status',
        'available',
        'rop_units',
        'lead_time_days',
        'forecast_daily_sales',
        'avg_daily_sales',
        'pack_size',
        'min_order_qty',
        'Actions',
      ]"
    >
      <tr v-for="row in query.data?.value || []" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td>{{ row.name }}</td>
        <td><StatusPill :status="row.final_status" /></td>
        <td>{{ row.available }}</td>
        <td>{{ row.rop_units }}</td>
        <td>{{ row.lead_time_days }}</td>
        <td>{{ row.forecast_daily_sales }}</td>
        <td class="text-muted">{{ row.avg_daily_sales }}</td>
        <td>{{ row.pack_size }}</td>
        <td>{{ row.min_order_qty }}</td>
        <td class="flex-center" style="flex-wrap:wrap; gap:6px;">
          <button class="btn btn-primary" @click="emit('open-actions', row, 'purchase')">Order</button>
          <button class="btn btn-secondary" @click="emit('open-actions', row, 'override')">Override</button>
          <button class="btn btn-secondary" @click="emit('open-actions', row, 'inventory')">Inventory</button>
        </td>
      </tr>
    </DataTable>
  </AsyncState>
</template>

<script setup lang="ts">
import AsyncState from "../../../shared/ui/AsyncState.vue";
import DataTable from "../../../shared/ui/DataTable.vue";
import StatusPill from "../../../shared/ui/StatusPill.vue";
import { useDailyReport } from "../../queries/useDailyReport";
import type { DailyRow } from "../../domain/types";

const emit = defineEmits<{
  "open-actions": [row: DailyRow, tab?: "purchase" | "override" | "inventory"];
}>();

const query = useDailyReport("CRITICAL");
</script>
