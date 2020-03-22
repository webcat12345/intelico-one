import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

// One - Services
import { DateRange } from '@one-common/filter/one-filter.model';
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { LocationFilterComponent } from '@one-common/filter/location-filter/location-filter.component';
import { InsightSaveFiltersFormat } from '../../../admin-management/widgets/widget-insight/widget-insight.service';

export interface IDateRange {
  start: string;
  end: string;
}

@Component({
  selector: 'one-admin-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent implements OnInit, OnChanges {

  @Input() defaultOption: DateRange = DateRange.Today;
  @Input() isDateRange: boolean;
  @Input() isZones: boolean;
  @Input() isSites: boolean;
  @Input() createdAtOrResolved = 'createdAt';
  @Input() isSingleDate: boolean;
  @Input() isAreas: boolean;
  @Input() isLocation = true;
  @Input() canBeDisabled = true;
  @Input() isDisabled: boolean;
  @Input() isSource: boolean;
  @Input() dataInsightSaveFilters: InsightSaveFiltersFormat;

  @Output() changeFilter: EventEmitter<{ data: string, index: number, typeDateRange?: number }> = new EventEmitter<{ data: string, index: number, typeDateRange?: number }>();
  @Output() changeFilterInJSON: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeCustomFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeSingleFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() customFilterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectForMapData: EventEmitter<AssetsData> = new EventEmitter<AssetsData>();
  @Output() dateRangeChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterSourceChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LocationFilterComponent, {static: false}) locationFilter: LocationFilterComponent;

  queries = ['', '', '', '', '', ''];
  minDate = new Date(1900, 1, 1);
  // fromDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  singleDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
  fromDate: Date = new Date();
  toDate: Date = new Date();

  DateRange = DateRange;
  dateRange: DateRange = DateRange.Today;
  fromHour: any = '00';
  fromMinute: any = '00';
  fromSecond: any = '00';
  toHour: any = '23';
  toMinute: any = '59';
  toSecond: any = '59';
  createdAtOrResolvedDRF: string;
  dateRangeOptions = [
    //  {value: DateRange.Any, name: 'Any'},
    {value: DateRange.Today, name: 'Today'},
    {value: DateRange.Yesterday, name: 'Yesterday'},
    {value: DateRange.Last7days, name: 'Last 7 days'},
    {value: DateRange.Last14days, name: 'Last 14 days'},
    {value: DateRange.ThisMonth, name: 'This month'},
    {value: DateRange.LastMonth, name: 'Last month'},
    {value: DateRange.Custom, name: 'Custom'},
  ];

  dateHours = [
    {id: 0, value: '00'}, {id: 1, value: '01'}, {id: 2, value: '02'}, {id: 3, value: '03'}, {id: 4, value: '04'},
    {id: 5, value: '05'}, {id: 6, value: '06'}, {id: 7, value: '07'}, {id: 8, value: '08'}, {id: 9, value: '09'},
    {id: 10, value: '10'}, {id: 11, value: '11'}, {id: 12, value: '12'}, {id: 13, value: '13'}, {id: 14, value: '14'},
    {id: 15, value: '15'}, {id: 16, value: '16'}, {id: 17, value: '17'}, {id: 18, value: '18'}, {id: 19, value: '19'},
    {id: 20, value: '20'}, {id: 21, value: '21'}, {id: 22, value: '22'}, {id: 23, value: '23'}
  ];

  dateMinutesOrSeconds = [
    {id: 0, value: '00'}, {id: 1, value: '01'}, {id: 2, value: '02'}, {id: 3, value: '03'}, {id: 4, value: '04'},
    {id: 5, value: '05'}, {id: 6, value: '06'}, {id: 7, value: '07'}, {id: 8, value: '08'}, {id: 9, value: '09'},
    {id: 10, value: '10'}, {id: 11, value: '11'}, {id: 12, value: '12'}, {id: 13, value: '13'}, {id: 14, value: '14'},
    {id: 15, value: '15'}, {id: 16, value: '16'}, {id: 17, value: '17'}, {id: 18, value: '18'}, {id: 19, value: '19'},
    {id: 20, value: '20'}, {id: 21, value: '21'}, {id: 22, value: '22'}, {id: 23, value: '23'}, {id: 24, value: '24'},
    {id: 25, value: '25'}, {id: 26, value: '26'}, {id: 27, value: '27'}, {id: 28, value: '28'}, {id: 29, value: '29'},
    {id: 30, value: '30'}, {id: 31, value: '31'}, {id: 32, value: '32'}, {id: 33, value: '33'}, {id: 34, value: '34'},
    {id: 35, value: '35'}, {id: 36, value: '36'}, {id: 37, value: '37'}, {id: 38, value: '38'}, {id: 39, value: '39'},
    {id: 40, value: '40'}, {id: 41, value: '41'}, {id: 42, value: '42'}, {id: 43, value: '43'}, {id: 44, value: '44'},
    {id: 45, value: '45'}, {id: 46, value: '46'}, {id: 47, value: '47'}, {id: 48, value: '48'}, {id: 49, value: '49'},
    {id: 50, value: '50'}, {id: 51, value: '51'}, {id: 52, value: '52'}, {id: 53, value: '53'}, {id: 54, value: '54'},
    {id: 55, value: '55'}, {id: 56, value: '56'}, {id: 57, value: '57'}, {id: 58, value: '58'}, {id: 59, value: '59'}, {id: 60, value: '60'}
  ];


  private static _setStartEndDate(date): Date {
    let newDate;
    newDate = new Date(date.substr(0, 4),
      date.substr(5, 2),
      date.substr(8, 2),
      date.substr(11, 2),
      date.substr(14, 2),
      date.substr(17, 2));
    return newDate;
  }

  ngOnInit(): void {
    if (this.isSingleDate) {
      setTimeout(() => {
        this.changeSingleFilter.emit(new Date(this.singleDate.setUTCHours(0, 0, 0)).toISOString());
      }, 200);
    }
    // this.fromDate.setHours(0, 0, 0);
    // this.toDate.setHours(23, 59, 59);
    this.createdAtOrResolvedDRF = this.createdAtOrResolved;
    this.dateRangeChange(this.defaultOption);
  }

  ngOnChanges(): void {
    if (this.defaultOption === 3) {
      this.dateRangeChange(this.defaultOption);
    }
    if (this.dataInsightSaveFilters) {
      this.dateRange = this.dataInsightSaveFilters.dateRange.typeDateRange;
      this.dateRangeChange(this.dataInsightSaveFilters.dateRange.typeDateRange);
      if (this.dataInsightSaveFilters.dateRange.typeDateRange === 7) {
        const startDate: any = DateRangeFilterComponent._setStartEndDate(this.dataInsightSaveFilters.dateRange.date.start);
        const endDate: any = DateRangeFilterComponent._setStartEndDate(this.dataInsightSaveFilters.dateRange.date.end);
        this.fromHour = startDate.getHours() < 10 ? '0' + startDate.getHours() : startDate.getHours();
        this.fromMinute = startDate.getMinutes() < 10 ? '0' + startDate.getMinutes() : startDate.getMinutes();
        this.fromSecond = startDate.getSeconds() < 10 ? '0' + startDate.getSeconds() : startDate.getSeconds();
        this.toHour = endDate.getHours() < 10 ? '0' + endDate.getHours() : endDate.getHours();
        this.toMinute = endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes();
        this.toSecond = endDate.getSeconds() < 10 ? '0' + endDate.getSeconds() : endDate.getSeconds();
        this.fromHour = this.fromHour.toString();
        this.fromMinute = this.fromMinute.toString();
        this.fromSecond = this.fromSecond.toString();
        this.toHour = this.toHour.toString();
        this.toMinute = this.toMinute.toString();
        this.toSecond = this.toSecond.toString();
        this.fromDate.setFullYear(startDate.getFullYear());
        this.fromDate.setMonth(startDate.getMonth() - 1);
        this.fromDate.setDate(startDate.getDate());
        this.fromDate.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
        this.toDate.setFullYear(endDate.getFullYear());
        this.toDate.setMonth(endDate.getMonth() - 1);
        this.toDate.setDate(endDate.getDate());
        this.toDate.setHours(endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
      }
    }
  }

  filterChanged(e, index): void {
    this.queries[index] = e;
    this.changeFilter.emit({data: this.queries[index], index: 4});
  }

  clear(): void {
    this.dateRange = DateRange.Today;
    this.dateRangeChange(DateRange.Today);
  }

  clearLocations(): void {
    this.locationFilter.clearLocations();
  }

  setToday(): void {
    // this.dateRange = DateRange.Today;
    // this.dateRangeChange(DateRange.Today);
  }

  dateRangeChange(e, force = false): void {
    this.dateRangeChangeEvent.emit(e);
    if (+e === DateRange.Today) {
      this.queries[5] = this._buildDateQuery(this.getDateRange(1));
      this.changeFilter.emit({data: this.queries[5], index: 5, typeDateRange: DateRange.Today});
      this.changeCustomFilter.emit({date: this.getDateRange(1), typeDateRange: +e});
    } else if (+e === DateRange.Last7daysForAlerts) {
      this.dateRange = parseInt(e, 10);
      this.queries[5] = this._buildDateQuery(this.getDateRange(this.dateRange));
      this.changeFilter.emit({data: this.queries[5], index: 5, typeDateRange: DateRange.Last7daysForAlerts});
    } else if (+e === DateRange.Custom && !force) {
      //  } else if (+e === DateRange.Custom) {
      this.dateRange = parseInt(e, 10);
      this.queries[5] = this._buildDateQuery(this.getDateRange(7));
      this.changeFilter.emit({data: this.queries[5], index: 5, typeDateRange: DateRange.Custom});
    } else {
      this.dateRange = parseInt(e, 10);
      this.queries[5] = this._buildDateQuery(this.getDateRange(this.dateRange));
      this.changeFilter.emit({data: this.queries[5], index: 5, typeDateRange: this.dateRange});
      this.changeCustomFilter.emit({date: this.getDateRange(this.dateRange), typeDateRange: +e});
    }
  }

  singleDateRangeChange() {
    this.changeSingleFilter.emit(new Date(this.singleDate.setUTCHours(0, 0, 0)).toISOString());
  }

  private getDateRange(option: DateRange): IDateRange {
    const now = new Date();
    let start: any = now.toISOString();
    let end: any = now.toISOString();
    if (+option === DateRange.Today) {
      start = new Date(new Date().setUTCHours(0, 0, 0)).toISOString();
      end = new Date(new Date().setUTCHours(23, 59, 59)).toISOString();
    } else if (+option === DateRange.Yesterday) {
      const yesterday = new Date(new Date().setUTCDate(now.getDate() - 1));
      start = new Date(yesterday.setUTCHours(0, 0, 0)).toISOString();
      end = new Date(yesterday.setUTCHours(23, 59, 59)).toISOString();
      //  end = new Date(new Date().setUTCHours(0, 0, 0)).toISOString();
    } else if (+option === DateRange.Last7days) {
      const dayStart = new Date(new Date().setUTCDate(now.getDate() - 6));
      start = new Date(dayStart.setUTCHours(0, 0, 0)).toISOString();
      end = new Date(new Date().setUTCHours(23, 59, 59)).toISOString();
    } else if (+option === DateRange.Last7daysForAlerts) {
      const dayStart = new Date(new Date().setUTCDate(now.getDate() - 6));
      const dayEnd = new Date(new Date().setUTCDate(now.getDate()));
      start = new Date(dayStart.setUTCHours(dayEnd.getHours(), dayEnd.getMinutes(), dayEnd.getSeconds())).toISOString();
      end = new Date(new Date().setUTCHours(23, 59, 59)).toISOString();
    } else if (+option === DateRange.Last14days) {
      const dayStart = new Date(new Date().setUTCDate(now.getDate() - 14));
      start = new Date(dayStart.setUTCHours(0, 0, 0)).toISOString();
      end = new Date(new Date().setUTCHours(23, 59, 59)).toISOString();
    } else if (+option === DateRange.ThisMonth) {
      const lastDay = new Date(now.getFullYear(), now.getMonth() - 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 1);
      start = this.getStartDate(firstDay);
      end = this.getEndDate(lastDayOfMonth);
      // start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      //  end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    } else if (+option === DateRange.LastMonth) {
      // end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
      // start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      const firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth(), 1);
      start = this.getStartDate(firstDay);
      end = this.getEndDate(lastDay);
    } else if (+option === DateRange.Custom) {
      start = new Date(this.getStartDate(this.fromDate)).toISOString();
      end = new Date(this.getEndDate(this.toDate)).toISOString();
      const startDate = this.getStartDate(this.fromDate);
      const endDate = this.getEndDate(this.toDate);
      this.customFilterSelected.emit({start: startDate, end: endDate});
    }
    return {start, end};
  }

  private getStartDate(date): string {
    // tslint:disable-next-line
    return `${date.getFullYear()}-${+date.getMonth() + 1 < 10 ? '0' + (+date.getMonth() + 1) : date.getMonth() + 1}-${+date.getDate() < 10 ? '0' + +date.getDate() : date.getDate()}T${this.fromHour}:${this.fromMinute}:${this.fromSecond}.000Z`;
  }

  private getEndDate(date): string {
    return `${date.getFullYear()}-${+date.getMonth() + 1 < 10 ? '0' + (+date.getMonth() + 1) : date.getMonth() + 1}-${+date.getDate() < 10 ? '0' + +date.getDate() : date.getDate()}T${this.toHour}:${this.toMinute}:${this.toSecond}.000Z`;
  }

  private _buildDateQuery(range): string {
    return `(${this.createdAtOrResolved} ge ${range.start} and ${this.createdAtOrResolved} lt ${range.end})`;
  }
}
