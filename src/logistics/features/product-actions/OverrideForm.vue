<template>
  <form @submit.prevent="submit">
    <div class="input-group">
      <label>overrideRopUnits</label>
      <input class="input" type="number" min="0" v-model.number="overrideRopUnits" />
    </div>
    <div class="input-group">
      <label>overrideOrderQty</label>
      <input class="input" type="number" min="0" v-model.number="overrideOrderQty" />
    </div>
    <div class="input-group">
      <label>Reason</label>
      <textarea class="input" maxlength="200" v-model="reason" rows="3"></textarea>
    </div>
    <div v-if="error" class="text-danger" style="margin-bottom:8px;">{{ error }}</div>
    <button class="btn btn-primary" type="submit" :disabled="mutation.isPending.value">Save override</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCreateOverride } from "../../mutations/useCreateOverride";

const props = defineProps<{ productId: number }>();
const emit = defineEmits<{ submitted: [] }>();

const overrideRopUnits = ref<number | null>(null);
const overrideOrderQty = ref<number | null>(null);
const reason = ref<string>("");
const error = ref<string>("");

const mutation = useCreateOverride();

function submit() {
  if ((overrideRopUnits.value ?? null) === null && (overrideOrderQty.value ?? null) === null) {
    error.value = "חייב להזין לפחות ערך אחד";
    return;
  }
  error.value = "";
  mutation.mutate(
    {
      productId: props.productId,
      overrideRopUnits: overrideRopUnits.value ?? undefined,
      overrideOrderQty: overrideOrderQty.value ?? undefined,
      reason: reason.value || undefined,
    },
    { onSuccess: () => emit("submitted") },
  );
}
</script>
