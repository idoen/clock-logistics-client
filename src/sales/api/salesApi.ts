import httpClient from '../../shared/http/httpClient';
import {
  salesReportFiltersSchema,
  salesReportPresetsSchema,
  salesReportResponseSchema,
  salesReportPresetSchema,
} from '../domain/schemas';
import type { SalesReportFilters, SalesReportSort } from '../domain/types';

export type SalesReportParams = {
  budget?: number | null;
  filters?: SalesReportFilters | null;
  inStockOnly?: boolean;
  sort?: SalesReportSort | null;
  page?: number;
  pageSize?: number;
};

const buildParams = (params?: SalesReportParams) => {
  if (!params) return undefined;
  const queryParams: Record<string, unknown> = {};

  if (params.budget !== null && params.budget !== undefined && !Number.isNaN(params.budget)) {
    queryParams.budget = params.budget;
  }

  if (params.filters && Object.keys(params.filters).length > 0) {
    queryParams.filters = JSON.stringify(params.filters);
  }

  if (typeof params.inStockOnly === 'boolean') {
    queryParams.inStockOnly = params.inStockOnly;
  }

  if (params.sort?.field && params.sort.direction) {
    queryParams.sort = `${params.sort.field}:${params.sort.direction}`;
  }

  if (params.page) {
    queryParams.page = params.page;
  }

  if (params.pageSize) {
    queryParams.pageSize = params.pageSize;
  }

  return queryParams;
};

export async function fetchSalesReport(params?: SalesReportParams) {
  const { data } = await httpClient.get('/api/sales/report', {
    params: buildParams(params),
  });
  return salesReportResponseSchema.parse(data);
}

export async function fetchSalesReportFilters() {
  const { data } = await httpClient.get('/api/sales/report/filters');
  return salesReportFiltersSchema.parse(data);
}

export async function fetchSalesReportPresets() {
  const { data } = await httpClient.get('/api/sales/report-presets');
  return salesReportPresetsSchema.parse(data);
}

export async function createSalesReportPreset(payload: {
  name: string;
  budget?: number | null;
  filters?: SalesReportFilters | null;
  inStockOnly?: boolean;
  sort?: SalesReportSort | null;
}) {
  const { data } = await httpClient.post('/api/sales/report-presets', payload);
  return salesReportPresetSchema.parse(data);
}

export async function deleteSalesReportPreset(id: number) {
  const { data } = await httpClient.delete(`/api/sales/report-presets/${id}`);
  return salesReportPresetSchema.parse(data);
}

export async function exportSalesReportCsv(params?: SalesReportParams) {
  const { data } = await httpClient.get('/api/sales/report/export', {
    params: {
      format: 'csv',
      ...buildParams(params),
    },
    responseType: 'blob',
  });

  return data as Blob;
}
