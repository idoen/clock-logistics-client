<template>
  <form @submit.prevent="submit">
    <div class="input-group">
      <label>Quantity ordered</label>
      <input class="input" type="number" min="1" v-model.number="qtyOrdered" required />
    </div>
    <div class="input-group">
      <label>Expected arrival</label>
      <input class="input" type="date" v-model="expectedArrival" required />
      <small class="text-muted">המלצה כבר מעוגלת ל־pack_size ומכבדת min order qty.</small>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="mutation.isPending.value">Create PO</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useCreatePurchaseOrder } from "../../mutations/useCreatePurchaseOrder";

const props = defineProps<{ productId: number; defaultQty?: number; defaultDate?: string }>();
const emit = defineEmits<{ submitted: [] }>();

const qtyOrdered = ref<number>(props.defaultQty ?? 1);
const expectedArrival = ref<string>(props.defaultDate ?? "");

const mutation = useCreatePurchaseOrder();

watch(
  () => props.defaultQty,
  (value) => {
    if (value !== undefined) qtyOrdered.value = value;
  },
);
watch(
  () => props.defaultDate,
  (value) => {
    if (value) expectedArrival.value = value;
  },
);

function submit() {
  mutation.mutate(
    { productId: props.productId, qtyOrdered: qtyOrdered.value, expectedArrival: expectedArrival.value },
    { onSuccess: () => emit("submitted") },
  );
}
</script>
