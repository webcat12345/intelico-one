import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AlertService, IType } from '@one-core/service/alert.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-alert-level-add',
  templateUrl: './widget-super-admin-alert-level-add.component.html',
  styleUrls: ['./widget-super-admin-alert-level-add.component.scss']
})
export class WidgetSuperAdminAlertLevelAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedLevel: IType;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  level: IType = {id: 0, name: ''};

  constructor(
    private toastr: ToastrService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    if (this.selectedLevel) {
      if (this.selectedLevel.id) {
        this.level = JSON.parse(JSON.stringify(this.selectedLevel));
      }
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      if (this.isNew) {
        const res = await this.alertService.createAlertLevel(this.level).toPromise() as IType;
        if (res.id) {
          this.toastr.success('Successfully created a new alert level.');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        await this.alertService.editAlertLevel(this.level).toPromise();
        this.toastr.success('Successfully updated an alert level.');
        this.close.emit({success: true, isNew: false, data: this.level});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
