<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="actions-heading"
      @click.self="emitClose"
    >
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 flex flex-col"
        @keydown.esc.prevent.stop="emitClose"
      >
        <div class="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 id="actions-heading" class="text-lg font-semibold">Actions – {{ title }}</h3>
            <p class="text-xs text-slate-500">Product ID: {{ productId }}</p>
          </div>
          <button class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100" @click="emitClose" aria-label="Close actions modal">
            ✕
          </button>
        </div>
        <div class="border-b px-5 pt-4">
          <div class="flex flex-wrap gap-2">
            <button
              class="tab"
              :class="{ active: activeTab === 'po' }"
              @click="activeTab = 'po'"
              type="button"
            >
              Purchase Order
            </button>
            <button class="tab" :class="{ active: activeTab === 'override' }" @click="activeTab = 'override'" type="button">
              Override
            </button>
            <button class="tab" :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'" type="button">
              Inventory
            </button>
          </div>
        </div>
        <div class="modal-body">
          <PurchaseOrderForm
            v-if="activeTab === 'po'"
            :product-id="productId"
            :default-qty="defaultQty"
            :default-arrival="defaultArrival"
            @submitted="emitClose"
          />
          <OverrideForm v-else-if="activeTab === 'override'" :product-id="productId" @submitted="emitClose" />
          <InventoryForm v-else :product-id="productId" @submitted="emitClose" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.initialTab) {
      activeTab.value = props.initialTab;
    }
    toggleBodyScroll(isOpen);
  },
);
const emitClose = () => emit('close');

function toggleBodyScroll(isOpen: boolean) {
  const className = 'actions-modal-open';
  const body = document.body;
  if (isOpen) {
    body.classList.add(className);
  } else {
    body.classList.remove(className);
  }
}

const handleEsc = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    emitClose();
  }
};

onMounted(() => {
  if (props.open) toggleBodyScroll(true);
  window.addEventListener('keydown', handleEsc);
});

onBeforeUnmount(() => {
  toggleBodyScroll(false);
  window.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
.tab {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  color: #0f172a;
}
.tab.active {
  background: #ffffff;
  font-weight: 600;
}

.modal-body {
  max-height: calc(90vh - 140px);
  overflow-y: auto;
  padding: 1.25rem;
}

:global(body.actions-modal-open) {
  overflow: hidden;
}
</style>
