<template>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <Risk60dWidget @open-actions="openDrawerFromRisk" />
    <CriticalTable @open-actions="openDrawerFromCritical" />
    <DeadStockTable @open-actions="openDrawerFromDead" />
  </div>
  <ProductActionsDrawer
    :open="drawerOpen"
    :product-id="selectedProductId"
    :sku="selectedSku"
    :name="selectedName"
    :initial-tab="initialTab"
    @close="drawerOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProductActionsDrawer from "../product-actions/ProductActionsDrawer.vue";
import Risk60dWidget from "./Risk60dWidget.vue";
import CriticalTable from "./CriticalTable.vue";
import DeadStockTable from "./DeadStockTable.vue";
import type { DailyRow } from "../../domain/types";

const drawerOpen = ref(false);
const selectedProductId = ref<number | null>(null);
const selectedSku = ref<string | undefined>();
const selectedName = ref<string | undefined>();
const initialTab = ref<"purchase" | "override" | "inventory">("purchase");

function openDrawerFromRisk(productId: number) {
  selectedProductId.value = productId;
  selectedSku.value = undefined;
  selectedName.value = undefined;
  initialTab.value = "purchase";
  drawerOpen.value = true;
}

function openDrawerFromCritical(row: DailyRow, tab?: "purchase" | "override" | "inventory") {
  selectedProductId.value = row.product_id;
  selectedSku.value = row.sku;
  selectedName.value = row.name;
  initialTab.value = tab || "purchase";
  drawerOpen.value = true;
}

function openDrawerFromDead(productId: number) {
  selectedProductId.value = productId;
  selectedSku.value = undefined;
  selectedName.value = undefined;
  initialTab.value = "purchase";
  drawerOpen.value = true;
}
</script>
