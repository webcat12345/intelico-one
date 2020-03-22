import { Component, Input, OnInit } from '@angular/core';
// One - Services
import { IDate } from '../../widget-alerts.component';
import { ReportService } from '@one-core/service/report.service';
import { isSchemaOn } from '../../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-alerts-report-resolved',
  templateUrl: './alerts-report-resolved.component.html',
  styleUrls: ['./alerts-report-resolved.component.scss'],
})
export class AlertsReportResolvedComponent implements OnInit {

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  alertsResolvedByUser: Array<any> = [];
  alertsReportLoading: boolean;

  constructor(
    private reportService: ReportService
  ) {
  }

  ngOnInit(): void {
    this.getAlertsReportResolved();
  }

  getAlertsReportResolved() {
    if (this.isCustomDate) {
      this.date.start = this.customDate.start;
      this.date.end = this.customDate.end;
    }
    this.alertsReportLoading = true;
    this.reportService.getReportNotCount(301, this.date.start.substr(0, 19), this.date.end.substr(0, 19), isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        resp => {
          this.alertsResolvedByUser = [];
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.alertsResolvedByUser.push(item);
              }
            });
          }
          this.alertsResolvedByUser.map((item) => {
            item.row[3] = this.secondsToDhms(item.row[3]);
          });
          this.alertsReportLoading = false;
        }, error => {
          this.alertsReportLoading = false;
          console.log(error);
        }
      );
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

}
