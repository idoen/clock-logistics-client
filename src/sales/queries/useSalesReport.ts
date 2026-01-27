import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchSalesReport, type SalesReportParams } from '../api/salesApi';
import { salesQueryKeys } from './keys';

export function useSalesReport(paramsRef: Ref<SalesReportParams | null>) {
  return useQuery({
    queryKey: computed(() => salesQueryKeys.report(paramsRef.value ?? undefined)),
    queryFn: () => fetchSalesReport(paramsRef.value ?? undefined),
    enabled: computed(() => paramsRef.value !== null),
    keepPreviousData: true,
  });
}
