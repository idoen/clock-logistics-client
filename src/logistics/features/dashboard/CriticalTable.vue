<script setup lang="ts">
import DataTable from '@/shared/ui/DataTable.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import { formatNumber } from '@/shared/utils/format'
import ProductActionsDrawer from '../product-actions/ProductActionsDrawer.vue'
import type { DailyRow } from '../../domain/types'
import { ref } from 'vue'

const props = defineProps<{ rows: DailyRow[] }>()
const selected = ref<DailyRow | null>(null)
</script>

<template>
  <section class="section">
    <div class="section-header">
      <div>
        <div class="section-title">Critical – מתחת/קרוב ROP</div>
      </div>
    </div>
    <DataTable>
      <template #head>
        <th>SKU</th>
        <th>Name</th>
        <th>Status</th>
        <th>Available</th>
        <th>ROP Units</th>
        <th>Lead Time (days)</th>
        <th>Forecast / Avg</th>
        <th>Pack Size</th>
        <th>Min Order Qty</th>
        <th>Actions</th>
      </template>
      <tr v-for="row in rows" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td>{{ row.name }}</td>
        <td><StatusPill :status="row.final_status" /></td>
        <td>{{ formatNumber(row.available) }}</td>
        <td>{{ formatNumber(row.rop_units) }}</td>
        <td>{{ row.lead_time_days }}</td>
        <td>
          {{ formatNumber(row.forecast_daily_sales, 1) }}
          <div class="helper">avg {{ formatNumber(row.avg_daily_sales, 1) }}</div>
        </td>
        <td>{{ formatNumber(row.pack_size) }}</td>
        <td>{{ formatNumber(row.min_order_qty) }}</td>
        <td style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="button primary" @click="selected = row">Order</button>
          <button class="button" @click="selected = row">Override</button>
          <button class="button" @click="selected = row">Inventory</button>
        </td>
      </tr>
    </DataTable>
  </section>
  <ProductActionsDrawer
    v-if="selected"
    :product-id="selected.product_id"
    :sku="selected.sku"
    :name="selected.name"
    @close="selected = null"
  />
</template>
