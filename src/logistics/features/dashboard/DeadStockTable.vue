<template>
  <AsyncState :is-loading="query.isLoading" :error="query.error">
    <DataTable
      title="Dead Stock – ירידה חדה בקצב מכירה"
      subtitle="פריטים מסומנים כמלאי מת כאשר המכירות ירדו משמעותית (דמו כולל ~50% ירידה)."
      :columns="['SKU', 'Name', 'final_status', 'available', 'forecast_daily_sales', 'on_hand', 'in_transit', 'Actions']"
    >
      <tr v-for="row in query.data?.value || []" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td>{{ row.name }}</td>
        <td><StatusPill :status="row.final_status" /></td>
        <td>{{ row.available }}</td>
        <td>{{ row.forecast_daily_sales }}</td>
        <td>{{ row.on_hand }}</td>
        <td>{{ row.in_transit }}</td>
        <td>
          <button class="btn btn-secondary" @click="emit('open-actions', row.product_id)">Actions</button>
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

const emit = defineEmits<{ "open-actions": [productId: number] }>();
const query = useDailyReport("DEAD_STOCK");
</script>
