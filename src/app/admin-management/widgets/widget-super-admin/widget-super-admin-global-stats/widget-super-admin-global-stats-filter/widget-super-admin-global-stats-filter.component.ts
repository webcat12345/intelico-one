import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';

@Component({
  selector: 'one-admin-widget-super-admin-global-stats-filter',
  templateUrl: './widget-super-admin-global-stats-filter.component.html',
  styleUrls: ['./widget-super-admin-global-stats-filter.component.scss']
})
export class WidgetSuperAdminGlobalStatsFilterComponent {
  @ViewChild(DateRangeFilterComponent, {static: false}) dateRangeFilter: DateRangeFilterComponent;

  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterBtn: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeCustomFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() customFilterSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  filterChangedDateOrLocations(e) {
    this.changeFilter.emit(e);
  }

  clearDateRange() {
    this.dateRangeFilter.clear();
  }

  clearSearch(dateRangeFilter) {
    dateRangeFilter.clear();
    this.changeFilterBtn.emit();
  }

  search() {
    this.changeFilterBtn.emit();
  }
}
