import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { Chart } from 'angular-highcharts';
import { ReportType } from '@one-core/model';
import { ReportService } from '@one-core/service/report.service';
import { ToastrService } from '../../../../services/toastr.service';
import { IDate } from '../../../widget-alerts/widget-alerts.component';
import { TypeInfo } from '../../../widget-insight/widget-insight.component';
import { alertBarOptions, getLabelsForTimeLine, getReportTypeForTimeLine, totalEventsEnter, totalEventsEnterExit, totalEventsExit } from '../../../../../core/utils/insight.util';
import { formatNumber } from '../../../../../core/utils/common.util';
import { isSchemaOn } from '../../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-activity-report-graphs',
  templateUrl: './activity-report-graphs.component.html',
  styleUrls: ['./activity-report-graphs.component.scss']
})
export class ActivityReportGraphsComponent implements OnInit {

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  @Input() locationFilter: string;
  @Output() clearTotalEnterExit: EventEmitter<boolean> = new EventEmitter();

  isChart: boolean;
  alertsReportLoading: boolean;
  activityOptions = new Chart(alertBarOptions);

  // activityOptions = new Chart(totalEventsEnterExit);
  startTime: string;
  endTime: string;
  start: string;
  metadata: string;
  end: string;
  year: any;
  month: any;
  day: any;
  time: any;
  totalEnterExit: { enter: number, exit: number } = {enter: 0, exit: 0};

  insightType = 0;
  reportType: string;
  filterSideBar: string;
  contentCount = 0;
  typeRequest: number;
  labelsGraph: Array<any> = [];
  valuesGraph: Array<any> = [];

  constructor(
    private toastr: ToastrService,
    private reportService: ReportService
  ) {
  }

  ngOnInit(): void {
    this.search(this.date.start, this.date.end, {
        id: 111,
        type: null
      }, null,
      null,
      this.customDate,
      this.getFilter,
      null);
  }
  private get getFilter(): string {
    let filter = `createdAt ge ${this.date.start.substr(0, 19)}.000Z and createdAt lt ${this.date.end.substr(0, 19)}.000Z`;
    if (this.locationFilter) {
      filter = `(${filter}) and ${this.locationFilter}`;
    }
    return filter;
  }

  search(start, end, typeInfo: TypeInfo, identifier?, reason?, customDate?, filter?: string, metadata?: string): void {
    this.totalEnterExit.exit = 0;
    this.totalEnterExit.enter = 0;
    this.activityOptions = null;
    this.start = start;
    this.end = end;
    this.isChart = false;
    this.filterSideBar = filter;
    this.metadata = metadata;
    this.insightType = typeInfo.id;
    this.reportType = typeInfo.type;
    if (this.isCustomDate) {
      this.start = customDate.start;
      this.end = customDate.end;
      // tslint:disable-next-line
      this.startTime = `${customDate.start.substr(8, 2)}-${customDate.start.substr(5, 2)}-${customDate.start.substr(0, 4)}, ${customDate.start.substr(11, 8)}`;
      // tslint:disable-next-line
      this.endTime = `${customDate.end.substr(8, 2)}-${customDate.end.substr(5, 2)}-${customDate.end.substr(0, 4)}, ${customDate.end.substr(11, 8)}`;
    } else {
      this.startTime = `${start.substr(8, 2)}-${start.substr(5, 2)}-${start.substr(0, 4)}, ${start.substr(11, 8)}`;
      this.endTime = `${end.substr(8, 2)}-${end.substr(5, 2)}-${end.substr(0, 4)}, ${end.substr(11, 8)}`;
    }
    if (typeInfo.id === 1) {
      this._getTotalEventsEnterExit();
    }
    if (typeInfo.id === 2) {
      this._getTotalEventsEnter();
    }
    if (typeInfo.id === 3) {
      this._getTotalEventsExit();
    }
    if (typeInfo.id !== 1 && typeInfo.id !== 2 && typeInfo.id !== 3) {
      this.getActivityReportsBy();
    }
  }

