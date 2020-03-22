import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IType, TypesService } from '@one-core/service/types.service';
import { ISuperAdminTypeWindowLabel } from '../../../../../interfaces/superAdminTypeWindowLabel.interface';
import { ToastrService } from '../../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-action-reasons-add',
  templateUrl: './widget-super-admin-action-reasons-add.component.html',
  styleUrls: ['./widget-super-admin-action-reasons-add.component.scss']
})

export class WidgetSuperAdminActionReasonsAddComponent implements OnInit {

  @Input() label: ISuperAdminTypeWindowLabel;
  @Input() isNew: boolean;
  @Input() editData: IType;
  @Input() apiUrl: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  type: IType = {value: '', category: '', isDeleted: false};

  constructor(
    private typesService: TypesService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.editData) {
      if (this.editData.id) {
        this.type = JSON.parse(JSON.stringify(this.editData));
      }
    }
  }

  async onSubmitType() {
    let res: IType = {value: '', category: '', isDeleted: false};
    try {
      this.isLoading = true;
      res.category = this.apiUrl;
      res.value = this.type.value;
      if (this.isNew) {
        res = await this.typesService.createType(res).toPromise() as IType;
        if (res.id) {
          this.toastr.success(this.label.label + ' created.');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        await this.typesService.editType(this.apiUrl, this.type).toPromise();
        this.toastr.success(this.label.label + ' updated.');
        this.close.emit({success: true, isNew: false, data: this.type});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
