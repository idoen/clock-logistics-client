<template>
  <div class="data-table rounded-lg border border-slate-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-slate-200 text-sm">
      <thead class="bg-slate-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key as string"
            class="px-4 py-2 text-left font-semibold text-slate-700 whitespace-nowrap"
            :class="col.headerClass"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-for="row in rows" :key="rowKey(row)" class="hover:bg-slate-50">
          <td
            v-for="col in columns"
            :key="col.key as string"
            class="px-4 py-2 whitespace-nowrap align-top"
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
.data-table {
  overflow-x: auto;
}

@media (max-width: 640px) {
  .data-table {
    overflow-x: visible;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead {
    display: none;
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  tr {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 0.75rem;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  }

  td {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
    padding: 0.35rem 0;
    white-space: normal;
  }

  td::before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 0.85rem;
    color: #475569;
    text-transform: none;
  }

  tr:hover {
    background: #ffffff;
  }
}
</style>
