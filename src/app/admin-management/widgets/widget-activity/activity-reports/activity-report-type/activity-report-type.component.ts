import { Component, Input, OnInit } from '@angular/core';
// One - Services
import { ReportService } from '@one-core/service/report.service';
import { IDate } from '../../../widget-alerts/widget-alerts.component';
import { isSchemaOn } from '../../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-activity-report-type',
  templateUrl: './activity-report-type.component.html',
  styleUrls: ['./activity-report-type.component.scss']
})
export class ActivityReportTypeComponent implements OnInit {

  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  @Input() locationFilter: string;

  activityByIdentifier: Array<any> = [];
  activityByIdentifierType: Array<any> = [];
  activityBySource: Array<any> = [];
  activityByIdentifierTypeLoading: boolean;
  activityByIdentifierLoading: boolean;
  activityBySourceLoading: boolean;

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
    this.activityByIdentifierTypeLoading = true;
    this.activityByIdentifierLoading = true;
    this.activityBySourceLoading = true;
    this.reportService.getReportGroupBy(112, 'identifier', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        resp => {
          this.activityByIdentifier = [];
          this.activityByIdentifierLoading = false;
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.activityByIdentifier.push(item);
              }
            });
          }
        }, error => {
          this.activityByIdentifierLoading = false;
          console.log(error);
        }
      );
    this.reportService.getReportGroupBy(112, 'identifierType,historyItemSource', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        resp => {
          this.activityByIdentifierType = [];
          this.activityByIdentifierTypeLoading = false;
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.activityByIdentifierType.push(item);
              }
            });
          }
        }, error => {
          this.activityByIdentifierTypeLoading = false;
          console.log(error);
        }
      );
    this.reportService.getReportGroupBy(112, 'sourceId,source', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(
        resp => {
          this.activityBySourceLoading = false;
          this.activityBySource = [];
          if (resp.data.length > 0) {
            const sorted = resp.data.sort((val1, val2) => {
              return val2.row[2] - val1.row[2];
            });
            sorted.map((item, index) => {
              if (index <= 5) {
                this.activityBySource.push(item);
              }
            });
          }
        }, error => {
          this.activityBySourceLoading = false;
          console.log(error);
        }
      );
  }
}
