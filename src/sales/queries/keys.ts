import type { SalesReportParams } from '../api/salesApi';

export const salesQueryKeys = {
  report: (params?: SalesReportParams | null) => ['sales-report', params] as const,
  filters: () => ['sales-report-filters'] as const,
  presets: () => ['sales-report-presets'] as const,
};
