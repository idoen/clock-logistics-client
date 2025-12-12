import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { disableOverride } from "../api/logisticsApi";
import { qk } from "../queries/keys";
import { toastBus } from "../../shared/ui/ToastBus";

function getOverrideCache(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.getQueryData<Record<number, number>>(qk.overridesLocal()) || {};
}

export function useDisableOverride() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disableOverride,
    onSuccess: (result) => {
      const cache = getOverrideCache(queryClient);
      const { [result.productId]: _, ...rest } = cache;
      queryClient.setQueryData(qk.overridesLocal(), rest);
      toastBus.push({ id: Date.now(), message: "Override disabled" });
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
    },
  });
}
