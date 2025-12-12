<template>
  <form @submit.prevent="submit">
    <div class="input-group">
      <label>On hand</label>
      <input class="input" type="number" min="0" v-model.number="onHand" required />
    </div>
    <div class="input-group">
      <label>Reserved</label>
      <input class="input" type="number" min="0" v-model.number="reserved" required />
    </div>
    <div class="input-group">
      <label>In transit</label>
      <input class="input" type="number" min="0" v-model.number="inTransit" required />
    </div>
    <button class="btn btn-primary" type="submit" :disabled="mutation.isPending.value">Update inventory</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUpdateInventory } from "../../mutations/useUpdateInventory";

const props = defineProps<{ productId: number }>();
const emit = defineEmits<{ submitted: [] }>();

const onHand = ref<number>(0);
const reserved = ref<number>(0);
const inTransit = ref<number>(0);

const mutation = useUpdateInventory();

function submit() {
  mutation.mutate(
    { productId: props.productId, onHand: onHand.value, reserved: reserved.value, inTransit: inTransit.value },
    { onSuccess: () => emit("submitted") },
  );
}
</script>
