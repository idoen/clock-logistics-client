<template>
  <AsyncState :is-loading="query.isLoading" :error="query.error">
    <DataTable
      title="Purchase Orders"
      :columns="['id', 'product_id', 'qty_ordered', 'order_date', 'expected_arrival', 'status', 'created_at']"
    >
      <tr v-for="row in query.data?.value || []" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.product_id }}</td>
        <td>{{ row.qty_ordered }}</td>
        <td>{{ row.order_date }}</td>
        <td>{{ row.expected_arrival }}</td>
        <td>{{ row.status }}</td>
        <td>{{ row.created_at }}</td>
      </tr>
    </DataTable>
  </AsyncState>
</template>

<script setup lang="ts">
import AsyncState from "../../../shared/ui/AsyncState.vue";
import DataTable from "../../../shared/ui/DataTable.vue";
import { usePurchaseOrders } from "../../queries/usePurchaseOrders";

const query = usePurchaseOrders();
</script>
