import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DataTable from '../DataTable.vue';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'qty', label: 'Qty' },
];

describe('DataTable', () => {
  it('renders an empty state when there are no rows', () => {
    const wrapper = mount(DataTable, {
      props: {
        columns,
        rows: [],
      },
    });

    expect(wrapper.find('tbody').text()).toContain('אין נתונים להצגה');
  });

  it('emits sort events with the next direction', async () => {
    const wrapper = mount(DataTable, {
      props: {
        columns,
        rows: [{ name: 'Alpha', qty: 2 }],
        sortKey: 'name',
        sortDir: 'asc',
      },
    });

    await wrapper.get('button.sort-btn').trigger('click');

    expect(wrapper.emitted('sort')).toEqual([[{ key: 'name', dir: 'desc' }]]);
  });

  it('renders slot content for cells', () => {
    const wrapper = mount(DataTable, {
      props: {
        columns,
        rows: [{ name: 'Alpha', qty: 2 }],
      },
      slots: {
        'cell-name': ({ row }: { row: { name: string } }) => `Custom ${row.name}`,
      },
    });

    expect(wrapper.text()).toContain('Custom Alpha');
  });
});
