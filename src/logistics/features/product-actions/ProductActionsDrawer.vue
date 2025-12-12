<template>
  <div v-if="open" class="drawer" @click.self="emit('close')">
    <div></div>
    <div class="drawer-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div>
          <div style="font-weight:800;">Product Actions</div>
          <div class="text-muted" v-if="productId">
            ID: {{ productId }}<span v-if="sku"> · SKU: {{ sku }}</span><span v-if="name"> · {{ name }}</span>
          </div>
        </div>
        <button class="btn btn-secondary" @click="emit('close')">Close</button>
      </div>
      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'purchase' }" @click="activeTab = 'purchase'">Purchase Order</button>
        <button class="tab" :class="{ active: activeTab === 'override' }" @click="activeTab = 'override'">Override</button>
        <button class="tab" :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'">Inventory</button>
      </div>

      <div v-if="activeTab === 'purchase' && productId">
        <PurchaseOrderForm
          :product-id="productId"
          :default-qty="defaultQty"
          :default-date="defaultDate"
          @submitted="handleClose"
        />
      </div>

      <div v-else-if="activeTab === 'override' && productId">
        <div v-if="activeOverrideId" style="margin-bottom:8px;" class="flex-center">
          <span class="badge">Override active (id: {{ activeOverrideId }})</span>
          <button class="btn btn-link" @click="onDisable">Disable override</button>
        </div>
        <OverrideForm :product-id="productId" @submitted="handleClose" />
      </div>

      <div v-else-if="activeTab === 'inventory' && productId">
        <InventoryForm :product-id="productId" @submitted="handleClose" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import PurchaseOrderForm from "./PurchaseOrderForm.vue";
import OverrideForm from "./OverrideForm.vue";
import InventoryForm from "./InventoryForm.vue";
import { useDisableOverride } from "../../mutations/useDisableOverride";
import { qk } from "../../queries/keys";

const props = defineProps<{
  open: boolean;
  productId: number | null;
  sku?: string;
  name?: string;
  defaultQty?: number;
  defaultDate?: string;
  initialTab?: "purchase" | "override" | "inventory";
}>();

const emit = defineEmits<{ close: [] }>();
const activeTab = ref<"purchase" | "override" | "inventory">(props.initialTab || "purchase");

watch(
  () => props.initialTab,
  (value) => {
    if (value) activeTab.value = value;
  },
);

const { data: overrides } = useQuery({
  queryKey: qk.overridesLocal(),
  queryFn: async () => ({} as Record<number, number>),
});

const disableOverrideMutation = useDisableOverride();

const activeOverrideId = computed(() => {
  if (!props.productId) return undefined;
  return overrides?.value?.[props.productId];
});

function handleClose() {
  emit("close");
}

function onDisable() {
  if (!activeOverrideId.value) return;
  disableOverrideMutation.mutate(activeOverrideId.value);
}
</script>
