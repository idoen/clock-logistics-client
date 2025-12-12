<script setup lang="ts">
import DataTable from '@/shared/ui/DataTable.vue'
import ProductActionsDrawer from '../product-actions/ProductActionsDrawer.vue'
import type { RiskRow } from '../../domain/types'
import { computed, ref } from 'vue'

const props = defineProps<{ rows: RiskRow[] }>()
const sorted = computed(() => [...props.rows].sort((a, b) => a.days_until_rop - b.days_until_rop))
const selected = ref<RiskRow | null>(null)
</script>

<template>
  <section class="section">
    <div class="section-header">
      <div class="section-title">Risk 60D</div>
    </div>
    <DataTable>
      <template #head>
        <th>SKU</th>
        <th>Days until ROP</th>
        <th>At risk 60d</th>
        <th>Forecast daily sales</th>
        <th>Available</th>
        <th>Actions</th>
      </template>
      <tr v-for="row in sorted" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td :style="{ color: row.days_until_rop < 0 ? '#b91c1c' : undefined, fontWeight: row.days_until_rop < 0 ? '700' : '400' }">
          {{ row.days_until_rop }}
        </td>
        <td>{{ row.at_risk_60d ? 'Yes' : 'No' }}</td>
        <td>{{ row.forecast_daily_sales }}</td>
        <td>{{ row.available }}</td>
        <td><button class="button" @click="selected = row">Actions</button></td>
      </tr>
    </DataTable>
  </section>
  <ProductActionsDrawer
    v-if="selected"
    :product-id="selected.product_id"
    :sku="selected.sku"
    @close="selected = null"
  />
</template>
