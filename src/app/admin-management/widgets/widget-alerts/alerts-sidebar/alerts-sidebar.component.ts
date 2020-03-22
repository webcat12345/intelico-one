import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// One - Services
import { NotificationStatus } from '@one-core/model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionService } from '@one-core/service/action.service';
import { SourceService } from '@one-core/service/source.service';
import { ITypesReport } from '../alerts-reports/alerts-reports.component';
import { orderBy, removeDuplicates } from '../../../../core/utils/common.util';
import { TypeFilterComponent } from '@one-common/filter/type-filter/type-filter.component';
import { ReasonFilterComponent } from '@one-common/filter/reason-filter/reason-filter.component';
import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';
import { IdentifierTypeFilterComponent } from '@one-common/filter/identifier-type-filter/identifier-type-filter.component';

@Component({
  selector: 'one-admin-alerts-sidebar',
  templateUrl: './alerts-sidebar.component.html',
  styleUrls: ['./alerts-sidebar.component.scss']
})
export class AlertsSidebarComponent implements OnInit, OnDestroy {

  @ViewChild(DateRangeFilterComponent, {static: true}) dateRangeFilter: DateRangeFilterComponent;
  @ViewChild(IdentifierTypeFilterComponent, {static: true}) identifierTypeFilter: IdentifierTypeFilterComponent;
  @ViewChild(ReasonFilterComponent, {static: true}) reasonFilter: ReasonFilterComponent;
  @ViewChildren(TypeFilterComponent) typeFilterRef: QueryList<TypeFilterComponent>;
  @ViewChild('clearBtn', {static: true}) clearBtn: ElementRef;

  @Input() defaultOptionDate: number;
  @Input() currentViewReports: number;
  @Input() currentView: string;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterBtn: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterGraph: EventEmitter<string> = new EventEmitter<string>();
  @Output() scrollToBottom: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeCustomFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() customFilterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetGraph: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchGraph: EventEmitter<ITypesReport> = new EventEmitter<ITypesReport>();
  @Output() selectedStatusOut: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateAlertsReports: EventEmitter<boolean> = new EventEmitter<boolean>();

  NotificationStatus = NotificationStatus;

  typeOptions = [
    {value: 400, name: 'critical', label: 'Critical', additionalClass: 'critical'},
    {value: 300, name: 'high', label: 'High', additionalClass: 'high'},
    {value: 200, name: 'normal', label: 'Normal', additionalClass: 'normal'},
  ];

