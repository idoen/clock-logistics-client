import { useQuery } from '@tanstack/vue-query';
import { fetchSalesReport, type SalesReportParams } from '../api/salesApi';
import { salesQueryKeys } from './keys';

export function useSalesReport(params: SalesReportParams | null) {
  return useQuery({
    queryKey: salesQueryKeys.report(params ?? undefined),
    queryFn: () => fetchSalesReport(params ?? undefined),
    enabled: params !== null,
    keepPreviousData: true,
  });
}
