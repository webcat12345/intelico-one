export enum DateRange {
  Any = 0,
  Today = 1,
  Yesterday,
  Last7days,
  Last14days,
  ThisMonth,
  LastMonth,
  Custom,
  Last7daysForAlerts
}

export interface TypeOption {
  value: any;
  name: string;
  label: string;
  additionalClass?: string;
}
