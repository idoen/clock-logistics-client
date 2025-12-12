import { QueryClient } from "@tanstack/vue-query";
import { toastBus } from "../shared/ui/ToastBus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message || "Request failed")
            : "Request failed";
        toastBus.push({ id: Date.now(), message });
      },
    },
  },
});

export default queryClient;
