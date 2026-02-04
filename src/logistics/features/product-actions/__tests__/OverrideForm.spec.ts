import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref, type Ref } from 'vue';
import OverrideForm from '../OverrideForm.vue';

let createMutateSpy: ReturnType<typeof vi.fn>;
let disableMutateSpy: ReturnType<typeof vi.fn>;
let createPendingRef: Ref<boolean>;
let disablePendingRef: Ref<boolean>;
let mockGetQueryData: ReturnType<typeof vi.fn>;

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => ({
    getQueryData: (...args: unknown[]) => mockGetQueryData(...args),
  }),
}));

vi.mock('@/logistics/mutations/useCreateOverride', () => ({
  useCreateOverride: (options?: { onSuccess?: () => void }) => {
    createMutateSpy = vi.fn(() => {
      options?.onSuccess?.();
    });
    return {
      mutate: createMutateSpy,
      isPending: createPendingRef,
    };
  },
}));

vi.mock('@/logistics/mutations/useDisableOverride', () => ({
  useDisableOverride: (options?: { onSuccess?: () => void }) => {
    disableMutateSpy = vi.fn(() => {
      options?.onSuccess?.();
    });
    return {
      mutate: disableMutateSpy,
      isPending: disablePendingRef,
    };
  },
}));

describe('OverrideForm', () => {
  beforeEach(() => {
    createPendingRef = ref(false);
    disablePendingRef = ref(false);
    mockGetQueryData = vi.fn(() => ({}));
  });

  it('shows an error when no values are provided', async () => {
    const wrapper = mount(OverrideForm, {
      props: { productId: 101 },
    });

    await wrapper.get('form').trigger('submit');

    expect(wrapper.text()).toContain('חייב להזין לפחות ערך אחד');
    expect(createMutateSpy).not.toHaveBeenCalled();
  });

  it('submits override values and emits submitted on success', async () => {
    const wrapper = mount(OverrideForm, {
      props: { productId: 202 },
    });

    const inputs = wrapper.findAll('input[type="number"]');
    await inputs[0].setValue('5');
    await inputs[1].setValue('10');
    await wrapper.get('textarea').setValue('Reason text');

    await wrapper.get('form').trigger('submit');

    expect(createMutateSpy).toHaveBeenCalledWith({
      productId: 202,
      overrideRopUnits: 5,
      overrideOrderQty: 10,
      reason: 'Reason text',
    });
    expect(wrapper.emitted('submitted')).toHaveLength(1);
  });

  it('disables an existing override when requested', async () => {
    mockGetQueryData = vi.fn(() => ({ 303: 88 }));

    const wrapper = mount(OverrideForm, {
      props: { productId: 303 },
    });

    const disableButton = wrapper.get('button[type="button"]');
    await disableButton.trigger('click');

    expect(disableMutateSpy).toHaveBeenCalledWith(88);
    expect(wrapper.emitted('submitted')).toHaveLength(1);
  });
});
