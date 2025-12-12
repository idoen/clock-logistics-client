<script setup lang="ts">
import AsyncState from '@/shared/ui/AsyncState.vue'
import { useDailyReport } from '../../queries/useDailyReport'
import { useRisk60d } from '../../queries/useRisk60d'
import CriticalTable from './CriticalTable.vue'
import DeadStockTable from './DeadStockTable.vue'
import Risk60dWidget from './Risk60dWidget.vue'
import { computed } from 'vue'

const critical = useDailyReport('CRITICAL')
const deadStock = useDailyReport('DEAD_STOCK')
const risk = useRisk60d()

const criticalRows = computed(() => critical.data.value ?? [])
const deadStockRows = computed(() => deadStock.data.value ?? [])
const riskRows = computed(() => risk.data.value ?? [])
</script>

<template>
  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: start;">
    <div>
      <AsyncState :query="critical">
        <CriticalTable :rows="criticalRows" />
      </AsyncState>
      <AsyncState :query="deadStock">
        <DeadStockTable :rows="deadStockRows" />
      </AsyncState>
    </div>
    <div>
      <AsyncState :query="risk">
        <Risk60dWidget :rows="riskRows" />
      </AsyncState>
    </div>
  </div>
</template>
