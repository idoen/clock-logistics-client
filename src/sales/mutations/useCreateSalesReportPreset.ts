import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createSalesReportPreset } from '../api/salesApi';
import { salesQueryKeys } from '../queries/keys';

export function useCreateSalesReportPreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesReportPreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.presets() });
    },
  });
}
