import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createOverride } from '../api/logisticsApi'
import { qk } from '../queries/keys'

export function useCreateOverride() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOverride,
    onSuccess: (result) => {
      const map = (queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) ?? {}) as Record<number, number>
      queryClient.setQueryData(qk.overridesLocal(), { ...map, [result.productId]: result.id })
      queryClient.invalidateQueries({ queryKey: qk.daily() })
      queryClient.invalidateQueries({ queryKey: qk.reorder() })
    },
  })
}
