<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useCreateOverride } from '../../mutations/useCreateOverride'
import { useDisableOverride } from '../../mutations/useDisableOverride'
import { qk } from '../../queries/keys'
import { useToastBus } from '@/shared/ui/ToastBus'

const props = defineProps<{ productId: number }>()

const overrideRopUnits = ref<number | null>(null)
const overrideOrderQty = ref<number | null>(null)
const reason = ref('')

const createMutation = useCreateOverride()
const disableMutation = useDisableOverride()
const toast = useToastBus()
const queryClient = useQueryClient()

const overrideId = computed(() => {
  const map = (queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) ?? {}) as Record<number, number>
  return map[props.productId]
})

async function submit() {
  await createMutation.mutateAsync({
    productId: props.productId,
    overrideRopUnits: overrideRopUnits.value ?? undefined,
    overrideOrderQty: overrideOrderQty.value ?? undefined,
    reason: reason.value || undefined,
  })
  toast.push('Override created')
}

async function disable() {
  if (!overrideId.value) return
  await disableMutation.mutateAsync(overrideId.value)
  toast.push('Override disabled')
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="form-grid">
      <label class="label">
        Override ROP Units
        <input v-model.number="overrideRopUnits" type="number" min="0" class="input" />
      </label>
      <label class="label">
        Override Order Qty
        <input v-model.number="overrideOrderQty" type="number" min="0" class="input" />
      </label>
      <label class="label">
        Reason
        <textarea v-model="reason" maxlength="200" class="input" rows="3"></textarea>
      </label>
    </div>
    <div v-if="createMutation.error" style="color: #b91c1c; margin-top: 8px;">{{ (createMutation.error as any).message }}</div>
    <button type="submit" class="button primary" :disabled="Boolean(createMutation.isPending)" style="margin-top: 12px;">Save</button>
  </form>
  <div v-if="overrideId" style="margin-top: 16px;">
    <strong>Override active (id: {{ overrideId }})</strong>
    <div>
      <button class="button" @click="disable" :disabled="Boolean(disableMutation.isPending)">Disable override</button>
    </div>
  </div>
</template>
