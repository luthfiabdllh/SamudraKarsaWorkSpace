export const adminKeys = {
  all: ['admin'] as const,
  members: () => [...adminKeys.all, 'members'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  recycleBin: (table?: string) =>
    table ? ([...adminKeys.all, 'recycle-bin', table] as const) : ([...adminKeys.all, 'recycle-bin'] as const),
  auditLogs: (filters?: Record<string, unknown>) =>
    filters ? ([...adminKeys.all, 'audit-logs', filters] as const) : ([...adminKeys.all, 'audit-logs'] as const),
  systemSettings: () => [...adminKeys.all, 'settings'] as const,
};
