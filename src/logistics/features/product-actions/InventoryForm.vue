<script setup lang="ts">
import { ref } from 'vue'
import { useUpdateInventory } from '../../mutations/useUpdateInventory'
import { useToastBus } from '@/shared/ui/ToastBus'

const props = defineProps<{ productId: number }>()
const emit = defineEmits<{ done: [] }>()

const onHand = ref<number>(0)
const reserved = ref<number>(0)
const inTransit = ref<number>(0)

const mutation = useUpdateInventory()
const toast = useToastBus()

async function submit() {
  await mutation.mutateAsync({ productId: props.productId, onHand: onHand.value, reserved: reserved.value, inTransit: inTransit.value })
  toast.push('Inventory updated')
  emit('done')
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="form-grid">
      <label class="label">
        On Hand
        <input v-model.number="onHand" type="number" min="0" required class="input" />
      </label>
      <label class="label">
        Reserved
        <input v-model.number="reserved" type="number" min="0" required class="input" />
      </label>
      <label class="label">
        In Transit
        <input v-model.number="inTransit" type="number" min="0" required class="input" />
      </label>
    </div>
    <button type="submit" class="button primary" :disabled="Boolean(mutation.isPending)" style="margin-top: 12px;">Save</button>
    <div v-if="mutation.error" style="color: #b91c1c; margin-top: 8px;">{{ (mutation.error as any).message }}</div>
  </form>
</template>
