import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { disableOverride } from '../api/logisticsApi';
import { qk } from '../queries/keys';
import { pushToast } from '../../shared/ui/ToastBus';

export function useDisableOverride(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableOverride,
    onSuccess: (response) => {
      const existing = (queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) ?? {}) as Record<number, number>;
      const next = { ...existing };
      delete next[response.product_id];
      queryClient.setQueryData(qk.overridesLocal(), next);
      pushToast('Override disabled');
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
      options?.onSuccess?.();
    },
    onError: (err: Error) => pushToast(err.message),
  });
}
