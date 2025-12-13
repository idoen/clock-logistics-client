import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createOverride } from '../api/logisticsApi';
import { qk } from '../queries/keys';
import { pushToast } from '../../shared/ui/ToastBus';

export function useCreateOverride(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOverride,
    onSuccess: (response) => {
      const existing = (queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) ?? {}) as Record<number, number>;
      const next = { ...existing, [response.product_id]: response.id };
      queryClient.setQueryData(qk.overridesLocal(), next);
      pushToast('Override created');
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
      options?.onSuccess?.();
    },
    onError: (err: Error) => pushToast(err.message),
  });
}
