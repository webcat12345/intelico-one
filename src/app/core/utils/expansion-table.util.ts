export interface ExpansionTableItem<T> {
  data: T;
  expanded?: boolean;
  showDetail?: boolean;
}

export function parseExpansionTableItem<T>(item: T): ExpansionTableItem<T> {
  return {data: item};
}
