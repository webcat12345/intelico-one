import { Component, Input, OnInit } from '@angular/core';

import { IType, TypesService } from '@one-core/service/types.service';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { ISuperAdminTypeWindowLabel } from '../../../interfaces/superAdminTypeWindowLabel.interface';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-types',
  templateUrl: './widget-super-admin-types.component.html',
  styleUrls: ['./widget-super-admin-types.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminTypesComponent implements OnInit {

  @Input() apiUrl: string;
  @Input() label: ISuperAdminTypeWindowLabel;

  showAddModal = false;
  isAddModal = false;
  isLoading = false;
  showConfirmModal = false;
  searchKey = '';
  selectedType: IType = null;
  typeList: any = {data: [], totalCount: 0};

  info: Array<TableInfo> = [
    {label: 'Name', name: 'value', width: '50%', isLink: false},
    {label: 'Additional Fields', name: '', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  constructor(
    private typesService: TypesService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.getTypes();
  }

  async getTypes(): Promise<void> {
    try {
      this.isLoading = true;
      if (this.apiUrl === 'Resolved') {
        this.typeList = await this.typesService.getTypesForResolved(this.apiUrl).toPromise() as any;
      } else {
        this.typeList = await this.typesService.getTypes(this.apiUrl).toPromise() as any;
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onEditType(e): void {
    this.isAddModal = false;
    this.showAddModal = true;
    this.selectedType = e;
  }

  onCreateType(): void {
    this.isAddModal = true;
    this.showAddModal = true;
    this.selectedType = null;
  }

  askConfirm(e): void {
    this.selectedType = e;
    this.showConfirmModal = true;
  }

  onDelete(flag: boolean): void {
    this.showConfirmModal = false;
    if (flag) {
      this.onRemoveType(this.selectedType);
    }
  }

  async onRemoveType(e): Promise<void> {
    try {
      this.isLoading = true;
      await this.typesService.removeType(this.apiUrl, e.id).toPromise();
      await this.getTypes();
      this.toastr.success(this.label.label + 'deleted.');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getTypes();
    }
    this.showAddModal = false;
  }
}
