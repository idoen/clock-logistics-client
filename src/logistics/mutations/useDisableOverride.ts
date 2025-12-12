import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { disableOverride } from '../api/logisticsApi'
import { qk } from '../queries/keys'

export function useDisableOverride() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disableOverride,
    onSuccess: (result) => {
      const map = (queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) ?? {}) as Record<number, number>
      const updated = { ...map }
      delete updated[result.productId]
      queryClient.setQueryData(qk.overridesLocal(), updated)
      queryClient.invalidateQueries({ queryKey: qk.daily() })
      queryClient.invalidateQueries({ queryKey: qk.reorder() })
    },
  })
}
