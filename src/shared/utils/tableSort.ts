import { computed, ref, type Ref } from 'vue';

export type SortDirection = 'asc' | 'desc';
export type ColumnKey = string | number | symbol;
export type SortValueResolver<T> = (row: T) => unknown;

/**
 * Base interface for sortable columns. Can be extended with additional properties.
 */
export type SortableColumn<T> = {
  key: ColumnKey;
  sortValue?: SortValueResolver<T>;
};

const compareValues = (aValue: unknown, bValue: unknown, direction: number, locale: string) => {
  const aMissing = aValue === null || aValue === undefined;
  const bMissing = bValue === null || bValue === undefined;

  if (aMissing && !bMissing) return 1;
  if (!aMissing && bMissing) return -1;
  if (aMissing && bMissing) return 0;

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return (aValue - bValue) * direction;
  }

  if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
    return (Number(aValue) - Number(bValue)) * direction;
  }

  const aText = String(aValue);
  const bText = String(bValue);
  return aText.localeCompare(bText, locale) * direction;
};

/**
 * Returns a sorted copy of the given rows.
 *
 * Note: This function clones the input array (`[...rows]`) to avoid mutating the
 * original data, which is important when `rows` is shared reactive state in Vue.
 * For very large datasets, this additional copy can have a non-trivial performance
 * cost. If you need to handle very large tables, consider using a specialized
 * sorting strategy (e.g. in-place sorting on a non-shared array or server-side
 * sorting) instead of this helper.
 */
const sortRows = <T>(rows: T[], getValue: SortValueResolver<T>, dir: SortDirection, locale: string) => {
  const direction = dir === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => compareValues(getValue(a), getValue(b), direction, locale));
};

export const useTableSort = <T, C extends SortableColumn<T> = SortableColumn<T>>(
  rows: Ref<T[]>,
  columns: C[],
  initialKey: ColumnKey | null = null,
  initialDir: SortDirection = 'asc',
  locale = Intl.DateTimeFormat().resolvedOptions().locale,
) => {
  const sortKey = ref<ColumnKey | null>(initialKey);
  const sortDir = ref<SortDirection>(initialDir);

  const sortedRows = computed(() => {
    const key = sortKey.value;
    if (!key) return rows.value;
    const column = columns.find((col) => col.key === key);
    const getValue = column?.sortValue ?? ((row: T) => (row as Record<ColumnKey, unknown>)[key]);
    return sortRows(rows.value, getValue, sortDir.value, locale);
  });

  const setSort = ({ key, dir }: { key: ColumnKey; dir: SortDirection }) => {
    sortKey.value = key;
    sortDir.value = dir;
  };

  return {
    sortKey,
    sortDir,
    sortedRows,
    setSort,
  };
};
