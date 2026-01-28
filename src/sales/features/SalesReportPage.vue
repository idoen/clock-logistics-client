<template>
  <div class="page-stack">
    <section class="intro">
      <div>
        <h2>דוח מכירות</h2>
        <p>דוח מכירות לפי פילטרים, זמינות ותקציב כדי לקבל החלטות מהירות למנהל המכירות.</p>
      </div>
    </section>

    <section class="card controls-card">
      <div class="card-header">
        <div>
          <h3>הגדרות דוח</h3>
          <p class="helper muted">בחרו פילטרים או תצורה, ואז הפיקו דוח להצגה.</p>
        </div>
        <button class="ghost-button" type="button" @click="clearFilters">נקה פילטרים</button>
      </div>
      <div class="controls-layout">
        <div class="filters-panel">
          <h4>פילטרים</h4>
          <div class="filter-grid">
            <label class="field">
              <span>תקציב (₪)</span>
              <input v-model.number="budget" type="number" min="0" placeholder="למשל 2500" />
            </label>
            <label class="field toggle-field">
              <span>במלאי בלבד</span>
              <input v-model="inStockOnly" type="checkbox" />
            </label>
            <label class="field">
              <span>קטגוריה</span>
              <select v-model="filters.category">
                <option value="">הכל</option>
                <option v-for="option in filterOptions.categories" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
            <label class="field">
              <span>מותג</span>
              <select v-model="filters.brand">
                <option value="">הכל</option>
                <option v-for="option in filterOptions.brands" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
            <label class="field">
              <span>מגדר</span>
              <select v-model="filters.gender">
                <option value="">הכל</option>
                <option v-for="option in filterOptions.genders" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
            <label class="field">
              <span>חומר</span>
              <select v-model="filters.material">
                <option value="">הכל</option>
                <option v-for="option in filterOptions.materials" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
            <label class="field">
              <span>מיון לפי</span>
              <select v-model="sortField">
                <option value="score">חיזוי שבועי</option>
                <option value="available">זמינות</option>
                <option value="price">מחיר</option>
                <option value="name">שם</option>
              </select>
            </label>
            <label class="field">
              <span>כיוון מיון</span>
              <select v-model="sortDirection">
                <option value="desc">יורד</option>
                <option value="asc">עולה</option>
              </select>
            </label>
          </div>
          <div v-if="activeFilterChips.length" class="chips">
            <span v-for="chip in activeFilterChips" :key="chip" class="chip">{{ chip }}</span>
          </div>
          <p v-if="filtersError" class="helper error">{{ filtersError }}</p>
        </div>
        <div class="presets-panel">
          <h4>תצורות</h4>
          <div class="preset-block">
            <label class="field">
              <span>בחירת תצורה קיימת</span>
              <select v-model="selectedPresetId">
                <option value="">בחר...</option>
                <option v-for="preset in presets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
              </select>
            </label>
            <button class="ghost-button" type="button" :disabled="!selectedPresetId" @click="deletePreset">
              מחק תצורה
            </button>
          </div>
          <p class="helper muted">בחירה בתצורה תעדכן את הפילטרים באופן אוטומטי.</p>
          <div class="preset-block">
            <label class="field">
              <span>שם תצורה חדשה</span>
              <input v-model.trim="newPresetName" type="text" placeholder="לדוגמה: נשים זהב" />
            </label>
            <button class="primary-button" type="button" :disabled="!canSavePreset" @click="savePreset">
              שמור תצורה
            </button>
          </div>
          <p class="helper muted">שומרים את מצב הפילטרים הנוכחי כתצורה.</p>
          <p v-if="presetError" class="helper error">{{ presetError }}</p>
        </div>
      </div>
      <div class="controls-actions">
        <button class="primary-button" type="button" @click="generateReport" :disabled="loading">
          הפק דוח
        </button>
      </div>
    </section>

    <section class="card table-card">
      <div class="table-header">
        <div>
          <h3>תוצאות הדוח</h3>
          <p class="helper muted">חיזוי שבועי מוצג ביחידות לשבוע.</p>
        </div>
        <div class="table-actions">
          <span class="summary">סה"כ תוצאות: {{ total }}</span>
          <button class="ghost-button" type="button" @click="exportCsv" :disabled="exporting || !hasReport">
            ייצוא CSV
          </button>
        </div>
      </div>
      <div v-if="error" class="error-banner">{{ error }}</div>

      <div v-if="!hasReport && !loading" class="empty-state">
        <h4>אין דוח להצגה</h4>
        <p>בחרו פילטרים והקליקו על "הפק דוח" כדי לראות תוצאות.</p>
      </div>

      <div v-else>
        <div v-if="loading" class="loading-state">
          <div class="spinner" />
          <span>טוען נתוני דוח...</span>
        </div>
        <div v-else-if="rows.length === 0" class="empty-state">
          <h4>אין תוצאות</h4>
          <p>נסו לשנות את הפילטרים או התקציב ולהפיק שוב.</p>
        </div>
        <div v-else>
          <DataTable :columns="columns" :rows="rows" :row-key="(row) => row.product_id">
            <template #cell-image_url="{ row }">
              <div class="image-cell">
                <img v-if="row.image_url" :src="row.image_url" :alt="row.name" />
                <span v-else>—</span>
              </div>
            </template>
            <template #cell-list_price="{ row }">
              {{ row.list_price == null ? '—' : formatNumber(row.list_price) }}
            </template>
            <template #cell-available="{ row }">
              {{ formatNumber(row.available, 0) }}
            </template>
            <template #cell-score="{ row }">
              {{ formatNumber(Math.ceil((row.score ?? 0) * 7), 0) }}
            </template>
          </DataTable>
        </div>
      </div>
      <div class="table-footer">
        <div class="pagination">
          <button type="button" class="ghost-button" @click="prevPage" :disabled="page <= 1 || !hasReport">
            הקודם
          </button>
          <span>עמוד {{ page }} מתוך {{ totalPages }}</span>
          <button
            type="button"
            class="ghost-button"
            @click="nextPage"
            :disabled="page >= totalPages || !hasReport"
          >
            הבא
          </button>
          <label class="field page-size">
            <span>כמות בעמוד</span>
            <select v-model.number="pageSize" @change="updatePagination">
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="200">200</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import DataTable from '../../shared/ui/DataTable.vue';
import { formatNumber } from '../../shared/utils/format';
import { exportSalesReportCsv, type SalesReportParams } from '../api/salesApi';
import { useSalesReport } from '../queries/useSalesReport';
import { useSalesReportFilters } from '../queries/useSalesReportFilters';
import { useSalesReportPresets } from '../queries/useSalesReportPresets';
import { useCreateSalesReportPreset } from '../mutations/useCreateSalesReportPreset';
import { useDeleteSalesReportPreset } from '../mutations/useDeleteSalesReportPreset';
import type { SalesReportFilters, SalesReportSort } from '../domain/types';

