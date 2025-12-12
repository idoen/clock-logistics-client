import { useQuery } from "@tanstack/vue-query";
import { fetchDaily } from "../api/logisticsApi";
import { qk } from "./keys";

export function useDailyReport(status?: string) {
  return useQuery({
    queryKey: qk.daily(status),
    queryFn: () => fetchDaily(status),
  });
}
