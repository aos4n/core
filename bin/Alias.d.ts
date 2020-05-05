import { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';
export declare type ScheduleRule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number;
