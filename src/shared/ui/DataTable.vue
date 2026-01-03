<template>
  <div class="table-shell" dir="rtl">
    <table class="table-root">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="columnKey(col.key)"
            class="th"
            :class="col.headerClass"
          >
            <span class="th-content">
              <button
                v-if="col.sortable"
                type="button"
                class="sort-btn"
                :class="{ active: isActive(col.key) }"
                @click="emitSort(col.key)"
                :aria-pressed="isActive(col.key)"
                :aria-label="`${col.label}: ${sortAriaLabel(col.key)}`"
              >
                <span aria-hidden="true">{{ sortIcon(col.key) }}</span>
                <span class="sr-only">{{ sortAriaLabel(col.key) }}</span>
              </button>
              <span class="label-group">
                <span class="label">{{ col.label }}</span>
                <span v-if="col.info" class="info-icon" :title="col.info" role="img" :aria-label="props.infoLabel">
                  i
                </span>
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="rows.length > 0">
          <tr v-for="row in rows" :key="rowKey(row)" class="tr">
            <td
              v-for="col in columns"
              :key="columnKey(col.key)"
              class="td"
              :class="col.cellClass"
              :data-label="col.label"
              :dir="col.dir ?? 'auto'"
            >
              <slot :name="`cell-${String(col.key)}`" :row="row">
                {{ col.formatter ? col.formatter(row[col.key as keyof typeof row], row) : row[col.key as keyof typeof row] }}
              </slot>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="columns.length" class="empty-state">אין נתונים להצגה</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { ColumnKey, SortDirection } from '../utils/tableSort';

type Column<T> = {
  key: keyof T | ColumnKey;
  label: string;
  info?: string;
  formatter?: (value: unknown, row: T) => unknown;
  headerClass?: string;
  cellClass?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  sortable?: boolean;
};

const props = withDefaults(defineProps<{
  columns: Column<T>[];
  rows: T[];
  rowKey?: (row: T) => string | number;
  sortKey?: ColumnKey | null;
  sortDir?: SortDirection;
  sortAscLabel?: string;
  sortDescLabel?: string;
  infoLabel?: string;
}>(), {
  sortAscLabel: 'מיון עולה',
  sortDescLabel: 'מיון יורד',
  infoLabel: 'מידע',
});

const emit = defineEmits<{
  (e: 'sort', payload: { key: ColumnKey; dir: SortDirection }): void;
}>();

const rowKey = (row: T) => props.rowKey?.(row) ?? (row as any).id ?? (row as any).sku ?? JSON.stringify(row);

const columnKey = (key: ColumnKey) => (typeof key === 'symbol' ? key.toString() : String(key));

const isActive = (key: ColumnKey) => props.sortKey === key;

const nextDir = (key: ColumnKey): SortDirection => {
  if (!isActive(key)) return 'asc';
  return props.sortDir === 'desc' ? 'asc' : 'desc';
};

const sortIcon = (key: ColumnKey) => {
  if (!isActive(key)) return '▲';
  return props.sortDir === 'desc' ? '▼' : '▲';
};

const sortAriaLabel = (key: ColumnKey) => (nextDir(key) === 'desc' ? props.sortDescLabel : props.sortAscLabel);

const emitSort = (key: ColumnKey) => {
  emit('sort', { key, dir: nextDir(key) });
};
</script>

<style scoped>
.table-shell {
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.04);
}

.table-root {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

thead {
  background: #f1f5f9;
}

.th {
  padding: 0.7rem 0.9rem;
  text-align: right;
  font-weight: 600;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  unicode-bidi: plaintext;
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  width: 100%;
  direction: rtl;
}

.label-group {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  flex: 1 1 auto;
  text-align: right;
}

.label {
  min-width: 0;
  white-space: normal;
}

.sort-btn,
.info-icon {
  flex: 0 0 auto;
}

.sort-btn {
  margin-inline-end: 0.5rem;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #cbd5e1;
  color: #f1f5f9;
  font-size: 0.7rem;
  font-style: italic;
  font-weight: 700;
  cursor: help;
  line-height: 1;
}

.sort-btn {
  border: 1px solid transparent;
  background: #e2e8f0;
  color: #475569;
  font-size: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: #cbd5f0;
  color: #1e293b;
}

.sort-btn.active {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.25);
}

.tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.tr:last-child {
  border-bottom: none;
}

.tr:hover {
  background: #f8fafc;
}

.td {
  padding: 0.7rem 0.9rem;
  vertical-align: middle;
  color: #1e293b;
  white-space: normal;
  text-align: right;
  unicode-bidi: plaintext;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 768px) {
  .table-shell {
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .table-root,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }

  thead {
    display: none;
  }

  .tr {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    margin: 0.75rem 0;
    background: #ffffff;
    box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
  }
  .tr:last-child {
    border: 1px solid #e2e8f0;
  }

  .td {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 0.9rem 1.1rem;
    white-space: normal;
    text-align: right;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .td:last-child {
    border-bottom: none;
  }

  .td::before {
    content: attr(data-label);
    font-weight: 700;
    color: #475569;
    font-size: 0.8rem;
    direction: auto;
    unicode-bidi: plaintext;
  }
  
  .empty-state {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    margin: 0.75rem 0;
    background: #ffffff;
    box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
  }
}
</style>
