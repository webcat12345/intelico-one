import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// One - Services
import { Chart } from 'angular-highcharts';
import { ReportService } from '@one-core/service/report.service';
import { totalAlertsByActionReason, totalAlertsByIdentifiers, totalAlertsByName, totalAlertsByStatus } from '../../../../core/utils/insight.util';

@Component({
  selector: 'one-admin-insight-dashboard',
  templateUrl: './insight-dashboard.component.html',
  styleUrls: ['./insight-dashboard.component.scss']
})
export class InsightDashboardComponent implements OnInit {
  @Output() closeDashboard: EventEmitter<boolean> = new EventEmitter<boolean>();

  totalAlertsByIdentifiers = new Chart(totalAlertsByIdentifiers);
  totalAlertsByName = new Chart(totalAlertsByName);
  totalAlertsByActionReason = new Chart(totalAlertsByActionReason);
  totalAlertsByStatus = new Chart(totalAlertsByStatus);
  start = '2019-08-24T00:00:00.996Z';
  end = '2019-09-24T23:59:59.996Z';

  constructor(private reportService: ReportService) {
  }

  async ngOnInit() {
    /*  const alertsByIdentifiers: any = await this.reportService.getReport(200, this.start.substr(0, 19), this.end.substr(0, 19)).toPromise();
      const alertsByName: any = await this.reportService.getReport(201, this.start.substr(0, 19), this.end.substr(0, 19)).toPromise();
      const alertsByActionReason: any = await this.reportService.getReport(202, this.start.substr(0, 19), this.end.substr(0, 19)).toPromise();
      const alertsByStatus: any = await this.reportService.getReport(203, this.start.substr(0, 19), this.end.substr(0, 19)).toPromise();
      this.setTotalAlerts(alertsByIdentifiers.data , 'identifiers');
      this.setTotalAlerts(alertsByName.data , 'name');
      this.setTotalAlerts(alertsByActionReason.data , 'reason');
      this.setTotalAlerts(alertsByStatus.data , 'status');*/
  }

  goBack(): void {
    this.closeDashboard.emit(true);
  }

  private setTotalAlerts(data, type: string): void {
    if (type === 'identifiers') {
      const values = [];
      data.map((item, index) => {
        values[index] = {name: item.row[0], y: item.row[1]};
      });
      this.totalAlertsByIdentifiers = new Chart({
        ...totalAlertsByIdentifiers,
        series: [
          {
            ...totalAlertsByIdentifiers.series[0],
            data: values
          }
        ]
      });
    } else if (type === 'name') {
      const values = [];
      data.map((item, index) => {
        values[index] = {name: item.row[0], y: item.row[1]};
      });
      this.totalAlertsByName = new Chart({
        ...totalAlertsByName,
        series: [
          {
            ...totalAlertsByName.series[0],
            data: values
          }
        ]
      });
    } else if (type === 'reason') {
      const values = [];
      data.map((item, index) => {
        values[index] = {name: item.row[0], y: item.row[1]};
      });
      this.totalAlertsByActionReason = new Chart({
        ...totalAlertsByActionReason,
        series: [
          {
            ...totalAlertsByActionReason.series[0],
            data: values
          }
        ]
      });
    } else if (type === 'status') {
      const values = [];
      data.map((item, index) => {
        values[index] = {name: item.row[0], y: item.row[1]};
      });
      this.totalAlertsByStatus = new Chart({
        ...totalAlertsByStatus,
        series: [
          {
            ...totalAlertsByStatus.series[0],
            data: values
          }
        ]
      });
    }
  }
}
