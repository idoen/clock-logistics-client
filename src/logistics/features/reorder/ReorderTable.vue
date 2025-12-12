<script setup lang="ts">
import DataTable from '@/shared/ui/DataTable.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import { formatNumber } from '@/shared/utils/format'
import ProductActionsDrawer from '../product-actions/ProductActionsDrawer.vue'
import PurchaseOrderForm from '../product-actions/PurchaseOrderForm.vue'
import type { ReorderRow, DailyRow } from '../../domain/types'
import { computed, ref } from 'vue'
import { addDays } from '@/shared/utils/date'

const props = defineProps<{ rows: ReorderRow[]; dailyIndex: Record<number, DailyRow | undefined> }>()
const selected = ref<ReorderRow | null>(null)
const poRow = ref<ReorderRow | null>(null)

const defaultArrival = computed(() => {
  if (!poRow.value) return ''
  const daily = props.dailyIndex[poRow.value.product_id]
  if (daily) return addDays(daily.lead_time_days)
  return ''
})
</script>

<template>
  <section class="section">
    <div class="section-header">
      <div class="section-title">Reorder Recommendations</div>
    </div>
    <DataTable>
      <template #head>
        <th>SKU</th>
        <th>Name</th>
        <th>Status</th>
        <th>Days until ROP</th>
        <th>Available</th>
        <th>In Transit</th>
        <th>Target Units 30d</th>
        <th>Recommended Qty</th>
        <th>Pack / Min</th>
        <th>Expected arrival</th>
        <th>Actions</th>
      </template>
      <tr v-for="row in rows" :key="row.product_id">
        <td>{{ row.sku }}</td>
        <td>{{ row.name }}</td>
        <td>
          <StatusPill :status="row.status" />
          <div v-if="row.at_risk_60d" class="pill" style="margin-top: 4px;">Risk60d</div>
        </td>
        <td :style="{ color: row.days_until_rop < 0 ? '#b91c1c' : undefined, fontWeight: row.days_until_rop < 0 ? '700' : '400' }">
          {{ row.days_until_rop }}
        </td>
        <td>{{ formatNumber(row.available) }}</td>
        <td>{{ formatNumber(row.in_transit) }}</td>
        <td>{{ formatNumber(row.target_units_30d) }}</td>
        <td>{{ formatNumber(row.recommended_order_qty) }}</td>
        <td>
          <div>{{ formatNumber(props.dailyIndex[row.product_id]?.pack_size) }}</div>
          <div class="helper">min {{ formatNumber(props.dailyIndex[row.product_id]?.min_order_qty) }}</div>
        </td>
        <td>
          <div v-if="props.dailyIndex[row.product_id]">{{ addDays(props.dailyIndex[row.product_id]!.lead_time_days) }}</div>
          <div v-else>—</div>
        </td>
        <td style="display: flex; flex-direction: column; gap: 4px;">
          <button class="button primary" @click="poRow = row">Mark as ordered</button>
          <button class="button" @click="selected = row">Override…</button>
          <button class="button" @click="selected = row">Inventory…</button>
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
  <div v-if="poRow" class="drawer-backdrop" @click="poRow = null"></div>
  <div v-if="poRow" class="drawer">
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <div>
        <div style="font-weight: 700;">Purchase Order</div>
        <div class="helper">{{ poRow.sku }} - {{ poRow.name }}</div>
      </div>
      <button class="button" @click="poRow = null">Close</button>
    </header>
    <PurchaseOrderForm
      :product-id="poRow.product_id"
      :default-qty="poRow.recommended_order_qty"
      :default-expected-arrival="defaultArrival"
      @done="poRow = null"
    />
  </div>
</template>
