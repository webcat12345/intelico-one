/**
 * Front End need to send schema = dbo query parameter
 * when filter is indicating today, just for report APIs
 */
import { getNonTimezoneString } from './time.util';

export function isSchemaOn(start: string, end: string): boolean {
  const startOfToday = new Date(getNonTimezoneString(new Date(new Date().setUTCHours(0, 0, 0)).toISOString())).getTime();
  const endOfToday = new Date(getNonTimezoneString(new Date(new Date().setUTCHours(23, 59, 59)).toISOString())).getTime();
  const startTime = new Date(getNonTimezoneString(start)).getTime();
  const endTime = new Date(getNonTimezoneString(end)).getTime();
  return Boolean(startTime >= startOfToday && endTime <= endOfToday);
}
