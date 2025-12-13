import { useQuery } from '@tanstack/vue-query';
import { fetchRisk60d } from '../api/logisticsApi';
import { qk } from './keys';

export function useRisk60d() {
  return useQuery({
    queryKey: qk.risk60d(),
    queryFn: fetchRisk60d,
    select: (rows) =>
      [...rows].sort((a, b) => {
        const aVal = a.days_until_rop ?? Number.POSITIVE_INFINITY;
        const bVal = b.days_until_rop ?? Number.POSITIVE_INFINITY;
        return aVal - bVal;
      }),
  });
}
