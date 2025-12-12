<script setup lang="ts">
import AsyncState from '@/shared/ui/AsyncState.vue'
import { useDailyReport } from '../../queries/useDailyReport'
import { useReorder } from '../../queries/useReorder'
import ReorderTable from './ReorderTable.vue'
import { computed, ref } from 'vue'

const reorder = useReorder()
const dailyAll = useDailyReport()
const showOnlyWithRecommendation = ref(true)

const dailyIndex = computed(() => {
  const map: Record<number, any> = {}
  dailyAll.data.value?.forEach((row) => {
    map[row.product_id] = row
  })
  return map
})

const filtered = computed(() =>
  (reorder.data.value || []).filter((row) => !showOnlyWithRecommendation.value || row.recommended_order_qty > 0),
)
</script>

<template>
  <div class="section" style="margin-top: 12px;">
    <label style="display: flex; gap: 8px; align-items: center;">
      <input v-model="showOnlyWithRecommendation" type="checkbox" checked />
      הצג רק הצעות הזמנה (recommended_order_qty > 0)
    </label>
  </div>
  <AsyncState :query="reorder">
    <ReorderTable :rows="filtered" :daily-index="dailyIndex" />
  </AsyncState>
</template>