  setValuesGraph(res, insightType: number) {
    if (insightType === 111) {
      this.valuesGraph = this.labelsGraph.map(label => {
        const val = res.data.find(item => {
          if (this.typeRequest === ReportType.TotalActivityMinutes) {
            return label === `00:${formatNumber(item.row[4])}`;
          } else if (this.typeRequest === ReportType.TotalActivityByHours) {
            return label === `${formatNumber(item.row[3])}:00`;
          } else if (this.typeRequest === ReportType.TotalActivityByMonth) {
            return label === `${item.row[1]}/${item.row[0]}`;
          } else if (this.typeRequest === ReportType.TotalActivityByYear) {
            return label === `${item.row[0]}`;
          } else if (this.typeRequest === ReportType.TotalActivity) {
            return `${item.row[1]}`;
          } else {
            return label === `${item.row[2]}/${item.row[1]}/${item.row[0]}`;
          }
        });
        return val ? val.row[val.row.length - 1] : 0;
      });
    }
    if (insightType === 112) {
      res.data.map((item, index) => {
        if (res.data.length === 1) {
          this.valuesGraph.unshift('');
          this.valuesGraph.unshift('');
          this.valuesGraph.unshift('');
          this.valuesGraph.push(item.row[0].count);
          this.valuesGraph.push(null);
          this.valuesGraph.push(null);
          this.valuesGraph.push(null);
          this.labelsGraph.unshift('');
          this.labelsGraph.unshift('');
          this.labelsGraph.unshift('');
          if (this.reportType === 'identifier') {
            this.labelsGraph.push(item.row[0].identifier);
          } else if (this.reportType === 'identifierType') {
            this.labelsGraph.push(item.row[0].identifierType);
          } else if (this.reportType === 'source') {
            this.labelsGraph.push(item.row[0].source);
          }
          this.labelsGraph.push('');
          this.labelsGraph.push('');
          this.labelsGraph.push('');
        } else if (res.data.length > 1) {
          this.valuesGraph.push(item.row[0].count);
          if (this.reportType === 'identifier') {
            this.labelsGraph.push(item.row[0].identifier);
          } else if (this.reportType === 'identifierType') {
            this.labelsGraph.push(item.row[0].identifierType);
          } else if (this.reportType === 'source') {
            this.labelsGraph.push(item.row[0].source);
          }
        }
      });
    }
    if (insightType === 110) {
      res.data.map((item, index) => {
        if (res.data.length === 1) {
          this.valuesGraph.unshift(null);
          this.valuesGraph.unshift(null);
          this.valuesGraph.unshift(null);
          this.valuesGraph.push(item.row[1].count);
          this.valuesGraph.push(null);
          this.valuesGraph.push(null);
          this.valuesGraph.push(null);
          this.labelsGraph.unshift(null);
          this.labelsGraph.unshift(null);
          this.labelsGraph.unshift(null);
          this.labelsGraph.push(null);
          this.labelsGraph.push(null);
          this.labelsGraph.push(null);
        } else if (res.data.length > 1) {
          this.labelsGraph.push(item.row[0]);
          this.valuesGraph.push(item.row[1]);
        }
      });
    }
  }

  setActivityChart(insightType: number) {
    if (insightType === 111) {
      this.activityOptions = new Chart({
        ...alertBarOptions,
        xAxis: {
          ...alertBarOptions.xAxis,
          categories: this.labelsGraph
        },
        series: [
          {
            ...alertBarOptions.series[0],
            data: this.valuesGraph
          }
        ]
      });
    }
    if (insightType === 112 || insightType === 110) {
      this.activityOptions = new Chart({
        ...alertBarOptions,
        xAxis: {
          ...alertBarOptions.xAxis,
          categories: this.labelsGraph,
          labels: {autoRotationLimit: 13}
        },
        series: [
          {
            ...alertBarOptions.series[0],
            data: this.valuesGraph
          }
        ]
      });
    }
  }

  resetChart(): void {
    this.isChart = false;
    this.start = '';
    this.end = '';
    this.contentCount = 0;
    this.resetActivityReport({
      id: 0,
      type: ''
    });
  }

