import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteSalesReportPreset } from '../api/salesApi';
import { salesQueryKeys } from '../queries/keys';

export function useDeleteSalesReportPreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSalesReportPreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.presets() });
    },
  });
}
