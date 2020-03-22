import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

export interface DateSaveFilters {
  start: string;
  end: string;
}

export interface DateRangeSaveFilters {
  typeDateRange: number;
  date: DateSaveFilters;
}

export interface InsightSaveFiltersFormat {
  reportType: number;
  condition: number;
  resolvedReason: number;
  identifier: number;
  locations: number;
  dateRange: DateRangeSaveFilters;
}

@Injectable()
export class WidgetInsightService {

  constructor() {
  }

  saveInsightFilters(data: InsightSaveFiltersFormat, filterName: string) {
    const blob = new Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, `${filterName}-${new Date().toISOString()}.txt`);
  }
}
