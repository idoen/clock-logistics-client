<template>
  <form class="form-stack" @submit.prevent="onSubmit">
    <div class="grid">
      <label class="form-label">
        חריגת ROP (יחידות)
        <input v-model.number="overrideRopUnits" type="number" min="0" class="input" />
      </label>
      <label class="form-label">
        חריגת כמות להזמנה
        <input v-model.number="overrideOrderQty" type="number" min="0" class="input" />
      </label>
    </div>
    <label class="form-label">
      סיבה
      <textarea v-model="reason" maxlength="200" class="input" rows="3" />
    </label>
    <p v-if="error" class="error-text">{{ error }}</p>
    <div class="actions">
      <button type="submit" class="btn primary" :disabled="createMutation.isPending.value">שמור חריגה</button>
      <button
        v-if="overrideId"
        type="button"
        class="btn"
        :disabled="disableMutation.isPending.value"
        @click="disableOverride"
      >
        בטל חריגה (מזהה: {{ overrideId }})
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
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
  gap: 0.25rem;
}

.input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.6rem;
  background: #fff;
  font-size: 1rem;
}

.error-text {
  font-size: 0.9rem;
  color: #be123c;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.15);
}

.btn.primary:hover {
  background: #0284c7;
  border-color: #0284c7;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
