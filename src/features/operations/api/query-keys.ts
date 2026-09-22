export const operationsKeys = {
  all: ['operations'] as const,
  inventory: () => [...operationsKeys.all, 'inventory'] as const,
  inventoryItem: (id: string) => [...operationsKeys.inventory(), id] as const,
  logistics: () => [...operationsKeys.all, 'logistics'] as const,
};
