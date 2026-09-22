import { describe, it, expect } from 'vitest';
import { workCenterKeys } from '@/features/work-center/api/query-keys';
import { requestKeys } from '@/features/requests/api/query-keys';
import { financeKeys } from '@/features/finance/api/query-keys';
import { letterKeys } from '@/features/letters/api/query-keys';
import { operationsKeys } from '@/features/operations/api/query-keys';
import { partnerKeys } from '@/features/partners/api/query-keys';
import { collaborationKeys } from '@/features/collaboration/api/query-keys';
import { adminKeys } from '@/features/admin/api/query-keys';
import { inventoryKeys } from '@/features/inventory/api/query-keys';
import { meetingKeys } from '@/features/meetings/api/query-keys';
import { calendarKeys } from '@/features/calendar/api/query-keys';
import { teamKeys } from '@/features/team/api/query-keys';

describe('Feature Query Keys Scaffolds', () => {
  it('generates consistent query keys for work-center', () => {
    expect(workCenterKeys.all).toEqual(['work-center']);
    expect(workCenterKeys.lists()).toEqual(['work-center', 'list']);
    expect(workCenterKeys.list({ divisionCode: 'KST' })).toEqual([
      'work-center',
      'list',
      { divisionCode: 'KST' },
    ]);
    expect(workCenterKeys.detail('item-123')).toEqual([
      'work-center',
      'detail',
      'item-123',
    ]);
    expect(workCenterKeys.withoutPic()).toEqual(['work-center', 'without-pic']);
  });

  it('generates consistent query keys for requests', () => {
    expect(requestKeys.all).toEqual(['requests']);
    expect(requestKeys.lists()).toEqual(['requests', 'list']);
    expect(requestKeys.list({ type: 'budget_plan' })).toEqual([
      'requests',
      'list',
      { type: 'budget_plan' },
    ]);
    expect(requestKeys.detail('req-1')).toEqual(['requests', 'detail', 'req-1']);
  });

  it('generates consistent query keys for finance', () => {
    expect(financeKeys.all).toEqual(['finance']);
    expect(financeKeys.summary()).toEqual(['finance', 'summary']);
    expect(financeKeys.budgets()).toEqual(['finance', 'budgets']);
    expect(financeKeys.transactions()).toEqual(['finance', 'transactions']);
    expect(financeKeys.dues()).toEqual(['finance', 'dues']);
  });

  it('generates consistent query keys for letters', () => {
    expect(letterKeys.all).toEqual(['letters']);
    expect(letterKeys.lists()).toEqual(['letters', 'list']);
    expect(letterKeys.list({ direction: 'outbound' })).toEqual([
      'letters',
      'list',
      { direction: 'outbound' },
    ]);
    expect(letterKeys.detail('let-1')).toEqual(['letters', 'detail', 'let-1']);
  });

  it('generates consistent query keys for operations', () => {
    expect(operationsKeys.all).toEqual(['operations']);
    expect(operationsKeys.inventory()).toEqual(['operations', 'inventory']);
    expect(operationsKeys.inventoryItem('inv-1')).toEqual([
      'operations',
      'inventory',
      'inv-1',
    ]);
    expect(operationsKeys.logistics()).toEqual(['operations', 'logistics']);
  });

  it('generates consistent query keys for partners', () => {
    expect(partnerKeys.all).toEqual(['partners']);
    expect(partnerKeys.lists()).toEqual(['partners', 'list']);
    expect(partnerKeys.detail('part-1')).toEqual(['partners', 'detail', 'part-1']);
  });

  it('generates consistent query keys for collaboration', () => {
    expect(collaborationKeys.all).toEqual(['collaboration']);
    expect(collaborationKeys.meetings()).toEqual(['collaboration', 'meetings']);
    expect(collaborationKeys.meeting('meet-1')).toEqual([
      'collaboration',
      'meetings',
      'meet-1',
    ]);
    expect(collaborationKeys.calendar()).toEqual(['collaboration', 'calendar']);
  });

  it('generates consistent query keys for admin', () => {
    expect(adminKeys.all).toEqual(['admin']);
    expect(adminKeys.members()).toEqual(['admin', 'members']);
    expect(adminKeys.recycleBin()).toEqual(['admin', 'recycle-bin']);
    expect(adminKeys.recycleBin('work_items')).toEqual([
      'admin',
      'recycle-bin',
      'work_items',
    ]);
    expect(adminKeys.auditLogs()).toEqual(['admin', 'audit-logs']);
    expect(adminKeys.auditLogs({ action: 'create' })).toEqual([
      'admin',
      'audit-logs',
      { action: 'create' },
    ]);
    expect(adminKeys.users()).toEqual(['admin', 'users']);
    expect(adminKeys.systemSettings()).toEqual(['admin', 'settings']);
  });

  it('generates consistent query keys for inventory and logistics', () => {
    expect(inventoryKeys.all).toEqual(['inventory']);
    expect(inventoryKeys.items()).toEqual(['inventory', 'items']);
    expect(inventoryKeys.itemList({ category: 'medis' })).toEqual([
      'inventory',
      'items',
      { category: 'medis' },
    ]);
    expect(inventoryKeys.itemDetails()).toEqual(['inventory', 'item-detail']);
    expect(inventoryKeys.itemDetail('inv-1')).toEqual([
      'inventory',
      'item-detail',
      'inv-1',
    ]);
    expect(inventoryKeys.shipments()).toEqual(['logistics', 'shipments']);
    expect(inventoryKeys.shipmentList({ status: 'shipped' })).toEqual([
      'logistics',
      'shipments',
      { status: 'shipped' },
    ]);
    expect(inventoryKeys.shipmentDetail('ship-1')).toEqual([
      'logistics',
      'shipments',
      'ship-1',
    ]);
    expect(inventoryKeys.trips()).toEqual(['logistics', 'trips']);
    expect(inventoryKeys.tripList({ status: 'planned' })).toEqual([
      'logistics',
      'trips',
      { status: 'planned' },
    ]);
    expect(inventoryKeys.tripDetail('trip-1')).toEqual([
      'logistics',
      'trips',
      'trip-1',
    ]);
  });

  it('generates consistent query keys for meetings and decisions', () => {
    expect(meetingKeys.all).toEqual(['meetings']);
    expect(meetingKeys.lists()).toEqual(['meetings', 'list']);
    expect(meetingKeys.list('p-1')).toEqual(['meetings', 'list', { periodId: 'p-1' }]);
    expect(meetingKeys.details()).toEqual(['meetings', 'detail']);
    expect(meetingKeys.detail('meet-1')).toEqual(['meetings', 'detail', 'meet-1']);
    expect(meetingKeys.decisions('meet-1')).toEqual([
      'meetings',
      'detail',
      'meet-1',
      'decisions',
    ]);
  });

  it('generates consistent query keys for calendar', () => {
    expect(calendarKeys.all).toEqual(['calendar']);
    expect(calendarKeys.events()).toEqual(['calendar', 'events']);
    expect(calendarKeys.eventList('div-1')).toEqual([
      'calendar',
      'events',
      { divisionId: 'div-1' },
    ]);
    expect(calendarKeys.eventDetails()).toEqual(['calendar', 'event-detail']);
    expect(calendarKeys.eventDetail('evt-1')).toEqual([
      'calendar',
      'event-detail',
      'evt-1',
    ]);
  });

  it('generates consistent query keys for team announcements and feedback', () => {
    expect(teamKeys.all).toEqual(['team']);
    expect(teamKeys.announcements('div-1')).toEqual([
      'team',
      'announcements',
      { divisionId: 'div-1' },
    ]);
    expect(teamKeys.feedback('p-1')).toEqual([
      'team',
      'feedback',
      { periodId: 'p-1' },
    ]);
  });
});

