<template>
  <div v-if="open" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-shell">
      <div class="modal-card" dir="ltr">
        <div class="modal-header">
          <div>
            <h3 class="title">Actions – {{ title }}</h3>
            <p class="subtitle">Product ID: {{ productId }}</p>
          </div>
          <button class="close" @click="$emit('close')" aria-label="Close">✕</button>
        </div>
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'po' }" @click="activeTab = 'po'">Purchase Order</button>
          <button class="tab" :class="{ active: activeTab === 'override' }" @click="activeTab = 'override'">Override</button>
          <button class="tab" :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'">Inventory</button>
        </div>
        <div class="modal-body">
          <PurchaseOrderForm
            v-if="activeTab === 'po'"
            :product-id="productId"
            :default-qty="defaultQty"
            :default-arrival="defaultArrival"
            @submitted="$emit('close')"
          />
          <OverrideForm v-else-if="activeTab === 'override'" :product-id="productId" @submitted="$emit('close')" />
          <InventoryForm v-else :product-id="productId" @submitted="$emit('close')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import InventoryForm from './InventoryForm.vue';
import OverrideForm from './OverrideForm.vue';
import PurchaseOrderForm from './PurchaseOrderForm.vue';

const props = defineProps<{ productId: number; title?: string; open: boolean; defaultQty?: number; defaultArrival?: string; initialTab?: 'po' | 'override' | 'inventory' }>();

const emit = defineEmits<{ (e: 'close'): void }>();
const activeTab = ref<'po' | 'override' | 'inventory'>(props.initialTab ?? 'po');

watch(
  () => props.initialTab,
  (val) => {
    if (val) activeTab.value = val;
  },
);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 40;
}

.modal-shell {
  width: min(960px, 100%);
  max-height: 95vh;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  gap: 0.75rem;
}

.title {
  margin: 0;
  font-size: 1.15rem;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: #475569;
  font-size: 0.85rem;
}

.close {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #475569;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 0 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  padding: 0.55rem 0.9rem;
  border-radius: 10px 10px 0 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  color: #0f172a;
  font-weight: 600;
}

.tab.active {
  background: #ffffff;
  color: #0ea5e9;
}

.modal-body {
  padding: 1rem 1.25rem 1.5rem;
  overflow-y: auto;
  max-height: calc(95vh - 150px);
}

@media (max-width: 640px) {
  .modal-shell {
    width: 100%;
  }

  .modal-card {
    border-radius: 12px;
  }

  .tabs {
    flex-wrap: wrap;
  }
}
</style>