const filtersQuery = useSalesReportFilters();
const presetsQuery = useSalesReportPresets();

const budget = ref<number | null>(null);
const inStockOnly = ref(true);
const sortField = ref<SalesReportSort['field']>('score');
const sortDirection = ref<SalesReportSort['direction']>('desc');
const page = ref(1);
const pageSize = ref(20);
const filters = reactive<SalesReportFilters>({
  category: '',
  brand: '',
  gender: '',
  material: '',
  is_gold: '',
});

const appliedParams = ref<SalesReportParams | null>(null);
const reportQuery = useSalesReport(appliedParams);

const rows = computed(() => reportQuery.data.value?.rows ?? []);
const total = computed(() => reportQuery.data.value?.total ?? 0);
const loading = computed(() => reportQuery.isFetching.value);
const error = computed(() => (reportQuery.error.value ? reportQuery.error.value.message : null));
const hasReport = computed(() => appliedParams.value !== null);

const filtersError = computed(() => (filtersQuery.error.value ? filtersQuery.error.value.message : null));

const filterOptions = computed(() =>
  filtersQuery.data.value ?? {
    categories: [],
    brands: [],
    genders: [],
    materials: [],
    is_gold: [],
  },
);

const isGoldAllValue = computed(() => {
  const options = filterOptions.value?.is_gold ?? [];
  const lowered = options.map((option) => option.toLowerCase());
  const allIndex = lowered.findIndex((option) => option === 'all');
  if (allIndex >= 0) return options[allIndex];
  const hebrewIndex = options.findIndex((option) => option.includes('הכל'));
  if (hebrewIndex >= 0) return options[hebrewIndex];
  if (options.length > 0) return options[0];
  return 'ALL';
});

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

