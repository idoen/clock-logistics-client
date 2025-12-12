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
        <div class="section-title">Dead Stock – ירידה חדה בקצב מכירה</div>
        <div class="section-subtitle">פריטים מסומנים כמלאי מת כאשר המכירות ירדו משמעותית (דמו כולל ~50% ירידה).</div>
      </div>
    </div>
    <DataTable>
      <template #head>
        <th>SKU</th>
        <th>Name</th>
        <th>Status</th>
        <th>Available</th>
        <th>Forecast Daily Sales</th>
        <th>On Hand</th>
        <th>In Transit</th>
        <th>Actions</th>
      </template>
      <tr v-for="row in rows" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td>{{ row.name }}</td>
        <td><StatusPill :status="row.final_status" /></td>
        <td>{{ formatNumber(row.available) }}</td>
        <td>{{ formatNumber(row.forecast_daily_sales, 1) }}</td>
        <td>{{ formatNumber(row.on_hand) }}</td>
        <td>{{ formatNumber(row.in_transit) }}</td>
        <td>
          <button class="button" @click="selected = row">Actions</button>
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
