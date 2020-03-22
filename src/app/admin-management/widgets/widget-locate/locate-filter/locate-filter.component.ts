import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { DateRange } from '@one-common/filter/one-filter.model';
import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';

@Component({
  selector: 'one-admin-locate-filter',
  templateUrl: './locate-filter.component.html',
  styleUrls: ['./locate-filter.component.scss']
})
export class LocateFilterComponent implements OnInit {
  @ViewChild(DateRangeFilterComponent, {static: true}) dateFilter: DateRangeFilterComponent;
  @Input() defaultOptionDate: number;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterBtn: EventEmitter<string> = new EventEmitter<string>();
  queries = ['', '', '', ''];
  DateRange = DateRange;

  constructor() {
  }

  private static _buildDateQuery(range): string {
    return `(createdAt ge ${range.start} and createdAt lt ${range.end})`;
  }

  private static _getDateRange(option: number) {
    const now = new Date();
    let start = now.toISOString();
    let end = now.toISOString();
    if (option === 1) {
      start = new Date(new Date().setUTCHours(0, 0, 0)).toISOString();
      end = new Date(new Date().setUTCHours(23, 59, 59)).toISOString();
    }
    return {start, end};
  }

  ngOnInit(): void {
  }

  filterChanged(e, index): void {
    this.queries[e.index] = e.data;
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  clearSearch(): void {
    this.dateFilter.clear();
    this.dateFilter.clearLocations();
    this.queries = ['', '', '', '', '', LocateFilterComponent._buildDateQuery(LocateFilterComponent._getDateRange(1))];
    // this.queries = ['', '', '', '', '', this.buildDateQuery(this.getDateRange(1))];
  }

  searchLocate(): void {
    this.changeFilterBtn.emit(this.queries.filter(x => x).join(' and '));
  }

}