  typesReport: Array<ITypesReport> = [
    {id: 2, value: 'New'},
    {id: 3, value: 'Resolved'},
    {id: 1, value: 'Alerts Total'},
    {id: 226, value: 'Alerts By Identifier', type: 'identifier'},
    {id: 226, value: 'Alerts By Name', type: 'name'},
    {id: 226, value: 'Alerts By Action Reason', type: 'actionReason'},
    {id: 226, value: 'Alerts By Status', type: 'status'},
    {id: 226, value: 'Alerts By Priority', type: 'priority'},
    {id: 215, value: 'Alerts By Duration'},
    // {id: 4, value: 'Unresolved'}
  ];
  dateRangeChangeEvent: string;
  selectedStatus = NotificationStatus.New;
  filteredIdentifiers: Array<{ id: any, value: string }> = [{id: null, value: null}];
  filteredReasons: Array<{ id: any, value: string }> = [{id: null, value: null}];
  queries = ['', '', '', '', '', '', ''];
  createdAtOrResolvedOn = 'createdAt';
  selectTypeName: FormGroup = this.fb.group({
    type_name: ['Alerts Total']
  });
  private unsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sourceService: SourceService,
    private actionService: ActionService
  ) {
  }

  get createdAtOrResolved(): string {
    return this.createdAtOrResolvedOn;
  }

  public static _getDateRange(option: number) {
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
    this.selectTypeName.controls.type_name.setValue('Alerts Total');
    this.selectTypeName.get('type_name').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
      if (value !== 'default') {
        if (value === 'New' || value === 'Resolved') {
          this.queries[1] = `status eq ${value === 'New' ? '100' : '200'}`;
        } else if (value !== 'New' && value !== 'Resolved') {
          this.queries[1] = ``;
        }
        const typeReason = this.typesReport.find(item => item.value === value);
        this.searchGraph.emit(typeReason);
      }
    });
    this.sourceService.getSources().subscribe((resp) => {
      if (resp.data.length) {
        resp.data.map((item, index) => {
          this.filteredIdentifiers[index] = {id: item.identifierType.id, value: item.identifierType.value};
        });
        this.filteredIdentifiers = removeDuplicates(this.filteredIdentifiers, 'id');
        this.filteredIdentifiers = orderBy(this.filteredIdentifiers, 'value');
        this.filteredIdentifiers.unshift({id: -1, value: 'Any'});
      }
    });
    this.actionService.getActions(``).subscribe((respActions) => {
      if (respActions.results.length) {
        respActions.results.map((item, index) => {
          this.filteredReasons[index] = {id: item.reasonId, value: item.reason};
        });
      }
      this.filteredReasons = removeDuplicates(this.filteredReasons, 'id');
      this.filteredReasons = orderBy(this.filteredReasons, 'value');
      this.filteredReasons.unshift({id: -1, value: 'Any'});
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  filterChanged(e, index?): void {
    if (this.currentView === 'list-view') {
      this.queries[1] = `status eq ${this.selectedStatus}`;
    }
    this.queries[index] = e;
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  filterChangedDateOrLocations(e): void {
    if (e.index === 4) {
      this.queries[6] = e.data;
    }
    if (e.index === 5) {
      this.queries[5] = e.data;
    }
    if (this.currentView === 'list-view') {
      this.queries[1] = `status eq ${this.selectedStatus}`;
    }
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  statusFilterChange(e): void {
    this.selectedStatus = e;
    this.selectedStatusOut.emit(this.selectedStatus);
    if (+this.selectedStatus === 100) {
      this.createdAtOrResolvedOn = 'createdAt';
    } else if (+this.selectedStatus === 200) {
      this.createdAtOrResolvedOn = 'resolvedOn';
    }
    setTimeout(() => {
      this.dateRangeFilter.dateRangeChange(+this.dateRangeChangeEvent);
    }, 300);
    this.filterChanged(`status eq ${this.selectedStatus}`, 1);
  }

  resetDateFilter() {
    this.dateRangeFilter.clear();
  }

  changePriorityFilter(type: string): void {
    this.typeFilterRef.first.typeFilterForm.get('normal').setValue(false);
    this.typeFilterRef.first.typeFilterForm.get('high').setValue(false);
    this.typeFilterRef.first.typeFilterForm.get('critical').setValue(false);
    this.typeFilterRef.first.typeFilterForm.get(type).setValue(true);
  }

  clearSearch(locationFilters, dateRangeFilter): void {
    this.selectedStatus = NotificationStatus.New;
    this.createdAtOrResolvedOn = 'createdAt';
    if (this.identifierTypeFilter) {
      this.identifierTypeFilter.setAnyIdentifierType();
    }
    this.reasonFilter.setDefaultReason();
    dateRangeFilter.clear();
    locationFilters.clearLocations();
    this.typeFilterRef.first.typeFilterForm.get('normal').setValue(true);
    this.typeFilterRef.first.typeFilterForm.get('high').setValue(true);
    this.typeFilterRef.first.typeFilterForm.get('critical').setValue(true);
    this.resetGraph.emit(true);
    this.selectTypeName.controls.type_name.setValue('Alerts Total');
    this.queries = ['', '', '', '', '', this._buildDateQuery(AlertsSidebarComponent._getDateRange(1)), ''];
    this.changeFilterBtn.emit(this.queries.filter(x => x).join(' and '));
    this.changeFilterGraph.emit(this.queries.filter(x => x).join(' and '));
    this.updateAlertsReports.emit(true);
  }

  clickResetBtn(): void {
    this.clearBtn.nativeElement.click();
  }

  searchAlerts(): void {
    if (this.currentView === 'list-view') {
      if (this.dateRangeFilter.dateRange === 7) {
        this.dateRangeFilter.dateRangeChange(7, true);
      }
      this.changeFilterBtn.emit(this.queries.filter(x => x).join(' and '));
    } else if (this.currentView === 'reports-view') {
      this.changeFilterGraph.emit(this.queries.filter(x => x).join(' and '));
    }
    this.updateAlertsReports.emit(true);
  }

  public _buildDateQuery(range): string {
    return `status eq 100 and (${this.createdAtOrResolvedOn} ge ${range.start} and ${this.createdAtOrResolvedOn} lt ${range.end})`;
  }
}
