import { useQuery } from '@tanstack/vue-query';
import { fetchSalesReportFilters } from '../api/salesApi';
import { salesQueryKeys } from './keys';

export function useSalesReportFilters() {
  return useQuery({
    queryKey: salesQueryKeys.filters(),
    queryFn: fetchSalesReportFilters,
  });
}
