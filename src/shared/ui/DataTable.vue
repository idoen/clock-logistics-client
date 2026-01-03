<template>
  <div class="table-shell" dir="rtl">
    <table class="table-root">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key as string"
            class="th"
            :class="col.headerClass"
            :dir="col.dir ?? 'auto'"
          >
            <span class="th-content">
              <span class="label">{{ col.label }}</span>
              <span v-if="col.info" class="info-icon" :title="col.info" role="img" aria-label="מידע">
                i
              </span>
            </span>
            <span v-if="col.sortable" class="sort-controls" role="group" aria-label="מיון עמודה">
              <button
                type="button"
                class="sort-btn"
                :class="{ active: sortKey === col.key && sortDir === 'asc' }"
                @click="emitSort(col.key, 'asc')"
                :aria-pressed="sortKey === col.key && sortDir === 'asc'"
                aria-label="מיון עולה"
              >
                ▲
              </button>
              <button
                type="button"
                class="sort-btn"
                :class="{ active: sortKey === col.key && sortDir === 'desc' }"
                @click="emitSort(col.key, 'desc')"
                :aria-pressed="sortKey === col.key && sortDir === 'desc'"
                aria-label="מיון יורד"
              >
                ▼
              </button>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="rows.length > 0">
          <tr v-for="row in rows" :key="rowKey(row)" class="tr">
            <td
              v-for="col in columns"
              :key="col.key as string"
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

<script setup lang="ts">
type ColumnKey = string | number | symbol;

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

const props = defineProps<{
  columns: Column<any>[];
  rows: any[];
  rowKey?: (row: any) => string | number;
  sortKey?: ColumnKey | null;
  sortDir?: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'sort', payload: { key: ColumnKey; dir: 'asc' | 'desc' }): void;
}>();

const rowKey = (row: any) => props.rowKey?.(row) ?? row.id ?? row.sku ?? JSON.stringify(row);

const emitSort = (key: ColumnKey, dir: 'asc' | 'desc') => {
  emit('sort', { key, dir });
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
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-inline-end: 0.45rem;
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

.sort-controls {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
  background: #e2e8f0;
  border-radius: 999px;
  padding: 0.1rem 0.2rem;
}

.sort-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.75rem;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: #cbd5f0;
  color: #1e293b;
}

.sort-btn.active {
  background: #0ea5e9;
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