  private getActivityReportsBy(): void {
    this.alertsReportLoading = true;
    this.typeRequest = getReportTypeForTimeLine(this.start, this.end, this.insightType);
    if (this.typeRequest === 112) {
      /* this.reportService.getReportGroupBy(this.typeRequest, 'name', this.filterSideBar)
         .subscribe(
           res => console.log(res),
           error => console.log(error)
         );
 */
      this.reportService.getReportGroupBy(this.typeRequest, this.reportType, this.filterSideBar, isSchemaOn(this.date.start, this.date.end))
        .subscribe(res => {
          if (res.data.length === 0) {
            this.clearTotalEnterExit.emit(true);
          }
          this.labelsGraph = [];
          this.labelsGraph = getLabelsForTimeLine(this.start, this.end, this.insightType);
          this.valuesGraph = [];
          if (res && res.data) {
            this.setValuesGraph(res, this.insightType);
          }
          this.setActivityChart(this.insightType);
          this.alertsReportLoading = false;
          this.isChart = true;
        }, error => {
          console.log(error);
          this.alertsReportLoading = false;
          this.toastr.error(null, error);
        });
    }
    if (this.typeRequest === 110) {
      this.reportService.getReportMetadata(this.typeRequest, this.start, this.end, this.metadata, isSchemaOn(this.date.start, this.date.end))
        .subscribe(
          res => {
            if (res.data.length === 0) {
              this.clearTotalEnterExit.emit(true);
            }
            this.labelsGraph = [];
            this.labelsGraph = getLabelsForTimeLine(this.start, this.end, this.insightType);
            this.valuesGraph = [];
            if (res && res.data) {
              this.setValuesGraph(res, this.insightType);
            }
            this.setActivityChart(this.insightType);
            this.alertsReportLoading = false;
            this.isChart = true;
          }, error => {
            console.log(error);
            this.alertsReportLoading = false;
            this.toastr.error(null, error);
          }
        );
    }
    if (this.typeRequest !== 112 && this.typeRequest !== 110) {
      this.reportService.getReport(this.typeRequest, this.filterSideBar, isSchemaOn(this.date.start, this.date.end))
        .subscribe(
          res => {
            if (res.data.length === 0) {
              this.clearTotalEnterExit.emit(true);
            }
            this.labelsGraph = [];
            this.labelsGraph = getLabelsForTimeLine(this.start, this.end, this.insightType);
            this.valuesGraph = [];
            if (res && res.data) {
              this.setValuesGraph(res, this.insightType);
            }
            this.setActivityChart(this.insightType);
            this.alertsReportLoading = false;
            this.isChart = true;
          }, error => {
            console.log(error);
            this.alertsReportLoading = false;
            this.toastr.error(null, error);
          }
        );
    }
  }

  private resetActivityReport(typeInfo: TypeInfo): void {
    const categories = [];
    categories[0] = ``;
    categories[1] = `from - ${this.start.substr(0, 10)}`;
    categories[2] = `${typeInfo.type} - ${this.contentCount}`;
    categories[3] = `to - ${this.end.substr(0, 10)}`;
    categories[4] = ``;

    this.activityOptions = new Chart({
      ...totalEventsEnterExit,
      xAxis: {
        ...totalEventsEnterExit.xAxis,
        categories
      },
      series: [
        {
          ...alertBarOptions.series[0],
          data: [0, 0, this.contentCount, 0, 0]
        }
      ]
    });
  }

  private convertDate(data) {
    data.map((item, index) => {
      item = this.convertTime(item);
    });
    return data;
  }

