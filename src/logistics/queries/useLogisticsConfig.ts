import { useQuery } from '@tanstack/vue-query';
import { fetchLogisticsConfig } from '../api/logisticsApi';
import { qk } from './keys';

export function useLogisticsConfig() {
  return useQuery({
    queryKey: qk.logisticsConfig(),
    queryFn: fetchLogisticsConfig,
  });
}
