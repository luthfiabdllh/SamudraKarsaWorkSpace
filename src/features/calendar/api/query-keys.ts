export const calendarKeys = {
  all: ['calendar'] as const,
  events: () => [...calendarKeys.all, 'events'] as const,
  eventList: (divisionId?: string) => [...calendarKeys.events(), { divisionId }] as const,
  eventDetails: () => [...calendarKeys.all, 'event-detail'] as const,
  eventDetail: (id: string) => [...calendarKeys.eventDetails(), id] as const,
};
