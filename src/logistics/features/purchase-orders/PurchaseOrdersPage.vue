<script setup lang="ts">
import AsyncState from '@/shared/ui/AsyncState.vue'
import { usePurchaseOrders } from '../../queries/usePurchaseOrders'
import PurchaseOrdersTable from './PurchaseOrdersTable.vue'
import { computed } from 'vue'

const query = usePurchaseOrders()
const rows = computed(() => query.data.value ?? [])
</script>

<template>
  <AsyncState :query="query">
    <PurchaseOrdersTable :rows="rows" />
  </AsyncState>
</template>
