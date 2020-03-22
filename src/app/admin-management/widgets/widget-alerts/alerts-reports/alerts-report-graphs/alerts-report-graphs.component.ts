import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { Chart } from 'angular-highcharts';
import { IDate } from '../../widget-alerts.component';
import { CountService } from '@one-core/service/count.service';
import { ReportService } from '@one-core/service/report.service';
import { ToastrService } from '../../../../services/toastr.service';
import { formatNumber } from '../../../../../core/utils/common.util';
import { TypeInfo } from '../../../widget-insight/widget-insight.component';
import { ReportType } from '@one-core/model';
import { NotificationService } from '@one-core/service/notification.service';
import { alertBarOptions, getLabelsForTimeLine, getReportTypeForTimeLine } from '../../../../../core/utils/insight.util';
import { isSchemaOn } from '../../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-alerts-report-graphs',
  templateUrl: './alerts-report-graphs.component.html',
  styleUrls: ['./alerts-report-graphs.component.scss'],
})
export class AlertsReportGraphsComponent implements OnInit {

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  @Output() clearNotifyCount: EventEmitter<boolean> = new EventEmitter();
  isChart: boolean;
  alertsReport = new Chart(alertBarOptions);
  startTime: string;
  endTime: string;
  start: string;
  end: string;
  reportType: string;
  time: any;
  alertsReportLoading = false;
  contentCount = 0;
  insightType = 1;
  actionReason: string;
  year: any;
  month: any;
  day: any;
  filterSideBar: string;
  typeRequest: number;
  identifier: string;
  labelsGraph: Array<any> = [];
  longestOpenAlerts: Array<any> = [];
  valuesGraph: Array<any> = [];

  constructor(
    private notificationService: NotificationService,
    private reportService: ReportService,
    private countService: CountService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.search(this.date.start, this.date.end, {id: 1, type: null}, null, null, this.customDate, `(createdAt ge ${this.date.start.substr(0, 19)}.000Z and createdAt lt ${this.date.end.substr(0, 19)}.000Z)`);
  }

  search(start: string, end: string, typeInfo: TypeInfo, identifier?, reason?, customDate?, filter?: string): void {
    this.isChart = true;
    this.start = start;
    this.end = end;
    this.insightType = typeInfo.id;
    this.filterSideBar = filter;
    this.reportType = typeInfo.type;
    if (this.isCustomDate) {
      this.start = customDate.start;
      this.end = customDate.end;
      this.startTime = `${customDate.start.substr(8, 2)}-${customDate.start.substr(5, 2)}-${customDate.start.substr(0, 4)}, ${customDate.start.substr(11, 8)}`;
      this.endTime = `${customDate.end.substr(8, 2)}-${customDate.end.substr(5, 2)}-${customDate.end.substr(0, 4)}, ${customDate.end.substr(11, 8)}`;
    } else {
      this.startTime = `${start.substr(8, 2)}-${start.substr(5, 2)}-${start.substr(0, 4)}, ${start.substr(11, 8)}`;
      this.endTime = `${end.substr(8, 2)}-${end.substr(5, 2)}-${end.substr(0, 4)}, ${end.substr(11, 8)}`;
    }
    this.identifier = identifier;
    this.actionReason = reason;
    this.getAlertsReportsBy();
  }

  resetChart(): void {
    this.isChart = false;
    this.start = '';
    this.end = '';
    this.contentCount = 0;
    this.setAlertsReport({id: 0, type: ''});
  }

  sorByLongest(data: Array<any>) {
    return data.sort((val1, val2) => {
      return val2.row[4] - val1.row[4];
    });
  }

