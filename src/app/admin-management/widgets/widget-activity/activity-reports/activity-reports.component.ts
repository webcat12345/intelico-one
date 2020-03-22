import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ReportService } from '@one-core/service/report.service';
import { IDate } from '../../widget-alerts/widget-alerts.component';
import { TypeInfo } from '../../widget-insight/widget-insight.component';
import { Priority } from '@one-core/model';
import { ITypesReport } from '../../widget-alerts/alerts-reports/alerts-reports.component';
import { ActivityReportGraphsComponent } from './activity-report-graphs/activity-report-graphs.component';
import { ActivityReportTypeComponent } from './activity-report-type/activity-report-type.component';
import { isSchemaOn } from '../../../../core/utils/report-schema';
import { ActivityReportMetadataComponent } from './activity-report-metadata/activity-report-metadata.component';

export enum View {
  TypeView = 'type-view',
  GraphView = 'graph-view',
  MetadataView = 'metadata-view',
}

@Component({
  selector: 'one-admin-activity-reports',
  templateUrl: './activity-reports.component.html',
  styleUrls: ['./activity-reports.component.scss']
})
export class ActivityReportsComponent implements OnInit, OnDestroy {
  @ViewChild(ActivityReportGraphsComponent, {static: false}) activityReportGraph: ActivityReportGraphsComponent;
  @ViewChild(ActivityReportTypeComponent, {static: false}) activityReportType: ActivityReportTypeComponent;
  @ViewChild(ActivityReportMetadataComponent, {static: false}) activityReportMetadata: ActivityReportMetadataComponent;

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  @Input() typeInfo: TypeInfo;
  @Input() locationFilter: string;
  @Output() currentViewReports: EventEmitter<number> = new EventEmitter();

  Priority = Priority;
  alertsReportLoading: boolean;
  totalEnterExit: { enter: number, exit: number } = {enter: 0, exit: 0};
  isChart: boolean;
  contentCount = 0;
  searchKey: string;
  startTime: string;
  endTime: string;
  identifier: string;
  actionReason: string;
  filterSideBar: string;
  metadata: string;
  time: any;
  View = View;
  selectTypeName: FormGroup = this.fb.group({
    type_name: ['']
  });
  typesReport: Array<ITypesReport> = [
    {id: 1, value: 'Type'},
    {id: 2, value: 'Graph'}
  ];
  currentView: View = View.TypeView;
  subscriptions: Subscription[] = [];
  applyFilter$: Subject<any> = new Subject();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
  }

  private get getFilter(): string {
    let filter = `createdAt ge ${this.date.start.substr(0, 19)}.000Z and createdAt lt ${this.date.end.substr(0, 19)}.000Z`;
    if (this.locationFilter) {
      filter = `(${filter}) and ${this.locationFilter}`;
    }
    return filter;
  }

  ngOnInit(): void {
    this.getEnterExit();
    this.alertsReportLoading = true;
    this.selectTypeName.controls.type_name.setValue('1');
    this.subscriptions.push(
      this.selectTypeName.get('type_name').valueChanges.subscribe(typeId => {
        if (typeId !== 'default') {
          this.currentViewReports.emit(+typeId);
          if (+typeId === 1) {
            this.currentView = View.TypeView;
          } else if (+typeId === 2) {
            this.currentView = View.GraphView;
          } else if (+typeId === 3) {
            this.currentView = View.MetadataView;
          }
        }
      }));
    this.applyFilter$.pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => {
        if (this.activityReportGraph) {
          this.activityReportGraph.search(
            this.date.start,
            this.date.end,
            this.typeInfo,
            null,
            null,
            this.customDate,
            this.filterSideBar,
            this.metadata
          );
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  getEnterExit(): void {
    this.alertsReportLoading = true;
    this.totalEnterExit.enter = 0;
    this.totalEnterExit.exit = 0;
    this.startTime = null;
    this.endTime = null;
    this.totalEnterExit.exit = 0;
    if (this.isCustomDate) {
      this.startTime = this.customDate.start;
      this.endTime = this.customDate.end;
    } else {
      this.startTime = this.date.start.substr(0, 19);
      this.endTime = this.date.end.substr(0, 19);
    }
    this.reportService.getReportGroupBy(112, 'triggerCondition', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        resp => {
          this.alertsReportLoading = false;
          if (resp.data.length > 0) {
            resp.data.map((item) => {
              if (item.row[0].triggerCondition === 'enter' || item.row[0].triggerCondition === 'Enter') {
                this.totalEnterExit.enter = item.row[0].count;
              } else if (item.row[0].triggerCondition === 'exit' || item.row[0].triggerCondition === 'Exit') {
                this.totalEnterExit.exit = item.row[0].count;
              }
            });
          } else if (resp.data.length === 0) {
            this.totalEnterExit.enter = 0;
            this.totalEnterExit.exit = 0;
          }
        }, error => {
          this.alertsReportLoading = false;
          console.log(error);
        }
      );
  }

  resetChart(): void {
    this.isChart = false;
    this.contentCount = 0;
    this.totalEnterExit = {enter: 0, exit: 0};
    if (this.currentView === View.GraphView) {
      this.activityReportGraph.resetChart();
    }
  }

  applyFilterNext(data?: any): void {
    if (data) {
      this.filterSideBar = data.filter;
      this.metadata = data.metadata;
    }
    this.getEnterExit();
    this.applyFilter$.next();
    if (this.activityReportType) {
      this.activityReportType.getActivityBy();
    }
    if (this.activityReportMetadata) {
      this.activityReportMetadata.getActivityBy();
    }
  }
}
