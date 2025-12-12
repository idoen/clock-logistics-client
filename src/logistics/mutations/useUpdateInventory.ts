import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { updateInventory } from "../api/logisticsApi";
import { qk } from "../queries/keys";
import { toastBus } from "../../shared/ui/ToastBus";

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInventory,
    onSuccess: () => {
      toastBus.push({ id: Date.now(), message: "Inventory updated" });
      queryClient.invalidateQueries({ queryKey: qk.daily() });
      queryClient.invalidateQueries({ queryKey: qk.risk60d() });
      queryClient.invalidateQueries({ queryKey: qk.reorder() });
    },
  });
}
