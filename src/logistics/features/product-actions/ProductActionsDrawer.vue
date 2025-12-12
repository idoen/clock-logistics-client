<script setup lang="ts">
import { ref, computed } from 'vue'
import InventoryForm from './InventoryForm.vue'
import OverrideForm from './OverrideForm.vue'
import PurchaseOrderForm from './PurchaseOrderForm.vue'

const props = defineProps<{ productId: number; sku?: string; name?: string }>()
const emit = defineEmits<{ close: [] }>()

const tabs = ['Purchase Order', 'Override', 'Inventory'] as const
const activeTab = ref<typeof tabs[number]>('Purchase Order')

const title = computed(() => props.sku || props.name || `Product ${props.productId}`)
</script>

<template>
  <div class="drawer-backdrop" @click="emit('close')"></div>
  <aside class="drawer">
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <div>
        <div style="font-weight: 700;">Actions</div>
        <div class="helper">{{ title }}</div>
      </div>
      <button class="button" @click="emit('close')">Close</button>
    </header>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ active: tab === activeTab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="activeTab === 'Purchase Order'">
      <PurchaseOrderForm :product-id="productId" @done="emit('close')" />
    </div>
    <div v-else-if="activeTab === 'Override'">
      <OverrideForm :product-id="productId" />
    </div>
    <div v-else>
      <InventoryForm :product-id="productId" @done="emit('close')" />
    </div>
  </aside>
</template>
