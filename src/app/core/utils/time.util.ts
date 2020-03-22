export function getDiffDays(start: string, end: string) {
  // return Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
}

export function getNonTimezoneString(date: string): string {
  return date.substr(0, 19) + '.000Z';
}
