<script setup lang="ts">
import DataTable from '@/shared/ui/DataTable.vue'
import type { PurchaseOrder } from '../../domain/types'

const props = defineProps<{ rows: PurchaseOrder[] }>()
</script>

<template>
  <section class="section">
    <div class="section-header">
      <div class="section-title">Purchase Orders</div>
    </div>
    <DataTable>
      <template #head>
        <th>ID</th>
        <th>Product</th>
        <th>Qty Ordered</th>
        <th>Order Date</th>
        <th>Expected Arrival</th>
        <th>Status</th>
        <th>Created</th>
      </template>
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.product_id }}</td>
        <td>{{ row.qty_ordered }}</td>
        <td>{{ row.order_date }}</td>
        <td>{{ row.expected_arrival }}</td>
        <td>{{ row.status }}</td>
        <td>{{ row.created_at }}</td>
      </tr>
    </DataTable>
  </section>
</template>
