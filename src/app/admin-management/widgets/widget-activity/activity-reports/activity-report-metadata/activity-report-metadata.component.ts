import { Component, Input, OnInit } from '@angular/core';

import { IDate } from '../../../widget-alerts/widget-alerts.component';
import { ReportService } from '@one-core/service/report.service';

@Component({
  selector: 'one-admin-one-admin-activity-report-metadata',
  templateUrl: './activity-report-metadata.component.html',
  styleUrls: ['./activity-report-metadata.component.scss']
})
export class ActivityReportMetadataComponent implements OnInit {

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  @Input() locationFilter: string;

  activityByFuel: Array<any> = [];
  activityByMake: Array<any> = [];
  activityByCO2: Array<any> = [];
  activityByMakeLoading: boolean;
  activityByCO2Loading: boolean;
  activityByFuelLoading: boolean;

  constructor(
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
    this.getActivityBy();
  }

  getActivityBy() {
    if (this.isCustomDate) {
      this.date.start = this.customDate.start;
      this.date.end = this.customDate.end;
    }
    this.activityByMakeLoading = true;
    this.activityByCO2Loading = true;
    this.activityByFuelLoading = true;
    this.reportService.getReportGroupBy(112, 'co2', this.getFilter)
      .subscribe(
        resp => {
          this.activityByCO2 = [];
          this.activityByCO2Loading = false;
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.activityByCO2.push(item);
              }
            });
          }
        }, error => {
          this.activityByCO2Loading = false;
          console.log(error);
        }
      );
    this.reportService.getReportGroupBy(112, 'fuel', this.getFilter)
      .subscribe(
        resp => {
          this.activityByFuel = [];
          this.activityByFuelLoading = false;
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.activityByFuel.push(item);
              }
            });
          }
        }, error => {
          this.activityByFuelLoading = false;
          console.log(error);
        }
      );
    this.reportService.getReportGroupBy(112, 'make', this.getFilter)
      .subscribe(
        resp => {
          this.activityByMakeLoading = false;
          this.activityByMake = [];
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.activityByMake.push(item);
              }
            });
          }
        }, error => {
          this.activityByMakeLoading = false;
          console.log(error);
        }
      );
  }
  private getStartDate(): string {
    return `createdAt ge ${this.date.start.substr(0, 19)}.000Z and`;
  }
  private getEndDate(): string {
    return `createdAt lt ${this.date.end.substr(0, 19)}.000Z`;
  }

}
