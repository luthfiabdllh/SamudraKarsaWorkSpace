import { z } from 'zod';

export const meetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  agenda: z.string().nullable().optional(),
  minutes: z.string().nullable().optional(),
  divisionCode: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});

export type Meeting = z.infer<typeof meetingSchema>;

export const calendarEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  date: z.string(),
  description: z.string().nullable().optional(),
  divisionCode: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
