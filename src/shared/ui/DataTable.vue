<template>
  <div class="data-table">
    <div class="data-table__container">
      <table class="data-table__table">
        <thead class="data-table__head">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key as string"
              class="data-table__th"
              :class="col.headerClass"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="data-table__body">
          <tr v-for="row in rows" :key="rowKey(row)" class="data-table__row">
            <td
              v-for="col in columns"
              :key="col.key as string"
              class="data-table__td"
              :class="col.cellClass"
              :data-label="col.label"
            >
              <slot :name="`cell-${String(col.key)}`" :row="row">
                {{ col.formatter ? col.formatter(row[col.key as keyof typeof row], row) : row[col.key as keyof typeof row] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
type Column<T> = {
  key: keyof T | string;
  label: string;
  formatter?: (value: unknown, row: T) => unknown;
  headerClass?: string;
  cellClass?: string;
};

const props = defineProps<{
  columns: Column<any>[];
  rows: any[];
  rowKey?: (row: any) => string | number;
}>();

const rowKey = (row: any) => props.rowKey?.(row) ?? row.id ?? row.sku ?? JSON.stringify(row);
</script>

<style scoped>
.data-table {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.data-table__container {
  overflow-x: auto;
  border-radius: 12px;
}

.data-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.data-table__head {
  background: #f8fafc;
}

.data-table__th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  border-bottom: 1px solid #e2e8f0;
}

.data-table__body {
  color: #0f172a;
}

.data-table__row:hover {
  background: #f8fafc;
}

.data-table__td {
  padding: 0.75rem 1rem;
  vertical-align: top;
  border-top: 1px solid #f1f5f9;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .data-table__head {
    display: none;
  }

  .data-table__table,
  .data-table__body,
  .data-table__row,
  .data-table__td {
    display: block;
    width: 100%;
  }

  .data-table__row {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .data-table__td {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    white-space: normal;
  }

  .data-table__td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #475569;
    flex: 0 0 45%;
    text-transform: none;
  }

  .data-table__td:last-child {
    padding-bottom: 0.75rem;
  }
}
</style>
