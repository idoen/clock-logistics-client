import { computed, ref, type Ref } from 'vue';

export type SortDirection = 'asc' | 'desc';
export type ColumnKey = string | number | symbol;
export type SortValueResolver<T> = (row: T) => unknown;
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

const sortRows = <T>(rows: T[], getValue: SortValueResolver<T>, dir: SortDirection, locale: string) => {
  const direction = dir === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => compareValues(getValue(a), getValue(b), direction, locale));
};

export const useTableSort = <T>(
  rows: Ref<T[]>,
  columns: SortableColumn<T>[],
  initialKey: ColumnKey | null = null,
  initialDir: SortDirection = 'asc',
  locale = 'he',
) => {
  const sortKey = ref<ColumnKey | null>(initialKey);
  const sortDir = ref<SortDirection>(initialDir);

  const sortedRows = computed(() => {
    const key = sortKey.value;
    if (!key) return rows.value;
    const column = columns.find((col) => Object.is(col.key, key));
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
