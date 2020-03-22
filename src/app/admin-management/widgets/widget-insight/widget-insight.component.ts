import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { InsightContentComponent } from './insight-content/insight-content.component';
import { InsightFilterComponent } from './insight-filter/insight-filter.component';
import { InsightSaveFiltersFormat, WidgetInsightService } from './widget-insight.service';
import { ToastrService } from '../../services/toastr.service';
import { wait } from '../../../core/utils/common.util';

export enum InsightSteps {
  Default = 0,
  SystemTotals,
  SystemEvents,
  Emissions,
  Advanced
}

export interface TypeInfo {
  id: number;
  type: string;
}

@Component({
  selector: 'one-admin-widget-insight',
  templateUrl: './widget-insight.component.html',
  styleUrls: ['./widget-insight.component.scss']
})
export class WidgetInsightComponent implements AfterViewInit, OnDestroy {

  @ViewChild('resetFileBtn', {static: false}) resetFileBtn: ElementRef;
  @ViewChild(InsightContentComponent, {static: false}) content: InsightContentComponent;
  @ViewChild(InsightFilterComponent, {static: false}) filterComponent: InsightFilterComponent;

  startDate: string;
  typeInfo: TypeInfo;
  endDate: string;
  identifier: string;
  reason: string;
  filterName: string;
  typeDateRange: number;
  isLoading: boolean;
  dataInsightSaveFilters: InsightSaveFiltersFormat;
  showSaveFiltersModal: boolean;
  canBeDisabled = true;
  customDate: any = {};
  insightSteps = InsightSteps.Default;
  enum_addStep = InsightSteps;
  applyFilter$: Subject<any> = new Subject();
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(private widgetInsightService: WidgetInsightService,
              private toastr: ToastrService) {
  }

  public get getDataInsightSaveFiltersFormat() {
    return this.dataInsightSaveFilters;
  }

  ngAfterViewInit() {
    this.applyFilter$.pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => {
        if (this.content) {
          this.content.search(
            this.startDate,
            this.endDate,
            this.typeInfo,
            this.identifier,
            this.reason,
            this.customDate
          );
          //  this.customDate = {};
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  changeCustomFilter(e) {
    this.startDate = e.date.start;
    this.endDate = e.date.end;
    this.typeDateRange = e.typeDateRange;
  }

  customFilterSelected(e) {
    this.customDate.start = e.start;
    this.customDate.end = e.end;
  }

  changeFilter(e) {
  }

  loadInsight(e) {
    if (e.isLoad) {
      this.identifier = e.identifier;
      this.reason = e.reason;
      this.applyFilter$.next();
    }
  }

  clearFilters(e) {
    if (e) {
      this.content.resetChart();
      this.filterComponent.resetChart();
    }
  }

  reportType(e: TypeInfo) {
    this.typeInfo = e;
  }

  saveCurrentView() {
    this.showSaveFiltersModal = true;
  }

  resetFile(el) {
    el.value = '';
  }

  openSavedView(files: FileList) {
    const file = files.item(0);
    if (!file) {
      this.resetFileBtn.nativeElement.click();
      this.toastr.warning('This setting file is invalid. Failed to restore the view. Please try again with different file');
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const text: any = reader.result;
        if (!text) {
          this.resetFileBtn.nativeElement.click();
          this.toastr.warning('This setting file is invalid. Failed to restore the view. Please try again with different file');
          return;
        }
        const data = JSON.parse(text);
        this.dataInsightSaveFilters = data;
        if (!this.dataInsightSaveFilters.hasOwnProperty('reportType')
          || !this.dataInsightSaveFilters.hasOwnProperty('condition')
          || !this.dataInsightSaveFilters.hasOwnProperty('resolvedReason')
          || !this.dataInsightSaveFilters.hasOwnProperty('identifier')
          || !this.dataInsightSaveFilters.hasOwnProperty('locations')
          || !this.dataInsightSaveFilters.hasOwnProperty('dateRange')) {
          this.resetFileBtn.nativeElement.click();
          throw this.toastr.warning('This setting file is invalid. Failed to restore the view. Please try again with different file');
        }
      };
      reader.readAsText(file);
    } catch (e) {
      this.resetFileBtn.nativeElement.click();
      this.toastr.warning('This setting file is invalid. Failed to restore the view. Please try again with different file');
    }
  }

  async saveFilters(flag) {
    if (this.typeDateRange === 7) {
      wait(1000);
    }
    if (flag) {
      try {
        this.isLoading = true;
        const data: InsightSaveFiltersFormat = {
          reportType: this.typeInfo.id,
          condition: null,
          resolvedReason: null,
          identifier: null,
          locations: null,
          dateRange: {
            typeDateRange: this.typeDateRange,
            date: {
              start: this.typeDateRange === 7 ? this.customDate.start : this.startDate,
              end: this.typeDateRange === 7 ? this.customDate.end : this.endDate
            }
          }
        };
        await this.widgetInsightService.saveInsightFilters(data, this.filterName);
      } catch (e) {
        this.toastr.error(null, e);
      } finally {
        this.showSaveFiltersModal = false;
        this.isLoading = false;
        this.filterName = null;
      }
    } else {
      this.showSaveFiltersModal = false;
    }
  }
}
