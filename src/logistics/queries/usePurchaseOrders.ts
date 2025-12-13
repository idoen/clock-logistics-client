import { useQuery } from '@tanstack/vue-query';
import { fetchPurchaseOrders } from '../api/logisticsApi';
import { qk } from './keys';

export function usePurchaseOrders() {
  return useQuery({
    queryKey: qk.purchaseOrders(),
    queryFn: fetchPurchaseOrders,
  });
}
