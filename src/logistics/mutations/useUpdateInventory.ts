import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateInventory } from '../api/logisticsApi'
import { qk } from '../queries/keys'

export function useUpdateInventory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, onHand, reserved, inTransit }: { productId: number; onHand: number; reserved: number; inTransit: number }) =>
      updateInventory(productId, { onHand, reserved, inTransit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.daily() })
      queryClient.invalidateQueries({ queryKey: qk.risk60d() })
      queryClient.invalidateQueries({ queryKey: qk.reorder() })
    },
  })
}
