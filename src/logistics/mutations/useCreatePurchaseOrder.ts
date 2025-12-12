import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createPurchaseOrder } from '../api/logisticsApi'
import { qk } from '../queries/keys'

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.purchaseOrders() })
      queryClient.invalidateQueries({ queryKey: qk.reorder() })
      queryClient.invalidateQueries({ queryKey: qk.daily() })
      queryClient.invalidateQueries({ queryKey: qk.risk60d() })
    },
  })
}
