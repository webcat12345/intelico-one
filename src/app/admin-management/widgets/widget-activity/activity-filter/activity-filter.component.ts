import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// One - Services
import { Subscription } from 'rxjs';
import { removeDuplicates } from '../../../../core/utils/common.util';

import { SourceService } from '@one-core/service/source.service';
import { TypeCategory, TypeList, TypesService } from '@one-core/service/types.service';

import { ITypesReport } from '../../widget-alerts/alerts-reports/alerts-reports.component';
import { ValueFilterComponent } from '@one-common/filter/value-filter/value-filter.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';
import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';
import { IdentifierTypeFilterComponent } from '@one-common/filter/identifier-type-filter/identifier-type-filter.component';

@Component({
  selector: 'one-admin-activity-filter',
  templateUrl: './activity-filter.component.html',
  styleUrls: ['./activity-filter.component.scss']
})
export class ActivityFilterComponent implements AfterViewInit, OnDestroy {
  @Input() currentView: string;
  @Input() currentViewReports: number;

  @ViewChild(SearchKeyFilterComponent, {static: false}) searchKeyFilter: SearchKeyFilterComponent;
  @ViewChild(DateRangeFilterComponent, {static: false}) dateRangeFilter: DateRangeFilterComponent;
  @ViewChild(IdentifierTypeFilterComponent, {static: false}) identifierTypeFilter: IdentifierTypeFilterComponent;
  @ViewChild(ValueFilterComponent, {static: true}) valueFilter: ValueFilterComponent;
  @ViewChild('clearBtn', {static: false}) clearBtn: ElementRef;
  @ViewChild('searchBtn', {static: false}) searchBtn: ElementRef;

  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterBtn: EventEmitter<string> = new EventEmitter<string>();
  @Output() scrollToBottom: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeCustomFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() customFilterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeFilterPeopleId: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterGraph: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetGraph: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchGraph: EventEmitter<ITypesReport> = new EventEmitter<ITypesReport>();
  @Output() changeLocationFilter: EventEmitter<string> = new EventEmitter<string>();
  filteredIdentifiers: Array<{ id: number, value: string }> = [{id: null, value: null}];
  selectMetaData: boolean;
  metadata: string;
  queries = ['', '', '', '', '', '', '', ''];
  selectTypeReason: FormGroup = this.fb.group({
    type_reason: ['Activity Total']
  });

  selectCondition: FormGroup = this.fb.group({
    type_condition: ['Any']
  });

  formGroupMetaData: FormGroup = this.fb.group({
    meta_data: ['default']
  });
  typesReasons: Array<ITypesReport> = [
    // {id: 0, value: 'Activity'},
    {id: 111, value: 'Activity Total'},
    {id: 110, value: 'Activity Total By Metadata'},
    {id: 112, value: 'Activity By Identifier', type: 'identifier'},
    {id: 112, value: 'Activity By Identifier Type', type: 'identifierType'},
    {id: 112, value: 'Activity By Source', type: 'source'},
  ];

  typesCondition: TypeList;

  typesMetaData: Array<ITypesReport> = [
    {id: 1, value: 'Color'},
    {id: 2, value: 'Make'},
    {id: 3, value: 'Model'},
    {id: 4, value: 'C02'},
  ];
  typesReasonsDefault: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private sourceService: SourceService,
    private typesService: TypesService
  ) {
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

  private static _buildDateQuery(range): string {
    return `(createdAt ge ${range.start} and createdAt lt ${range.end})`;
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.selectTypeReason.get('type_reason').valueChanges.subscribe(value => {
        if (value !== 'default') {
          if (value === 'Activity Total By Metadata') {
            this.selectMetaData = true;
          } else {
            this.selectMetaData = false;
          }
          //  this.selectCondition.controls['type_condition'].setValue('Any');
          const typeReason = this.typesReasons.find(item => item.value === value);
          this.searchGraph.emit(typeReason);
        } else {
          this.typesReasonsDefault = true;
        }
      }));
    this.subscriptions.push(
      this.selectCondition.get('type_condition').valueChanges.subscribe(value => {
        if (value !== 'Any') {
          this.queries[7] = `name eq '${value}'`;
        } else if (value === 'Any') {
          this.queries[7] = ``;
        }
      }));
    this.subscriptions.push(
      this.formGroupMetaData.get('meta_data').valueChanges.subscribe(value => {
        if (value !== 'default') {
          this.metadata = value.toString().toLocaleLowerCase();
        } else {
          this.metadata = ``;
        }
      }));
    this.sourceService.getSources().subscribe((resp) => {
      if (resp.data.length) {
        resp.data.map((item, index) => {
          this.filteredIdentifiers[index] = {id: item.identifierType.id, value: item.identifierType.value};
        });
      }
      this.filteredIdentifiers = removeDuplicates(this.filteredIdentifiers, 'id');
      this.filteredIdentifiers.unshift({id: -1, value: 'Any'});
    });
    this.typesService.getTypes(TypeCategory.Condition).subscribe(
      res => {
        if (res.data.length) {
          this.typesCondition = res;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  filterChanged(e, index?): void {
    this.queries[index] = e;
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  filterChangedDateOrLocations(e): void {
    if (e.index === 4) {
      this.queries[6] = e.data;
      this.changeLocationFilter.emit(e.data);
    }
    if (e.index === 5) {
      this.queries[5] = e.data;
    }
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  searchByIdentifier(identifier): void {
    this.searchKeyFilter.search(identifier);
  }

  clearDateRange(): void {
    this.dateRangeFilter.clear();
  }

  setTodayDateRange(): void {
    this.dateRangeFilter.setToday();
  }

  clearSearch(locationFilters, dateRangeFilter): void {
    this.identifierTypeFilter.setAnyIdentifierType();
    dateRangeFilter.clear();
    locationFilters.clearLocations();
    this.valueFilter.setDefaultValue();
    this.selectTypeReason.controls.type_reason.setValue('Activity Total');
    this.selectCondition.controls.type_condition.setValue('Any');
    this.formGroupMetaData.controls.meta_data.setValue('default');
    this.queries = ['', '', '', '', '', ActivityFilterComponent._buildDateQuery(ActivityFilterComponent._getDateRange(1)), ''];
    this.resetGraph.emit(true);
    this.changeFilterBtn.emit(this.queries.filter(x => x).join(' and '));
    this.changeFilterGraph.emit({filter: this.queries.filter(x => x).join(' and '), metadata: this.metadata});
  }

  searchActivity(): void {
    if (this.currentView === 'list-view') {
      if (this.dateRangeFilter.dateRange === 7) {
        this.dateRangeFilter.dateRangeChange(7, true);
      }
      this.changeFilterBtn.emit(this.queries.filter(x => x).join(' and '));
    } else if (this.currentView === 'reports-view') {
      this.changeFilterGraph.emit({filter: this.queries.filter(x => x).join(' and '), metadata: this.metadata});
    }
  }

  clickResetBtn(): void {
    this.clearBtn.nativeElement.click();
  }

  clickSearchBtn(): void {
    this.searchBtn.nativeElement.click();
  }
}
