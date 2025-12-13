import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createPurchaseOrder } from '../api/logisticsApi';
import { qk } from '../queries/keys';
import { pushToast } from '../../shared/ui/ToastBus';

export function useCreatePurchaseOrder(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      pushToast('PO created');
      queryClient.invalidateQueries({ queryKey: qk.purchaseOrders() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.risk60d() });
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      pushToast(err.message);
    },
  });
}
