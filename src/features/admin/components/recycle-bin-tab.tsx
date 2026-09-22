'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  Trash2,
  AlertTriangle,
  FolderArchive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { id as dictionary } from '@/lib/dictionaries/id';
import {
  useRecycleBinItems,
  useRestoreRecycleBinItem,
} from '../api/use-admin';
import { HardDeleteDialog } from './hard-delete-dialog';
import {
  RECYCLE_BIN_TABLES,
  type RecycleBinItem,
  type RecycleBinTable,
} from '../types';

export function RecycleBinTab() {
  const dict = dictionary.admin.recycleBin;
  const tableLabels = dictionary.statuses.recycleBin;

  const [selectedTable, setSelectedTable] = useState<RecycleBinTable>('work_items');
  const [selectedItemForHardDelete, setSelectedItemForHardDelete] = useState<RecycleBinItem | null>(null);

  const { data: items = [], isLoading } = useRecycleBinItems(selectedTable);
  const restoreMutation = useRestoreRecycleBinItem(selectedTable);

  const handleRestore = async (id: string, title: string) => {
    if (!window.confirm(`Pulihkan "${title}" kembali ke sistem aktif?`)) return;

    try {
      await restoreMutation.mutateAsync(id);
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <div className="space-y-4">
      {/* Module / Entity Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-2">
          <FolderArchive className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            {dict.selectTable}:
          </span>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value as RecycleBinTable)}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {RECYCLE_BIN_TABLES.map((t) => (
              <option key={t} value={t}>
                {tableLabels[t] || t}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <Badge variant="outline" className="text-[11px] font-mono">
            {dict.itemCount.replace('{count}', String(items.length))}
          </Badge>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
            Penghapusan Lunak (Soft Delete)
          </p>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
            Data pada tempat sampah dapat dipulihkan kembali sewaktu-waktu. Penghapusan permanen akan meminta verifikasi kata sandi akun administrator.
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/70 text-[11px]">
              <tr>
                <th className="px-4 py-3">{dict.table.item}</th>
                <th className="px-4 py-3">{dict.table.entity}</th>
                <th className="px-4 py-3">{dict.table.deletedAt}</th>
                <th className="px-4 py-3 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Memuat data tempat sampah...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {dict.emptyTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dict.emptyDescription}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">
                        {item.title}
                      </div>
                      {item.summary && (
                        <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {item.summary}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {tableLabels[item.tableName] || item.tableName}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground text-[11px]">
                      <div>{new Date(item.deletedAt).toLocaleString('id-ID')}</div>
                      {item.deletedByName && (
                        <div className="text-[10px] text-muted-foreground/75">
                          Oleh: {item.deletedByName}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 gap-1"
                          onClick={() => handleRestore(item.id, item.title)}
                          disabled={restoreMutation.isPending}
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>{dict.actions.restore}</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                          onClick={() => setSelectedItemForHardDelete(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{dict.actions.hardDelete}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hard Delete Re-Authentication Dialog */}
      <HardDeleteDialog
        item={selectedItemForHardDelete}
        table={selectedTable}
        isOpen={Boolean(selectedItemForHardDelete)}
        onClose={() => setSelectedItemForHardDelete(null)}
      />
    </div>
  );
}
