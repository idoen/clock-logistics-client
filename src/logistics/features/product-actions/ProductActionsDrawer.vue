<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <div class="modal-panel">
        <div class="modal-head">
          <div>
            <h3>פעולות – {{ title }}</h3>
            <p class="sub">מזהה מוצר: {{ productId }}</p>
          </div>
          <button class="close" aria-label="Close" @click="$emit('close')">✕</button>
        </div>
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'po' }" @click="activeTab = 'po'">הזמנת רכש</button>
          <button class="tab" :class="{ active: activeTab === 'override' }" @click="activeTab = 'override'">
            חריגה
          </button>
          <button class="tab" :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'">
            מלאי
          </button>
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
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, onBeforeUnmount, ref, watch } from 'vue';
import InventoryForm from './InventoryForm.vue';
import OverrideForm from './OverrideForm.vue';
import PurchaseOrderForm from './PurchaseOrderForm.vue';

const props = defineProps<{
  productId: number;
  title?: string;
  open: boolean;
  defaultQty?: number;
  defaultArrival?: string;
  initialTab?: 'po' | 'override' | 'inventory';
}>();

const emit = defineEmits<{ (e: 'close'): void }>();
const activeTab = ref<'po' | 'override' | 'inventory'>(props.initialTab ?? 'po');

watch(
  () => props.initialTab,
  (val) => {
    if (val) activeTab.value = val;
  },
);

function lockScroll(shouldLock: boolean) {
  const body = document.body;
  if (!body) return;

  if (shouldLock) {
    body.dataset.productActionsScrollLock = 'true';
    body.style.overflow = 'hidden';
  } else if (body.dataset.productActionsScrollLock) {
    delete body.dataset.productActionsScrollLock;
    body.style.overflow = '';
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.initialTab) {
      activeTab.value = props.initialTab;
    }

    lockScroll(isOpen);

    if (isOpen) {
      window.addEventListener('keydown', onKeydown);
    } else {
      window.removeEventListener('keydown', onKeydown);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  lockScroll(false);
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 200;
}

.modal-panel {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
  width: min(1024px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.9rem 1rem;
}

.modal-head h3 {
  margin: 0;
  font-size: 1.05rem;
}

.sub {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.83rem;
}

.close {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: #475569;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem 1rem 0.2rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  color: #0f172a;
  cursor: pointer;
}

.tab.active {
  background: #ffffff;
  font-weight: 600;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}
</style>
