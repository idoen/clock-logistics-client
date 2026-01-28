<template>
  <teleport to="body">
    <div v-if="open" class="config-overlay" @click.self="emit('close')">
      <div class="config-panel">
        <header class="config-header">
          <div>
            <h3>הגדרות נתונים טכניים</h3>
            <p>
              כאן מגדירים את הפרמטרים שמזינים את חישובי הדו״ח. ההסברים עוזרים להבין מה כל מספר משפיע כדי לשמור על החלטות עקביות.
            </p>
          </div>
          <button type="button" class="icon-button" @click="emit('close')">✕</button>
        </header>

        <AsyncState :loading="loading" :error="loadError">
          <form class="config-form" @submit.prevent="onSubmit">
            <section class="config-section">
              <div class="section-title">חלונות חיזוי ומשקל</div>
              <div class="section-description">
                כל נוסחה מורכבת מזוג ערכים: חלון זמן ומשקל. כך משווים בין מגמה קצרה למגמה ארוכה.
              </div>
              <div class="pair-grid">
                <div class="pair-card">
                  <div class="pair-title">חלון קצר</div>
                  <label class="field">
                    <span>חלון זמן (ימים)</span>
                    <input v-model.number="formState.windowDaysShort" type="number" min="1" step="1" class="input" required />
                    <small>ממוצע קצר שמתאים לשינויים מהירים.</small>
                  </label>
                  <label class="field">
                    <span>משקל חלון קצר</span>
                    <input v-model.number="formState.forecastWeightShort" type="number" min="0" max="1" step="0.01" class="input" required />
                    <small>גבוה יותר כשיש עונתיות חזקה.</small>
                  </label>
                </div>
                <div class="pair-card">
                  <div class="pair-title">חלון ארוך</div>
                  <label class="field">
                    <span>חלון זמן (ימים)</span>
                    <input v-model.number="formState.windowDaysLong" type="number" min="1" step="1" class="input" required />
                    <small>תמונה יציבה יותר לטווח בינוני.</small>
                  </label>
                  <label class="field">
                    <span>משקל חלון ארוך</span>
                    <input v-model.number="formState.forecastWeightLong" type="number" min="0" max="1" step="0.01" class="input" required />
                    <small>גבוה יותר כשצריך יציבות.</small>
                  </label>
                </div>
              </div>
            </section>

            <section class="config-section advanced-toggle">
              <button type="button" class="link-button" @click="showAdvanced = !showAdvanced">
                הגדרות מתקדמות
              </button>
            </section>

            <section v-if="showAdvanced" class="config-section advanced-section">
              <div class="section-title">רמות שירות וסיכון</div>
              <div class="section-description">פרמטרים מתקדמים לחישוב מלאי ביטחון והתראות סיכון.</div>
              <div class="field-grid">
                <label class="field">
                  <span class="label-with-info">
                    ימי סטטיסטיקה למלאי ביטחון
                    <span class="info-icon" title="כמה ימים אחורה משמשים לחישוב שונות בביקוש כדי לחשב מלאי ביטחון.">i</span>
                  </span>
                  <input v-model.number="formState.safetyStockStatsDays" type="number" min="1" step="1" class="input" required />
                </label>
                <label class="field">
                  <span class="label-with-info">
                    Z רמת שירות
                    <span class="info-icon" title="פקטור שמתרגם את רמת השירות הרצויה לסף ביטחון. ערך גבוה = זמינות גבוהה יותר.">i</span>
                  </span>
                  <input v-model.number="formState.serviceLevelZ" type="number" min="0.1" step="0.01" class="input" required />
                </label>
                <label class="field">
                  <span class="label-with-info">
                    כיסוי להזמנה מחדש (ימים)
                    <span class="info-icon" title="כמה ימים קדימה ההמלצה להזמנה צריכה לכסות כדי למנוע חוסרים.">i</span>
                  </span>
                  <input v-model.number="formState.reorderCoverageDays" type="number" min="1" step="1" class="input" required />
                </label>
                <label class="field">
                  <span class="label-with-info">
                    אופק סיכון (ימים)
                    <span class="info-icon" title="כמה ימים קדימה המערכת בודקת סיכון למחסור במלאי.">i</span>
                  </span>
                  <input v-model.number="formState.riskHorizonDays" type="number" min="1" step="1" class="input" required />
                </label>
              </div>
            </section>

            <section class="config-section">
              <div class="section-title">Dead Stock</div>
              <div class="section-description">שולט בזיהוי ירידות חדות ובסימון פריטים תקועים.</div>
              <div class="field-grid">
                <label class="field">
                  <span>חלון בדיקה (ימים)</span>
                  <input v-model.number="formState.deadStockWindowDays" type="number" min="1" step="1" class="input" required />
                  <small>טווח הזמן להשוואת ירידה במכירות.</small>
                </label>
                <label class="field">
                  <span>ירידה מינימלית</span>
                  <input v-model.number="formState.deadStockDropMin" type="number" min="0" max="1" step="0.01" class="input" required />
                  <small>אחוז ירידה שמפעיל בדיקה.</small>
                </label>
                <label class="field">
                  <span>ירידה מקסימלית</span>
                  <input v-model.number="formState.deadStockDropMax" type="number" min="0" max="1" step="0.01" class="input" required />
                  <small>הגבול העליון לירידה צפויה.</small>
                </label>
              </div>
            </section>

            <div class="form-actions">
              <div class="feedback">
                <span v-if="saveError" class="error-text">{{ saveError }}</span>
                <span v-else-if="successMessage" class="success-text">{{ successMessage }}</span>
              </div>
              <div class="buttons">
                <button type="button" class="btn ghost" @click="emit('close')">סגור</button>
                <button type="submit" class="btn primary" :disabled="saving">שמור הגדרות</button>
              </div>
            </div>
          </form>
        </AsyncState>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import AsyncState from '../../../shared/ui/AsyncState.vue';