  private convertTime(data): void {
    data.row.map((item, indx) => {
      if (indx === 0) {
        this.year = item;
        this.year = this.year.toString();
      } else if (indx === 1) {
        this.month = item < 10 ? '0' + item : item;
        this.month = this.month.toString();
      } else if (indx === 2) {
        this.day = item < 10 ? '0' + item : item;
        this.day = this.day.toString();
      } else if (indx === 3) {
        this.time = item < 10 ? '0' + item : item;
        this.time = this.time.toString();
        if (this.year && this.month && this.day && this.time) {
          const newTime = new Date(`${this.year}-${this.month}-${this.day}T${this.time}:00:00.000Z`);
          data.row[indx] = newTime.getHours() - 1;
          this.year = null;
          this.month = null;
          this.day = null;
          this.time = null;
        }
      }
    });
    return data;
  }

  private _getTotalEventsExit(): void {
    this.alertsReportLoading = true;
    this.reportService.getReportEnterExit(108, this.start.substr(0, 19), this.end.substr(0, 19), isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        res => {
          if (res.data.length > 0) {
            res.data.map((item) => {
              if (item.row[0].name === 'exit' || item.row[0].name === 'Exit') {
                this.totalEnterExit.exit = item.row[0].count;
              }
            });
            this.activityOptions = new Chart({
              ...totalEventsExit,
              xAxis: {
                ...totalEventsExit.yAxis,
                // categories: labels
              },
              series: [
                {
                  ...totalEventsExit.series[0],
                  data: ['', '', this.totalEnterExit.exit, '', '']
                }
              ]
            });
            this.isChart = true;
          }
          if (res.data.length === 0) {
            this.activityOptions = null;
            this.isChart = false;
            this.totalEnterExit.enter = 0;
            this.totalEnterExit.exit = 0;
          }
          this.alertsReportLoading = false;
        }, error => {
          console.log(error);
          this.alertsReportLoading = false;
        }
      );
  }

  private _getTotalEventsEnter(): void {
    this.alertsReportLoading = true;
    this.reportService.getReportEnterExit(108, this.start.substr(0, 19), this.end.substr(0, 19), isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        res => {
          if (res.data.length > 0) {
            res.data.map((item) => {
              if (item.row[0].name === 'enter' || item.row[0].name === 'Enter') {
                this.totalEnterExit.enter = item.row[0].count;
              }
            });
            this.activityOptions = new Chart({
              ...totalEventsEnter,
              xAxis: {
                ...totalEventsEnter.yAxis,
                // categories: labels
              },
              series: [
                {
                  ...totalEventsEnter.series[0],
                  data: ['', '', this.totalEnterExit.enter, '', '']
                }
              ]
            });
            this.isChart = true;
          }
          if (res.data.length === 0) {
            this.activityOptions = null;
            this.isChart = false;
            this.totalEnterExit.enter = 0;
            this.totalEnterExit.exit = 0;
          }
          this.alertsReportLoading = false;
        }, error => {
          console.log(error);
          this.alertsReportLoading = false;
        }
      );
  }

  private _getTotalEventsEnterExit(): void {
    this.alertsReportLoading = true;
    this.reportService.getReportEnterExit(108, this.start.substr(0, 19), this.end.substr(0, 19), isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        res => {
          if (res.data.length > 0) {
            res.data.map((item) => {
              if (item.row[0].name === 'enter' || item.row[0].name === 'Enter') {
                this.totalEnterExit.enter = item.row[0].count;
              } else if (item.row[0].name === 'exit' || item.row[0].name === 'Exit') {
                this.totalEnterExit.exit = item.row[0].count;
              }
            });
            this.activityOptions = new Chart({
              ...totalEventsEnterExit,
              xAxis: {
                ...totalEventsEnterExit.yAxis,
                // categories: labels
              },
              series: [
                {
                  ...totalEventsEnterExit.series[0],
                  data: ['', '', this.totalEnterExit.enter, '', '']
                },
                {
                  ...totalEventsEnterExit.series[1],
                  data: ['', '', this.totalEnterExit.exit, '', '']
                }
              ]
            });
            this.isChart = true;
          }
          if (res.data.length === 0) {
            this.activityOptions = null;
            this.isChart = false;
          }
          this.alertsReportLoading = false;
        }, error => {
          console.log(error);
          this.alertsReportLoading = false;
        }
      );
  }
}
