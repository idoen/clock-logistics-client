<script setup lang="ts">
import { ref } from 'vue'
import { useCreatePurchaseOrder } from '../../mutations/useCreatePurchaseOrder'
import { useToastBus } from '@/shared/ui/ToastBus'

const props = defineProps<{ productId: number; defaultQty?: number; defaultExpectedArrival?: string }>()
const emit = defineEmits<{ done: [] }>()

const qtyOrdered = ref<number>(props.defaultQty ?? 1)
const expectedArrival = ref<string>(props.defaultExpectedArrival ?? '')

const mutation = useCreatePurchaseOrder()
const toast = useToastBus()

async function submit() {
  await mutation.mutateAsync({ productId: props.productId, qtyOrdered: qtyOrdered.value, expectedArrival: expectedArrival.value })
  toast.push('PO created')
  emit('done')
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="form-grid">
      <label class="label">
        Qty Ordered
        <input v-model.number="qtyOrdered" type="number" min="1" required class="input" />
      </label>
      <label class="label">
        Expected Arrival
        <input v-model="expectedArrival" type="date" required class="input" />
      </label>
    </div>
    <p class="helper" style="margin-top: 8px;">המלצה כבר מעוגלת ל־pack_size ומכבדת min order qty.</p>
    <button class="button primary" type="submit" :disabled="Boolean(mutation.isPending)" style="margin-top: 12px;">Submit</button>
    <div v-if="mutation.error" style="color: #b91c1c; margin-top: 8px;">{{ (mutation.error as any).message }}</div>
  </form>
</template>