import { useLogisticsConfig } from '../../queries/useLogisticsConfig';
import { useUpdateLogisticsConfig } from '../../mutations/useUpdateLogisticsConfig';
import type { LogisticsConfig } from '../../domain/types';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const configQuery = useLogisticsConfig();
const successMessage = ref('');
const showAdvanced = ref(false);

const formState = reactive<LogisticsConfig>({
  windowDaysShort: 7,
  windowDaysLong: 30,
  forecastWeightShort: 0.5,
  forecastWeightLong: 0.5,
  safetyStockStatsDays: 30,
  serviceLevelZ: 1.65,
  reorderCoverageDays: 30,
  riskHorizonDays: 60,
  deadStockWindowDays: 30,
  deadStockDropMin: 0.3,
  deadStockDropMax: 0.7,
});

watch(
  () => configQuery.data.value,
  (value) => {
    if (value) {
      Object.assign(formState, value);
    }
  },
  { immediate: true },
);

watch(
  () => props.open,
  (value) => {
    if (!value) {
      showAdvanced.value = false;
    }
  },
);

const mutation = useUpdateLogisticsConfig({
  onSuccess: () => {
    successMessage.value = 'עודכן בהצלחה.';
    window.setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  },
});

const loading = computed(() => configQuery.isLoading.value);
const loadError = computed(() => (configQuery.error.value ? configQuery.error.value.message : null));
const saveError = computed(() => (mutation.error.value ? mutation.error.value.message : ''));
const saving = computed(() => mutation.isPending.value);

function onSubmit() {
  mutation.mutate({ ...formState });
}
</script>

<style scoped>
.config-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  z-index: 40;
}

.config-panel {
  width: min(960px, 100%);
  max-height: 90vh;
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
  overflow-y: auto;
}

.config-header {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  text-align: right;
}

.config-header h3 {
  margin: 0 0 0.4rem 0;
  font-size: 1.6rem;
  color: #0f172a;
}

.config-header p {
  margin: 0;
  color: #475569;
  max-width: 60ch;
  line-height: 1.5;
}

.icon-button {
  border: none;
  background: #f1f5f9;
  color: #0f172a;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-section {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
  background: #f8fafc;
  text-align: right;
}

.section-title {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.section-description {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.pair-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.pair-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pair-title {
  font-weight: 700;
  color: #0f172a;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #1e293b;
}

.label-with-info {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #cbd5e1;
  color: #f1f5f9;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: help;
  line-height: 1;
}

.field small {
  color: #64748b;
  line-height: 1.4;
}

.input {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  background: #ffffff;
}

.advanced-toggle {
  padding: 0;
  border: none;
  background: transparent;
}

.link-button {
  border: none;
  background: none;
  color: #0284c7;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
}

.advanced-section {
  border-style: dashed;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn {
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #ffffff;
}

.btn.ghost {
  background: #f8fafc;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feedback {
  min-height: 1.2rem;
  text-align: right;
}

.error-text {
  color: #be123c;
  font-weight: 600;
}

.success-text {
  color: #16a34a;
  font-weight: 600;
}
</style>
