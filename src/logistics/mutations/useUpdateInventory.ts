import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateInventory } from '../api/logisticsApi';
import { qk } from '../queries/keys';
import { pushToast } from '../../shared/ui/ToastBus';

export function useUpdateInventory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: { onHand: number; reserved: number; inTransit: number } }) =>
      updateInventory(productId, payload),
    onSuccess: () => {
      pushToast('Inventory updated');
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.risk60d() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
      options?.onSuccess?.();
    },
    onError: (err: Error) => pushToast(err.message),
  });
}
