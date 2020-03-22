import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { ToastrService } from '../../../../services/toastr.service';
import { IType, TypesService } from '@one-core/service/types.service';
import { ISuperAdminTypeWindowLabel } from '../../../../interfaces/superAdminTypeWindowLabel.interface';

@Component({
  selector: 'one-admin-widget-admin-resolved-reason-add',
  templateUrl: './widget-admin-resolved-reason-add.component.html',
  styleUrls: ['./widget-admin-resolved-reason-add.component.scss']
})
export class WidgetAdminResolvedReasonAddComponent implements OnInit {

  @Input() label: ISuperAdminTypeWindowLabel;
  @Input() isNew: boolean;
  @Input() editData: IType;
  @Input() apiUrl: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  type: IType = {value: '', category: '', isDeleted: false, iconUrl: null};

  constructor(
    private typesService: TypesService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    if (this.editData) {
      this.editData.name = this.editData.value;
      if (this.editData.id) {
        this.type = JSON.parse(JSON.stringify(this.editData));
      }
    }
  }

  async onSubmitType(): Promise<void> {
    let res: IType = {value: '', category: '', isDeleted: false};
    try {
      this.isLoading = true;
      if (this.isNew) {
        res.category = this.apiUrl;
        res.value = this.type.name;
        res.iconUrl = this.type.iconUrl;
        res = await this.typesService.createType(res).toPromise() as IType;
        if (res.id) {
          this.toastr.success(this.label.label + ' created.');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        this.type.value = this.type.name;
        delete this.type.name;
        await this.typesService.editType(this.type.category, this.type).toPromise();
        this.toastr.success(this.label.label + ' updated.');
        this.close.emit({success: true, isNew: false, data: this.type});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  fileChange(event): void {
    this.type.iconUrl = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.type.iconUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeIcon(): void {
    this.type.iconUrl = null;
  }
}
