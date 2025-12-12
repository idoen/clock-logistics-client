import { useQuery } from "@tanstack/vue-query";
import { fetchReorder } from "../api/logisticsApi";
import { qk } from "./keys";

export function useReorder() {
  return useQuery({
    queryKey: qk.reorder(),
    queryFn: fetchReorder,
  });
}
