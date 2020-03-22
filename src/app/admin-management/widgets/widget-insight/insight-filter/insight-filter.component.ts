import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
// One - Services
import { TypeInfo } from '../widget-insight.component';
import { ReasonFilterComponent } from '@one-common/filter/reason-filter/reason-filter.component';
import { InsightReportTypeFilterComponent } from './insight-report-type-filter/insight-report-type-filter.component';
import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';
import { ResolvedReasonFilterComponent } from '@one-common/filter/resolved-reason-filter/resolved-reason-filter.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValueFilterComponent } from '@one-common/filter/value-filter/value-filter.component';
import { InsightSaveFiltersFormat } from '../widget-insight.service';

@Component({
  selector: 'one-admin-insight-filter',
  templateUrl: './insight-filter.component.html',
  styleUrls: ['./insight-filter.component.scss']
})
export class InsightFilterComponent implements OnInit, OnChanges {

  @Input() dataInsightSaveFilters: InsightSaveFiltersFormat;
  @Input() canBeDisabled: boolean;

  @ViewChild(DateRangeFilterComponent, {static: true}) dateRangeFilter: DateRangeFilterComponent;
  @ViewChild(ReasonFilterComponent, {static: true}) reasonFilter: ReasonFilterComponent;
  @ViewChild(ResolvedReasonFilterComponent, {static: true}) resolvedReasonFilter: ResolvedReasonFilterComponent;
  @ViewChild(InsightReportTypeFilterComponent, {static: true}) reportTypeFilter: InsightReportTypeFilterComponent;
  @ViewChild(ValueFilterComponent, {static: true}) valueFilter: ValueFilterComponent;

  @Output() changeCustomFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadInsight: EventEmitter<{ isLoad: boolean, identifier: string, reason: string }> = new EventEmitter<{ isLoad: boolean, identifier: string, reason: string }>();
  @Output() clearFilters: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reportType: EventEmitter<{ id: number, type: string }> = new EventEmitter<{ id: number, type: string }>();
  @Output() changeFilter: EventEmitter<{ data: string, index: number }> = new EventEmitter<{ data: string, index: number }>();
  @Output() customFilterSelected: EventEmitter<any> = new EventEmitter<any>();

  isReportType: boolean;
  isRun: boolean;
  isDisabledReason = true;
  isDisabledLocationAndDate = true;
  isDisabledTriggerCondition = true;
  isDisabledResolvedReason = true;
  typeInfoId: number;
  identifier = '';
  actionReason = '';
  resolvedReason = '';

  filterIdentifier: FormGroup = this.fb.group({
    identifier: ['']
  });

  constructor(private fb: FormBuilder) {
  }

  get isDisabledReasonFilter() {
    return this.isDisabledReason;
  }

  get isDisabledResolvedReasonFilter() {
    return this.isDisabledResolvedReason;
  }

  get isDisabledLocationAndDateFilter() {
    return this.isDisabledLocationAndDate;
  }

  get isDisabledTriggerConditionFilter() {
    return this.isDisabledTriggerCondition;
  }

  ngOnInit() {
    this.filterIdentifier.get('identifier').valueChanges.subscribe(identifier => {
      this.identifier = identifier;
      if (identifier === '') {
        // this.isRun = false;
      } else {
        //  this.isRun = true;
      }
    });
    this.filterIdentifier.get('identifier').disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataInsightSaveFilters) {
      this.reportTypeFilter.setReportTypeForm(this.dataInsightSaveFilters.reportType.toString());
    }
  }

  filterChanged(e) {
    this.actionReason = e ? e : '';
    if (this.actionReason !== '' && this.typeInfoId === 4 || this.actionReason !== '' && this.typeInfoId === 1 || this.actionReason !== '' && this.typeInfoId === 6) {
      this.isRun = true;
    }
  }

  filterChangedResolvedReason(e) {
    this.resolvedReason = e ? e : '';
    if (this.resolvedReason !== '' && this.typeInfoId === 6) {
      this.isRun = true;
    }
  }

  clearSearch() {
    this.clearFilters.emit(true);
    // this.reasonFilter.setDefaultReason();
    this.resolvedReasonFilter.setDefaultReason();
  }

  loadInsightFilters() {
    if (this.dateRangeFilter.dateRange === 7) {
      this.dateRangeFilter.dateRangeChange(7, true);
    }
    this.loadInsight.emit({isLoad: true, identifier: this.identifier, reason: this.actionReason});
  }

  filterChangedTriggerCondition(e) {
  }

  reportTypeEvent(e: TypeInfo) {
    this.typeInfoId = e.id;
    if (e.id === 0) {
      this.isDisabledReason = true;
      this.isDisabledLocationAndDate = false;
      this.isDisabledTriggerCondition = false;
      this.isDisabledResolvedReason = true;
      this.filterIdentifier.get('identifier').enable();
      this.isRun = true;
    } else if (e.id === 1) {
      this.isDisabledReason = true;
      this.isDisabledLocationAndDate = false;
      this.isDisabledTriggerCondition = true;
      this.isDisabledResolvedReason = false;
      this.filterIdentifier.get('identifier').enable();
      this.isRun = true;
    } else if (e.id === 2) {
      this.isDisabledReason = true;
      this.isDisabledLocationAndDate = false;
      this.isDisabledTriggerCondition = true;
      this.isDisabledResolvedReason = false;
      this.filterIdentifier.get('identifier').enable();
      this.isRun = true;
    }
    /* if (e.id === 0) {
       this.isDisabledReason = true;
       this.isDisabledResolvedReason = true;
       this.filterIdentifier.get('identifier').disable();
       this.isRun = true;
     } else if (e.id === 1) {
       this.isDisabledReason = false;
     } else if (e.id === 3 || e.id === 2) {
       this.isDisabledReason = true;
       this.isDisabledResolvedReason = true;
       this.filterIdentifier.get('identifier').enable();
     } else if (e.id === 6) {
       this.isDisabledReason = true;
       this.isDisabledResolvedReason = false;
       this.filterIdentifier.get('identifier').disable();
     }*/
    if (e.id === 3 || e.id === 2 || e.id === 0) {
      // this.isReportType = true;
    } else if (e.id === 1 && this.actionReason === '') {
      //  this.isRun = false;
    } else if (e.id === 1 && this.actionReason !== '') {
      //  this.isRun = true;
    } else if (e.id === 4 && this.actionReason === '') {
      //  this.isReportType = false;
    } else if (e.id === 4 && this.actionReason !== '') {
      //  this.isReportType = true;
    } else if (e.id === 6 && this.resolvedReason === '') {
      this.isRun = false;
    } else if (e.id === 6 && this.resolvedReason !== '') {
      this.isRun = true;
    } else if (e.id === 3 || e.id === 2) {
      //  this.readonlyIdentifier = false;
    } else {
      //  this.readonlyIdentifier = true;
    }
    this.reportType.emit(e);
  }

  resetChart() {
    this.isDisabledReason = true;
    this.isDisabledResolvedReason = true;
    this.filterIdentifier.get('identifier').disable();
    this.isReportType = true;
    this.isDisabledReason = true;
    this.isDisabledLocationAndDate = true;
    this.isDisabledTriggerCondition = true;
    this.isDisabledResolvedReason = true;
    this.identifier = '';
    this.actionReason = '';
    this.resolvedReason = '';
    this.reportTypeFilter.resetReportTypesForm();
    this.valueFilter.setDefaultValue();
    this.dateRangeFilter.clear();
  }
}
