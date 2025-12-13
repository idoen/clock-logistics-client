<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-3">
      <label class="flex flex-col text-sm font-medium text-slate-700">
        Override ROP Units
        <input v-model.number="overrideRopUnits" type="number" min="0" class="input" />
      </label>
      <label class="flex flex-col text-sm font-medium text-slate-700">
        Override Order Qty
        <input v-model.number="overrideOrderQty" type="number" min="0" class="input" />
      </label>
    </div>
    <label class="flex flex-col text-sm font-medium text-slate-700">
      Reason
      <textarea v-model="reason" maxlength="200" class="input" rows="3" />
    </label>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <div class="flex items-center gap-3">
      <button type="submit" class="btn primary" :disabled="createMutation.isPending.value">Save override</button>
      <button
        v-if="overrideId"
        type="button"
        class="btn"
        :disabled="disableMutation.isPending.value"
        @click="disableOverride"
      >
        Disable override (id: {{ overrideId }})
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useCreateOverride } from '../../mutations/useCreateOverride';
import { useDisableOverride } from '../../mutations/useDisableOverride';
import { qk } from '../../queries/keys';

const props = defineProps<{ productId: number }>();
const emit = defineEmits<{ (e: 'submitted'): void }>();

const overrideRopUnits = ref<number | null>(null);
const overrideOrderQty = ref<number | null>(null);
const reason = ref('');
const error = ref('');

const queryClient = useQueryClient();
const overrideId = computed(() => {
  const cache = queryClient.getQueryData<Record<number, number>>(qk.overridesLocal());
  return cache?.[props.productId] ?? null;
});

const createMutation = useCreateOverride({
  onSuccess: () => emit('submitted'),
});

const disableMutation = useDisableOverride({
  onSuccess: () => emit('submitted'),
});

function onSubmit() {
  if (!overrideRopUnits.value && !overrideOrderQty.value) {
    error.value = 'חייב להזין לפחות ערך אחד';
    return;
  }
  error.value = '';
  createMutation.mutate({
    productId: props.productId,
    overrideRopUnits: overrideRopUnits.value ?? undefined,
    overrideOrderQty: overrideOrderQty.value ?? undefined,
    reason: reason.value || undefined,
  });
}

function disableOverride() {
  if (overrideId.value) {
    disableMutation.mutate(overrideId.value);
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: #fff;
}
.btn {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}
.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
}
</style>
