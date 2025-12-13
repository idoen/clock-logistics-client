<template>
  <Teleport to="body" :disabled="!isModal">
    <div
      v-if="open"
      :class="wrapperClass"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <div :class="panelClass">
        <div class="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 class="text-lg font-semibold">Actions – {{ title }}</h3>
            <p class="text-xs text-slate-500">Product ID: {{ productId }}</p>
          </div>
          <button class="text-slate-500" @click="$emit('close')">✕</button>
        </div>
        <div class="border-b px-4 pt-3">
          <div class="flex gap-2">
            <button
              class="tab"
              :class="{ active: activeTab === 'po' }"
              @click="activeTab = 'po'"
            >
              Purchase Order
            </button>
            <button class="tab" :class="{ active: activeTab === 'override' }" @click="activeTab = 'override'">
              Override
            </button>
            <button class="tab" :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'">
              Inventory
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto" :class="{ 'modal-body': variant === 'modal' }">
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
import { Teleport, computed, onBeforeUnmount, ref, watch } from 'vue';
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
  variant?: 'drawer' | 'modal';
}>();

const emit = defineEmits<{ (e: 'close'): void }>();
const activeTab = ref<'po' | 'override' | 'inventory'>(props.initialTab ?? 'po');

watch(
  () => props.initialTab,
  (val) => {
    if (val) activeTab.value = val;
  },
);

const variant = computed(() => props.variant ?? 'modal');
const isModal = computed(() => variant.value === 'modal');

const wrapperClass = computed(() =>
  isModal.value
    ? 'fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'
    : 'fixed inset-0 z-40 flex justify-end bg-black/30',
);

const panelClass = computed(() =>
  isModal.value
    ? 'w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col'
    : 'w-full max-w-lg bg-white shadow-xl overflow-y-auto',
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

    if (isModal.value) {
      lockScroll(isOpen);
    }

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
  max-height: calc(90vh - 120px);
}
</style>
