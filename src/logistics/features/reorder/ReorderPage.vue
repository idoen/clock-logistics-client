<template>
  <ReorderTable @open-actions="openActions" />
  <ProductActionsDrawer
    :open="drawerOpen"
    :product-id="selectedProductId"
    :sku="selectedSku"
    :name="selectedName"
    :initial-tab="initialTab"
    :default-qty="defaultQty"
    :default-date="defaultDate"
    @close="drawerOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import ReorderTable from "./ReorderTable.vue";
import ProductActionsDrawer from "../product-actions/ProductActionsDrawer.vue";
import type { ReorderRow } from "../../domain/types";

const drawerOpen = ref(false);
const selectedProductId = ref<number | null>(null);
const selectedSku = ref<string | undefined>();
const selectedName = ref<string | undefined>();
const initialTab = ref<"purchase" | "override" | "inventory">("purchase");
const defaultQty = ref<number | undefined>();
const defaultDate = ref<string | undefined>();

function openActions(
  row: ReorderRow,
  tab: "purchase" | "override" | "inventory",
  qty?: number,
  expectedDate?: string,
) {
  selectedProductId.value = row.product_id;
  selectedSku.value = row.sku;
  selectedName.value = row.name;
  initialTab.value = tab;
  defaultQty.value = qty;
  defaultDate.value = expectedDate;
  drawerOpen.value = true;
}
</script>
