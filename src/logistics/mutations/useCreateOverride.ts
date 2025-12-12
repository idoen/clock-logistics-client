import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { createOverride } from "../api/logisticsApi";
import { qk } from "../queries/keys";
import { toastBus } from "../../shared/ui/ToastBus";

function getOverrideCache(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) || {};
}

export function useCreateOverride() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOverride,
    onSuccess: (result) => {
      const cache = getOverrideCache(queryClient);
      queryClient.setQueryData(qk.overridesLocal(), {
        ...cache,
        [result.productId]: result.id,
      });
      toastBus.push({ id: Date.now(), message: "Override saved" });
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
    },
  });
}
