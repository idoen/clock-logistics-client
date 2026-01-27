import { useQuery } from '@tanstack/vue-query';
import { fetchSalesReportPresets } from '../api/salesApi';
import { salesQueryKeys } from './keys';

export function useSalesReportPresets() {
  return useQuery({
    queryKey: salesQueryKeys.presets(),
    queryFn: fetchSalesReportPresets,
  });
}
