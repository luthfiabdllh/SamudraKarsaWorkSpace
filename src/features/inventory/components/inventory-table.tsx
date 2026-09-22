'use client';

import React from 'react';
import { Package, MapPin, User, ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { id as dictionary } from '@/lib/dictionaries/id';
import type { InventoryItem } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  onSelectItem: (item: InventoryItem) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export function InventoryTable({
  items,
  isLoading,
  onSelectItem,
  search,
  onSearchChange,
}: InventoryTableProps) {
  const dict = dictionary.inventory;

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.itemCode && item.itemCode.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.storageLocation && item.storageLocation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dict.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-border/70 rounded-xl overflow-hidden bg-card/60 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold border-b border-border/70">
              <tr>
                <th className="py-3 px-4">{dict.table.itemCode}</th>
                <th className="py-3 px-4">{dict.table.name}</th>
                <th className="py-3 px-4">{dict.table.category}</th>
                <th className="py-3 px-4">{dict.table.stock}</th>
                <th className="py-3 px-4">{dict.table.storageLocation}</th>
                <th className="py-3 px-4">{dict.table.pic}</th>
                <th className="py-3 px-4 text-right">{dict.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <p className="text-xs">Memuat katalog perlengkapan posko...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="h-9 w-9 text-muted-foreground/40" />
                      <p className="font-medium text-foreground">{dict.emptyTitle}</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        {dict.emptyDescription}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLowStock = item.currentStock <= 2;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="hover:bg-accent/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                        {item.itemCode || 'INV-POSKO'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </div>
                        {item.note && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                            {item.note}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.category ? (
                          <Badge variant="outline" className="text-xs font-normal">
                            {item.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              isLowStock
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-foreground'
                            }`}
                          >
                            {item.currentStock}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.unit || 'unit'}
                          </span>
                          {isLowStock && (
                            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 border-none px-1.5 py-0 h-4">
                              Menipis
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {item.storageLocation ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="shrink-0 text-muted-foreground/70" />
                            <span className="truncate max-w-35">{item.storageLocation}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {item.pic ? (
                          <div className="flex items-center gap-1.5">
                            <User size={13} className="shrink-0 text-muted-foreground/70" />
                            <span className="truncate max-w-30">{item.pic.fullName || item.pic.email}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground group-hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