  setValuesGraph(res, insightType: number) {
    if (insightType === 1 || insightType === 2 || insightType === 3) {
      this.valuesGraph = this.labelsGraph.map(label => {
        const val = res.data.find(item => {
          if (this.typeRequest === ReportType.TotalAlertsByMinutes || this.typeRequest === ReportType.TotalOpenAlertsByMinutes || this.typeRequest === ReportType.TotalResolvedAlertsByMinutes) {
            return label === `00:${formatNumber(item.row[4])}`;
          } else if (this.typeRequest === ReportType.TotalAlertsByHours || this.typeRequest === ReportType.TotalOpenAlertsByHours || this.typeRequest === ReportType.TotalResolvedAlertsByHours) {
            return label === `${formatNumber(item.row[3])}:00`;
          } else if (this.typeRequest === ReportType.TotalAlertsByMonth || this.typeRequest === ReportType.TotalOpenAlertsByMonth || this.typeRequest === ReportType.TotalResolvedAlertsByMonth) {
            return label === `${item.row[1]}/${item.row[0]}`;
          } else if (this.typeRequest === ReportType.TotalAlertsByYear || this.typeRequest === ReportType.TotalOpenAlertsByYear || this.typeRequest === ReportType.TotalResolvedAlertsByYear) {
            return label === `${item.row[0]}`;
          } else {
            return label === `${item.row[2]}/${item.row[1]}/${item.row[0]}`;
          }
        });
        return val ? val.row[val.row.length - 1] : 0;
      });
    }
    if (insightType === 226) {
      res.data.map((item, index) => {
        if (res.data.length === 1) {
          this.valuesGraph.unshift(null);
          this.valuesGraph.unshift(null);
          this.valuesGraph.unshift(null);
          this.valuesGraph.push(item.row[0].count);
          this.valuesGraph.push(null);
          this.valuesGraph.push(null);
          this.valuesGraph.push(null);
          this.labelsGraph.unshift(null);
          this.labelsGraph.unshift(null);
          this.labelsGraph.unshift(null);
          if (this.reportType === 'identifier') {
            this.labelsGraph.push(item.row[0].identifier);
          } else if (this.reportType === 'name') {
            this.labelsGraph.push(item.row[0].name);
          } else if (this.reportType === 'actionReason') {
            this.labelsGraph.push(item.row[0].actionReason);
          } else if (this.reportType === 'status') {
            item.row[0].status === 100 ? this.labelsGraph.push('New') : this.labelsGraph.push('Resolved');
          } else if (this.reportType === 'priority') {
            if (item.row[0].priority === 400) {
              this.labelsGraph.push('Critical');
            } else if (item.row[0].priority === 300) {
              this.labelsGraph.push('High');
            } else if (item.row[0].priority === 200) {
              this.labelsGraph.push('Normal');
            }
          }
          this.labelsGraph.push(null);
          this.labelsGraph.push(null);
          this.labelsGraph.push(null);
        }
        if (res.data.length > 1) {
          this.valuesGraph.push(item.row[0].count);
          if (this.reportType === 'identifier') {
            this.labelsGraph.push(item.row[0].identifier);
          } else if (this.reportType === 'name') {
            this.labelsGraph.push(item.row[0].name);
          } else if (this.reportType === 'actionReason') {
            this.labelsGraph.push(item.row[0].actionReason);
          } else if (this.reportType === 'status') {
            item.row[0].status === 100 ? this.labelsGraph.push('New') : this.labelsGraph.push('Resolved');
          } else if (this.reportType === 'priority') {
            if (item.row[0].priority === 400) {
              this.labelsGraph.push('Critical');
            } else if (item.row[0].priority === 300) {
              this.labelsGraph.push('High');
            } else if (item.row[0].priority === 200) {
              this.labelsGraph.push('Normal');
            }
          }
        }
      });
    }
    if (insightType === 215) {
      res.map((item) => {
      //  this.valuesGraph.push(`${item.row[2]} ${item.row[3]} ${item.row[1]} ${this.secondsToDhms(item.row[5])}` + this.secondsToHours(item.row[5]));
        this.valuesGraph.push(this.secondsToHours(item.row[5]));
        this.labelsGraph.push(`${item.row[4]}                 ${item.row[1]} ${item.row[2]} ${item.row[3]} ${this.secondsToDhms(item.row[5])}`);
       // this.labelsGraph.push(`${item.row[2]}`);
      });
    }
    if (insightType === 204) {
      res.data.map((item, index) => {
        this.valuesGraph.push(item.row[2]);
        if (item.row[0] === 400) {
          this.labelsGraph.push('Critical');
        }
        if (item.row[0] === 300) {
          this.labelsGraph.push('High');
        }
        if (item.row[0] === 200) {
          this.labelsGraph.push('Normal');
        }
      });
    }
  }

