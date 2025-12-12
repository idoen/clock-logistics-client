<template>
  <AsyncState :is-loading="query.isLoading" :error="query.error">
    <div class="table-container">
      <div class="table-title">
        <div>
          <div style="font-weight:800;">Risk 60D</div>
          <div class="table-subtitle">days_until_rop < 0 → דחוף</div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>days_until_rop</th>
            <th>at_risk_60d</th>
            <th>forecast_daily_sales</th>
            <th>available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in sortedRows" :key="row.product_id">
            <td>{{ row.sku }}</td>
            <td :class="{ 'text-danger': row.days_until_rop < 0 }">{{ row.days_until_rop }}</td>
            <td>{{ row.at_risk_60d ? "Yes" : "No" }}</td>
            <td>{{ row.forecast_daily_sales }}</td>
            <td>{{ row.available }}</td>
            <td>
              <button class="btn btn-secondary" @click="emit('open-actions', row.product_id)">Actions</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AsyncState>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AsyncState from "../../../shared/ui/AsyncState.vue";
import { useRisk60d } from "../../queries/useRisk60d";

const emit = defineEmits<{ "open-actions": [productId: number] }>();

const query = useRisk60d();

const sortedRows = computed(() =>
  (query.data?.value || []).slice().sort((a, b) => a.days_until_rop - b.days_until_rop),
);
</script>
