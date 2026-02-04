import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import ProductActionsDrawer from '../ProductActionsDrawer.vue';

describe('ProductActionsDrawer', () => {
  const factory = (props?: Partial<InstanceType<typeof ProductActionsDrawer>['$props']>) =>
    mount(ProductActionsDrawer, {
      props: {
        productId: 10,
        open: true,
        ...props,
      },
      global: {
        stubs: {
          Teleport: true,
          PurchaseOrderForm: { template: '<div data-test="po-form" />' },
          OverrideForm: { template: '<div data-test="override-form" />' },
          InventoryForm: { template: '<div data-test="inventory-form" />' },
        },
      },
      attachTo: document.body,
    });

  it('locks and unlocks body scroll based on open state', async () => {
    const wrapper = factory();

    expect(document.body.dataset.productActionsScrollLock).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');

    await wrapper.setProps({ open: false });
    await nextTick();

    expect(document.body.dataset.productActionsScrollLock).toBeUndefined();
    expect(document.body.style.overflow).toBe('');

    wrapper.unmount();
  });

  it('emits close on Escape key', async () => {
    const wrapper = factory();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('switches tabs and renders the correct form', async () => {
    const wrapper = factory({ initialTab: 'override' });

    expect(wrapper.find('[data-test="override-form"]').exists()).toBe(true);

    const tabs = wrapper.findAll('button.tab');
    await tabs[2].trigger('click');

    expect(wrapper.find('[data-test="inventory-form"]').exists()).toBe(true);
  });
});