const activeFilters = computed(() => {
  const cleaned: SalesReportFilters = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'is_gold') return;
    if (value) {
      cleaned[key as keyof SalesReportFilters] = value;
    }
  });
  return cleaned;
});

const activeFilterChips = computed(() => {
  const chips: string[] = [];
  if (budget.value) chips.push(`תקציב עד ₪${budget.value}`);
  if (!inStockOnly.value) chips.push('כולל מוצרים מחוץ למלאי');
  Object.entries(activeFilters.value).forEach(([key, value]) => {
    const labelMap: Record<string, string> = {
      category: 'קטגוריה',
      brand: 'מותג',
      gender: 'מגדר',
      material: 'חומר',
    };
    chips.push(`${labelMap[key] ?? key}: ${value}`);
  });
  if (sortField.value && sortDirection.value) {
    chips.push(`מיון: ${sortLabel.value}`);
  }
  return chips;
});

const sortLabel = computed(() => {
  const fieldMap: Record<string, string> = {
    score: 'חיזוי שבועי',
    available: 'זמינות',
    price: 'מחיר',
    name: 'שם',
  };
  const directionMap: Record<string, string> = {
    asc: 'עולה',
    desc: 'יורד',
  };
  return `${fieldMap[sortField.value]} ${directionMap[sortDirection.value]}`;
});

const presets = computed(() => presetsQuery.data.value ?? []);
const selectedPresetId = ref<number | ''>('');
const newPresetName = ref('');
const presetError = ref<string | null>(null);
const createPresetMutation = useCreateSalesReportPreset();
const deletePresetMutation = useDeleteSalesReportPreset();

const columns = [
  { key: 'image_url', label: 'תמונה' },
  { key: 'sku', label: 'SKU', dir: 'ltr' },
  { key: 'name', label: 'שם', dir: 'auto' },
  { key: 'category', label: 'קטגוריה', dir: 'auto' },
  { key: 'list_price', label: 'מחיר', dir: 'ltr' },
  { key: 'currency', label: 'מטבע', dir: 'ltr' },
  { key: 'available', label: 'זמינות', dir: 'ltr' },
  { key: 'score', label: 'חיזוי שבועי', dir: 'ltr' },
];

const exporting = ref(false);

const canSavePreset = computed(() => newPresetName.value.trim().length > 0 && !createPresetMutation.isPending.value);

const STORAGE_KEY = 'sales-report-configuration-meta';

const savePresetMeta = (payload: { id: number; name?: string }) => {
  const meta = {
    id: payload.id,
    name: payload.name ?? '',
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
};

const loadPresetMeta = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { id: number; name?: string; updatedAt?: string };
  } catch {
    return null;
  }
};

const buildParams = (): SalesReportParams => {
  const filtersPayload: SalesReportFilters = {
    ...activeFilters.value,
    is_gold: isGoldAllValue.value,
  };
  return {
    budget: budget.value,
    filters: filtersPayload,
    inStockOnly: inStockOnly.value,
    sort: {
      field: sortField.value,
      direction: sortDirection.value,
    },
    page: page.value,
    pageSize: pageSize.value,
  };
};

const generateReport = () => {
  page.value = 1;
  appliedParams.value = buildParams();
};

const updatePagination = () => {
  page.value = 1;
  if (hasReport.value) {
    appliedParams.value = buildParams();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
    if (hasReport.value) {
      appliedParams.value = buildParams();
    }
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    if (hasReport.value) {
      appliedParams.value = buildParams();
    }
  }
};