  setAlertsChart(insightType: number) {
    if (insightType < 100 || insightType === 226) {
      this.alertsReport = new Chart({
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
    if (insightType === 112 || insightType === 215) {
      this.alertsReport = new Chart({
        ...alertBarOptions,
        xAxis: {
          ...alertBarOptions.xAxis,
          categories: this.labelsGraph,
        //  max: 10
         // labels: {autoRotationLimit: 0}
        },
        series: [
          {
            ...alertBarOptions.series[0],
            data: this.valuesGraph,
          }
        ]
      });
    }
  }

  private setAlertsReport(typeInfo: TypeInfo): void {
    const categories = [];
    categories[0] = ``;
    categories[1] = `from - ${this.start.substr(0, 10)}`;
    categories[2] = `${typeInfo.type} - ${this.contentCount}`;
    categories[3] = `to - ${this.end.substr(0, 10)}`;
    categories[4] = ``;

    this.alertsReport = new Chart({
      ...alertBarOptions,
      xAxis: {
        ...alertBarOptions.xAxis,
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

  private getAlertsReportsBy(): void {
    this.alertsReportLoading = true;
    this.typeRequest = getReportTypeForTimeLine(this.start, this.end, this.insightType);
    if (this.typeRequest === 226) {
      this.reportService.getReportGroupBy(this.typeRequest, this.reportType, this.filterSideBar, isSchemaOn(this.date.start, this.date.end))
        .subscribe(res => {
          if (res.data.length === 0) {
            this.clearNotifyCount.emit(true);
          }
          this.labelsGraph = [];
          this.labelsGraph = getLabelsForTimeLine(this.start, this.end, this.insightType);
          this.valuesGraph = [];
          if (res && res.data) {
            if (res && res.data) {
              this.setValuesGraph(res, this.insightType);
            }
            this.setAlertsChart(this.insightType);
          }
          this.alertsReportLoading = false;
          this.isChart = true;
        }, error => {
          console.log(error);
          this.toastr.error(null, error);
        });
    }
    if (this.insightType === 215) {
      this.reportService.getReportNotCount(215, this.date.start.substr(0, 24), this.date.end.substr(0, 24), isSchemaOn(this.date.start, this.date.end))
        .subscribe(res => {
          const newData = this.sorByLongest(res.data);
          this.longestOpenAlerts = [];
          newData.map((item, index) => {
            if (index < 9) {
              this.longestOpenAlerts.push(item);
            }
          });
          if (res.data.length === 0) {
            this.clearNotifyCount.emit(true);
          }
          this.labelsGraph = [];
          this.labelsGraph = getLabelsForTimeLine(this.start, this.end, this.insightType);
          this.valuesGraph = [];
          if (res && res.data) {
            if (res && res.data) {
              this.setValuesGraph(this.longestOpenAlerts, this.insightType);
            }
            this.setAlertsChart(this.insightType);
          }
          this.alertsReportLoading = false;
          this.isChart = true;
        }, error => {
          console.log(error);
          this.toastr.error(null, error);
        });
    }
    if (this.insightType === 1 || this.insightType === 2 || this.insightType === 3) {
      this.reportService.getReport(this.typeRequest, this.filterSideBar, isSchemaOn(this.date.start, this.date.end))
        .subscribe(res => {
          if (res.data.length === 0) {
            this.clearNotifyCount.emit(true);
          }
          this.labelsGraph = [];
          this.labelsGraph = getLabelsForTimeLine(this.start, this.end, this.insightType);
          this.valuesGraph = [];
          if (res && res.data) {
            if (res && res.data) {
              this.setValuesGraph(res, this.insightType);
            }
            this.setAlertsChart(this.insightType);
          }
          this.alertsReportLoading = false;
          this.isChart = true;
        }, error => {
          console.log(error);
          this.toastr.error(null, error);
        });
    }
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

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + (d === 1 ? ' Day, ' : ' Days, ') : '';
    const hDisplay = h > 0 ? h + (h === 1 ? ' Hour, ' : ' Hours, ') : '';
    const mDisplay = m > 0 ? m + (m === 1 ? ' Minute, ' : ' Minutes, ') : '';
    const sDisplay = s > 0 ? s + (s === 1 ? ' Second' : ' Seconds') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  secondsToHours(seconds) {
    seconds = Number(seconds);
    const hours   = Math.floor(seconds / 3600);
    return hours;
  }
}
