export const qk = {
  daily: (status?: string) => ['logistics', 'daily', status ?? 'ALL'] as const,
  risk60d: () => ['logistics', 'risk60d'] as const,
  reorder: () => ['logistics', 'reorder'] as const,
  purchaseOrders: () => ['logistics', 'purchaseOrders'] as const,
  overridesLocal: () => ['logistics', 'overridesLocal'] as const,
};
