<template>
  <div class="table-shell" dir="ltr">
    <table class="table-root">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key as string"
            class="th"
            :class="col.headerClass"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="rowKey(row)" class="tr">
          <td
            v-for="col in columns"
            :key="col.key as string"
            class="td"
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
.table-shell {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.table-root {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead {
  background: #f8fafc;
}

.th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

.tr:hover {
  background: #f8fafc;
}

.td {
  padding: 0.75rem 1rem;
  vertical-align: top;
  color: #0f172a;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .table-shell {
    border-radius: 12px;
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
    border-radius: 10px;
    margin: 0.5rem 0;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .td {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 0.85rem 1rem;
    white-space: normal;
  }

  .td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    font-size: 0.75rem;
  }
}
</style>
