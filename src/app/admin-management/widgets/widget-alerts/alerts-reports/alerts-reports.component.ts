import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// One - Services
import { Priority } from '@one-core/model';
import { Subject, Subscription } from 'rxjs';
import { IDate } from '../widget-alerts.component';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ReportService } from '@one-core/service/report.service';
import { TypeInfo } from '../../widget-insight/widget-insight.component';
import { NotificationService } from '@one-core/service/notification.service';
import { AlertsReportGraphsComponent } from './alerts-report-graphs/alerts-report-graphs.component';
import { AlertsReportTypeComponent } from './alerts-report-type/alerts-report-type.component';
import { AlertsReportResolvedComponent } from './alerts-report-resolved/alerts-report-resolved.component';
import { isSchemaOn } from '../../../../core/utils/report-schema';

export interface ITypesReport {
  value: string;
  type?: string;
  id: number;
}

export interface INotifyCount {
  normal: number;
  high: number;
  critical: number;
  new: number;
  resolved: number;
}

export enum View {
  TypeView = 'type-view',
  GraphView = 'graph-view',
  ResolvedView = 'resolved-view'
}

@Component({
  selector: 'one-admin-alerts-reports',
  templateUrl: './alerts-reports.component.html',
  styleUrls: ['./alerts-reports.component.scss']
})
export class AlertsReportsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AlertsReportGraphsComponent, {static: false}) alertsReportGraphs: AlertsReportGraphsComponent;
  @ViewChild(AlertsReportTypeComponent, {static: false}) alertsReportType: AlertsReportTypeComponent;
  @ViewChild(AlertsReportResolvedComponent, {static: false}) alertsReportResolved: AlertsReportResolvedComponent;

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  @Input() typeInfo: TypeInfo;
  @Output() currentViewReports: EventEmitter<number> = new EventEmitter();

  Priority = Priority;
  typesReport: Array<ITypesReport> = [{id: 1, value: 'Type'}, {id: 2, value: 'Graph'}, {id: 3, value: 'Resolved'}];
  searchKey: string;
  start: string;
  end: string;
  filterSideBar: string;
  alertsReportLoading: boolean;
  alertsReportOpenResolvedLoading: boolean;
  View = View;
  currentView: View = View.TypeView;
  notifyCount: INotifyCount = {high: 0, critical: 0, normal: 0, new: 0, resolved: 0};
  selectTypeName: FormGroup = this.fb.group({
    type_name: ['']
  });
  subscriptions: Subscription[] = [];
  applyFilter$: Subject<any> = new Subject();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private reportService: ReportService
  ) {
  }

  get getFilter(): string {
    return `createdAt ge ${this.date.start.substr(0, 19)}.000Z and createdAt lt ${this.date.end.substr(0, 19)}.000Z`;
  }

  ngOnInit(): void {
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
            this.currentView = View.ResolvedView;
          }
        }
      }));
    this.getNotifyCount();
  }

  ngAfterViewInit(): void {
    this.applyFilter$.pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => {
        if (this.alertsReportGraphs) {
          this.alertsReportGraphs.search(
            this.date.start,
            this.date.end,
            this.typeInfo,
            null,
            null,
            this.customDate,
            this.filterSideBar
          );
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  getNotifyCount() {
    if (this.isCustomDate) {
      this.date.start = this.customDate.start;
      this.date.end = this.customDate.end;
    }
    this.alertsReportLoading = true;
    this.alertsReportOpenResolvedLoading = true;
    this.reportService.getReportGroupBy(226, 'status', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        res => {
          this.notifyCount.resolved = 0;
          this.notifyCount.new = 0;
          if (res.data.length > 0) {
            res.data.map((item) => {
              if (item.row[0].status === 200) {
                this.notifyCount.resolved = item.row[0].count;
              }
              if (item.row[0].status === 100) {
                this.notifyCount.new = item.row[0].count;
              }
            });
          }
          this.alertsReportOpenResolvedLoading = false;
        }, error => {
          this.alertsReportOpenResolvedLoading = false;
          console.log(error);
        }
      );
    this.reportService.getReportGroupBy(226, 'priority', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        res => {
          this.notifyCount.critical = 0;
          this.notifyCount.high = 0;
          this.notifyCount.normal = 0;
          if (res.data.length > 0) {
            res.data.map((item) => {
              if (item.row[0].priority === 400) {
                this.notifyCount.critical = item.row[0].count;
              }
              if (item.row[0].priority === 300) {
                this.notifyCount.high = item.row[0].count;
              }
              if (item.row[0].priority === 200) {
                this.notifyCount.normal = item.row[0].count;
              }
            });
          }
          this.alertsReportLoading = false;
        }, error => {
          this.alertsReportLoading = false;
          console.log(error);
        }
      );
  }

  resetTypeName(): void {
    if (this.alertsReportGraphs) {
      this.alertsReportGraphs.resetChart();
    }
    this.notifyCount = {
      high: 0,
      critical: 0,
      normal: 0,
      new: 0,
      resolved: 0
    };
  }

  applyFilterNext(filter: string): void {
    this.filterSideBar = filter;
    this.applyFilter$.next();
    if (this.alertsReportType) {
      this.alertsReportType.getAlertBy();
    }
    if (this.alertsReportResolved) {
      this.alertsReportResolved.getAlertsReportResolved();
    }
  }
}
