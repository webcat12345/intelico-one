import { Component, Input, OnInit } from '@angular/core';
// One - Services
import { IDate } from '../../widget-alerts.component';
import { ReportService } from '@one-core/service/report.service';
import { ToastrService } from '../../../../services/toastr.service';
import { isSchemaOn } from '../../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-alerts-report-type',
  templateUrl: './alerts-report-type.component.html',
  styleUrls: ['./alerts-report-type.component.scss']
})
export class AlertsReportTypeComponent implements OnInit {
  @Input() date: IDate;
  @Input() customDate: IDate;
  @Input() isCustomDate: boolean;
  alertsByIdentifier: Array<any> = [];
  alertsByIdentifierType: Array<any> = [];
  alertsByReasonType: Array<any> = [];
  alertsByIdentifierTypeLoading: boolean;
  alertsByIdentifierLoading: boolean;
  alertsByReasonTypeLoading: boolean;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService
  ) {
  }

  get getFilter(): string {
    return `createdAt ge ${this.date.start.substr(0, 19)}.000Z and createdAt lt ${this.date.end.substr(0, 19)}.000Z`;
  }

  ngOnInit(): void {
    this.getAlertBy();
  }

  getAlertBy() {
    if (this.isCustomDate) {
      this.date.start = this.customDate.start;
      this.date.end = this.customDate.end;
    }
    this.alertsByIdentifierTypeLoading = true;
    this.alertsByIdentifierLoading = true;
    this.alertsByReasonTypeLoading = true;
    this.reportService.getReportGroupBy(226, 'identifier', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(res => {
        this.alertsByIdentifier = [];
        if (res.data.length > 0) {
          const sorted = res.data.sort((val1, val2) => {
            return val2.row[2] - val1.row[2];
          });
          sorted.map((item, index) => {
            if (index <= 5) {
              this.alertsByIdentifier.push(item);
            }
          });
        }
        this.alertsByIdentifierLoading = false;
      }, error => {
        this.alertsByIdentifierLoading = false;
        console.log(error);
        this.toastr.error(null, error);
      });
    this.reportService.getReportGroupBy(226, 'identifierType,identifierTypeId', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(resp => {
        this.alertsByIdentifierType = [];
        if (resp.data.length > 0) {
          const sorted = resp.data.sort((val1, val2) => {
            return val2.row[2] - val1.row[2];
          });
          sorted.map((item, index) => {
            if (index <= 5) {
              this.alertsByIdentifierType.push(item);
            }
          });
        }
        this.alertsByIdentifierTypeLoading = false;
      }, error => {
        this.alertsByIdentifierTypeLoading = false;
        console.log(error);
        this.toastr.error(null, error);
      });
    this.reportService.getReportGroupBy(226, 'actionReason', this.getFilter, isSchemaOn(this.date.start, this.date.end))
      .subscribe(resp => {
        this.alertsByReasonType = [];
        if (resp.data.length > 0) {
          const sorted = resp.data.sort((val1, val2) => {
            return val2.row[2] - val1.row[2];
          });
          sorted.map((item, index) => {
            if (index <= 5) {
              this.alertsByReasonType.push(item);
            }
          });
        }
        this.alertsByReasonTypeLoading = false;
      }, error => {
        this.alertsByReasonTypeLoading = false;
        console.log(error);
        this.toastr.error(null, error);
      });
  }
}
