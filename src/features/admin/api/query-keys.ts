export const adminKeys = {
  all: ['admin'] as const,
  auditLogs: () => [...adminKeys.all, 'audit-logs'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  systemSettings: () => [...adminKeys.all, 'settings'] as const,
};
