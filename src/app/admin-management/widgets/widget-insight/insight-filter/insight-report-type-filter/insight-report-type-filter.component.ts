import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export enum ReportTypes {
  ActivityTotal,
  AlertsReason,
  AlertsIdentifier,
  CountIdentifier,
  CountReason,
  CountAlert,
  CountResolved
}

@Component({
  selector: 'one-admin-insight-report-type-filter',
  templateUrl: './insight-report-type-filter.component.html',
  styleUrls: ['./insight-report-type-filter.component.scss']
})
export class InsightReportTypeFilterComponent implements OnInit {

  @Output() reportType: EventEmitter<{ id: number, type: string }> = new EventEmitter<{ id: number, type: string }>();

  reportTypes: Array<{ id: number, type: string }> = [
    {id: 0, type: 'Activity'},
    {id: 1, type: 'Alerts (all)'},
    {id: 2, type: 'Alerts (open)'},
    {id: 3, type: 'Alerts (resolved)'},
  ];
  reportTypesForm: FormGroup = this.fb.group({
    type: ['-1']
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.reportTypesForm.get('type').valueChanges.subscribe(res => {
      this.reportTypes.map((item) => {
        if (item.id === +res) {
          this.reportType.emit({id: item.id, type: item.type});
        }
      });
    });
  }

  resetReportTypesForm() {
    this.reportTypesForm.get('type').setValue('-1');
  }

  setReportTypeForm(type: string) {
    this.reportTypesForm.get('type').setValue(type);
  }

}
