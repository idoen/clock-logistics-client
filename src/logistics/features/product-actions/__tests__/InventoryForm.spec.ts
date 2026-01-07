import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ref, type Ref } from 'vue';
import InventoryForm from '@/logistics/features/product-actions/InventoryForm.vue';

let mutateSpy: ReturnType<typeof vi.fn>;
let pendingRef: Ref<boolean> | null = null;

vi.mock('@/logistics/mutations/useUpdateInventory', () => ({
  useUpdateInventory: (options?: { onSuccess?: () => void }) => {
    mutateSpy = vi.fn(() => {
      options?.onSuccess?.();
    });

    if (!pendingRef) {
      pendingRef = ref(false);
    }

    return {
      mutate: mutateSpy,
      isPending: pendingRef,
    };
  },
}));

describe('InventoryForm', () => {
  beforeEach(() => {
    pendingRef = ref(false);
  });

  it('submits inventory values and emits submitted on success', async () => {
    const wrapper = mount(InventoryForm, {
      props: { productId: 42 },
    });

    const inputs = wrapper.findAll('input[type="number"]');
    await inputs[0].setValue('12');
    await inputs[1].setValue('4');
    await inputs[2].setValue('9');

    await wrapper.find('form').trigger('submit');

    expect(mutateSpy).toHaveBeenCalledWith({
      productId: 42,
      payload: { onHand: 12, reserved: 4, inTransit: 9 },
    });
    expect(wrapper.emitted('submitted')).toHaveLength(1);
  });

  it('disables the submit button while mutation is pending', () => {
    pendingRef = ref(true);

    const wrapper = mount(InventoryForm, {
      props: { productId: 7 },
    });

    const submitButton = wrapper.get('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });
});
