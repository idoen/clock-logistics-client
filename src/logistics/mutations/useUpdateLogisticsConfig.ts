import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateLogisticsConfig } from '../api/logisticsApi';
import type { LogisticsConfig } from '../domain/types';
import { qk } from '../queries/keys';

type Options = {
  onSuccess?: () => void;
};

export function useUpdateLogisticsConfig(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<LogisticsConfig>) => updateLogisticsConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.logisticsConfig() });
      options?.onSuccess?.();
    },
  });
}
