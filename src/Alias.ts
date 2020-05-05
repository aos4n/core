import { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';

export type ScheduleRule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number