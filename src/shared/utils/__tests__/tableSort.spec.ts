import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useTableSort } from '../tableSort';

type Row = {
  id: number;
  name: string;
  active: boolean | null;
  score?: number | null;
};

describe('useTableSort', () => {
  it('sorts rows by numeric and string values', () => {
    const rows = ref<Row[]>([
      { id: 2, name: 'Beta', active: true, score: 10 },
      { id: 1, name: 'Alpha', active: false, score: 5 },
      { id: 3, name: 'Gamma', active: true, score: null },
    ]);

    const { sortedRows, setSort } = useTableSort(rows, [{ key: 'id' }, { key: 'name' }], 'id', 'asc', 'en');

    expect(sortedRows.value.map((row) => row.id)).toEqual([1, 2, 3]);

    setSort({ key: 'name', dir: 'desc' });
    expect(sortedRows.value.map((row) => row.name)).toEqual(['Gamma', 'Beta', 'Alpha']);
  });

  it('places nullish values last and sorts booleans', () => {
    const rows = ref<Row[]>([
      { id: 1, name: 'Row A', active: null, score: 1 },
      { id: 2, name: 'Row B', active: false, score: 2 },
      { id: 3, name: 'Row C', active: true, score: 3 },
    ]);

    const { sortedRows, setSort } = useTableSort(rows, [{ key: 'active' }], 'active', 'asc', 'en');

    expect(sortedRows.value.map((row) => row.active)).toEqual([false, true, null]);

    setSort({ key: 'active', dir: 'desc' });
    expect(sortedRows.value.map((row) => row.active)).toEqual([true, false, null]);
  });

  it('uses custom sort value resolvers when provided', () => {
    const rows = ref<Row[]>([
      { id: 1, name: 'Row A', active: true, score: 7 },
      { id: 2, name: 'Row B', active: false, score: 3 },
    ]);

    const { sortedRows } = useTableSort(
      rows,
      [
        {
          key: 'score',
          sortValue: (row) => row.score ?? 0,
        },
      ],
      'score',
      'desc',
      'en',
    );

    expect(sortedRows.value.map((row) => row.id)).toEqual([1, 2]);
  });
});
