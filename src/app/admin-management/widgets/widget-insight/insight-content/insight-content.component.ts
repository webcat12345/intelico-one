import { Component, OnInit } from '@angular/core';
// One - Services
import { Chart } from 'angular-highcharts';
import { TypeInfo } from '../widget-insight.component';
import { CountService } from '@one-core/service/count.service';
import { ReportService } from '@one-core/service/report.service';
import { ToastrService } from '../../../services/toastr.service';
import { formatNumber } from '../../../../core/utils/common.util';
import { Priority, ReportType, TotalAlertByPriority } from '@one-core/model';
import { alertBarOptions, getLabelsForTimeLine, getReportTypeForTimeLine } from '../../../../core/utils/insight.util';
import { isSchemaOn } from '../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-insight-content',
  templateUrl: './insight-content.component.html',
  styleUrls: ['./insight-content.component.scss']
})
export class InsightContentComponent implements OnInit {
  Priority = Priority;
  alertByPriorityWidget = [
    {title: 'Normal Alerts', priority: Priority.Normal, class: 'progress-bar-normal', prop: 'normal'},
    {title: 'High Alerts', priority: Priority.High, class: 'progress-bar-high', prop: 'high'},
    {title: 'Critical Alerts', priority: Priority.Critical, class: 'progress-bar-critical', prop: 'critical'},
  ];
  totalAlertsByPriorityLoading = false;
  totalAlertsByPriority: TotalAlertByPriority = {
    normal: 0, high: 0, critical: 0
  };
  alertsReportLoading = false;
  alertsReport = new Chart(alertBarOptions);
  isChart: boolean;
  isShowDashboard: boolean;
  contentCount = 0;
  searchKey: string;
  insightType: number;
  start: string;
  startTime: string;
  end: string;
  endTime: string;
  identifier: string;
  actionReason: string;
  year: any;
  month: any;
  day: any;
  time: any;

  constructor(
    private reportService: ReportService,
    private countService: CountService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  search(start, end, typeInfo: TypeInfo, identifier, reason, customDate): void {
    try {
      this.isChart = true;
      this.start = start;
      this.end = end;
      this.isShowDashboard = false;
      if (customDate.start) {
        // tslint:disable-next-line
        this.startTime = `${customDate.start.substr(8, 2)}-${customDate.start.substr(5, 2)}-${customDate.start.substr(0, 4)}, ${customDate.start.substr(11, 8)}`;
        // tslint:disable-next-line
        this.endTime = `${customDate.end.substr(8, 2)}-${customDate.end.substr(5, 2)}-${customDate.end.substr(0, 4)}, ${customDate.end.substr(11, 8)}`;
      } else {
        this.startTime = `${start.substr(8, 2)}-${start.substr(5, 2)}-${start.substr(0, 4)}, ${start.substr(11, 8)}`;
        this.endTime = `${end.substr(8, 2)}-${end.substr(5, 2)}-${end.substr(0, 4)}, ${end.substr(11, 8)}`;
      }
      this.identifier = identifier;
      this.actionReason = reason;
      this.insightType = typeInfo.id;
      //  this.getTotalAlertByPriority();
      this.getTotalAlertsByHours();
    } catch (e) {

    } finally {

    }
  }

  resetChart(): void {
    this.isChart = false;
    this.start = '';
    this.end = '';
    this.contentCount = 0;
    this.totalAlertsByPriority = {normal: 0, critical: 0, high: 0};
    this.setAlertsReport({id: 0, type: ''});
  }

  public platformStatusDashboard(): void {
    this.isShowDashboard = true;
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

  private async getTotalAlertsByHours(): Promise<void> {
    try {
      this.alertsReportLoading = true;
      const type = getReportTypeForTimeLine(this.start, this.end, this.insightType);
      const res: any = await this.reportService.getReport(type, this.start.substr(0, 19), isSchemaOn(this.start, this.end)).toPromise();
      res.data = this.convertDate(res.data);
      const labels = getLabelsForTimeLine(this.start, this.end, this.insightType);
      let values = [];
      if (res && res.data) {
        values = labels.map(label => {
          const val = res.data.find(item => {
            if (type === ReportType.TotalActivityByDay || type === ReportType.TotalAlertsByDay) {
              return label === `${formatNumber(item.row[3])}:00`;
            } else if (type === ReportType.TotalActivityByMonth || type === ReportType.TotalAlertsByMonth) {
              return label === `${item.row[1]}/${item.row[0]}`;
            } else if (type === ReportType.TotalActivityByYear || type === ReportType.TotalAlertsByYear) {
              return label === `${item.row[0]}`;
            } else {
              return label === `${item.row[2]}/${item.row[1]}/${item.row[0]}`;
            }
          });
          return val ? val.row[val.row.length - 1] : 0;
        });
      }
      this.alertsReport = new Chart({
        ...alertBarOptions,
        xAxis: {
          ...alertBarOptions.xAxis,
          categories: labels
        },
        series: [
          {
            ...alertBarOptions.series[0],
            data: values
          }
        ]
      });
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.alertsReportLoading = false;
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

  private async getTotalAlertByPriority(): Promise<void> {
    try {
      this.totalAlertsByPriorityLoading = true;
      const type = getReportTypeForTimeLine(this.start, this.end, this.insightType);
      const res: any = await this.reportService.getReport(type, this.start.substr(0, 19), isSchemaOn(this.start, this.end)).toPromise();
      if (res.data) {
        const tmp: TotalAlertByPriority = {normal: 0, critical: 0, high: 0};
        res.data.forEach(x => {
          if (x.row[0] === Priority.Normal) {
            tmp.normal = x.row[1];
          } else if (x.row[0] === Priority.High) {
            tmp.high = x.row[1];
          } else {
            tmp.critical = x.row[1];
          }
        });
        this.totalAlertsByPriority = tmp;
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.totalAlertsByPriorityLoading = false;
    }
  }
}