const clearFilters = () => {
  budget.value = null;
  inStockOnly.value = true;
  sortField.value = 'score';
  sortDirection.value = 'desc';
  page.value = 1;
  pageSize.value = 20;
  Object.keys(filters).forEach((key) => {
    filters[key as keyof SalesReportFilters] = '';
  });
  appliedParams.value = null;
};

const exportCsv = async () => {
  exporting.value = true;
  try {
    const blob = await exportSalesReportCsv(buildParams());
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sales-report.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  } finally {
    exporting.value = false;
  }
};

const applySelectedPreset = () => {
  const preset = presets.value.find((item) => item.id === Number(selectedPresetId.value));
  if (!preset) return;
  budget.value = preset.budget ?? null;
  inStockOnly.value = preset.inStockOnly ?? true;
  sortField.value = preset.sort?.field ?? 'score';
  sortDirection.value = preset.sort?.direction ?? 'desc';
  const presetFilters = preset.filters ?? {};
  Object.keys(filters).forEach((key) => {
    filters[key as keyof SalesReportFilters] = presetFilters[key as keyof SalesReportFilters] ?? '';
  });
  filters.is_gold = '';
  savePresetMeta({ id: preset.id, name: preset.name });
};

const savePreset = async () => {
  presetError.value = null;
  try {
    const created = await createPresetMutation.mutateAsync({
      name: newPresetName.value.trim(),
      budget: budget.value,
      filters: activeFilters.value,
      inStockOnly: inStockOnly.value,
      sort: {
        field: sortField.value,
        direction: sortDirection.value,
      },
    });
    selectedPresetId.value = created.id;
    savePresetMeta({ id: created.id, name: created.name });
    newPresetName.value = '';
  } catch (err) {
    presetError.value = err instanceof Error ? err.message : 'שמירת התצורה נכשלה.';
  }
};

const deletePreset = async () => {
  presetError.value = null;
  if (!selectedPresetId.value) return;
  try {
    await deletePresetMutation.mutateAsync(Number(selectedPresetId.value));
    selectedPresetId.value = '';
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    presetError.value = err instanceof Error ? err.message : 'מחיקת התצורה נכשלה.';
  }
};

watch(
  [() => selectedPresetId.value, () => presets.value],
  ([value]) => {
    if (!value) return;
    const preset = presets.value.find((item) => item.id === Number(value));
    if (preset) {
      savePresetMeta({ id: preset.id, name: preset.name });
      applySelectedPreset();
    }
  },
);

onMounted(() => {
  const meta = loadPresetMeta();
  if (meta?.id) {
    selectedPresetId.value = meta.id;
  }
});
</script>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intro {
  background: linear-gradient(145deg, #e6f7ff, #d0e7ff);
  border: 1px solid #cce7ff;
  border-radius: 24px;
  padding: 1.5rem 2rem;
}

.intro h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
  color: #334155;
}

.field input,
.field select {
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.95rem;
}

.toggle-field {
  align-items: flex-start;
}

.toggle-field input {
  margin-top: 0.35rem;
  width: 18px;
  height: 18px;
}

.chips {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.controls-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.controls-layout h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.05rem;
  color: #0f172a;
}

.filters-panel,
.presets-panel {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
  background: #f8fafc;
}

.preset-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 0;
}

.preset-block + .preset-block {
  border-top: 1px dashed #e2e8f0;
}

.controls-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.primary-button,
.ghost-button {
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  background: #0ea5e9;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-button:hover:not(:disabled) {
  background: #0284c7;
}

.ghost-button {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.ghost-button:hover:not(:disabled) {
  background: #e2e8f0;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.page-size {
  max-width: 160px;
}

.summary {
  font-weight: 600;
  color: #475569;
}

.table-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.table-header h3 {
  margin: 0;
}

.table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.table-card {
  padding: 1.5rem;
}

.table-footer {
  margin-top: 1.5rem;
}

.error-banner {
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #be123c;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.image-cell {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
}

.image-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.helper {
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.helper.muted {
  color: #64748b;
}

.helper.error {
  color: #be123c;
}

@media (min-width: 900px) {
  .table-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
