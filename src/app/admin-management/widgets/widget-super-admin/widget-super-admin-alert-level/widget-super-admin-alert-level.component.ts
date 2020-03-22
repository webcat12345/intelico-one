import { Component, OnInit } from '@angular/core';

import { AlertService, IType } from '@one-core/service/alert.service';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-alert-level',
  templateUrl: './widget-super-admin-alert-level.component.html',
  styleUrls: ['./widget-super-admin-alert-level.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminAlertLevelComponent implements OnInit {

  info: Array<TableInfo> = [
    {label: '', name: 'color', width: '72px', isLink: false},
    {label: 'Name', name: 'name', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];
  showAddModal = false;
  isLoading = false;
  isAddModal = false;
  selectedLevel: IType = null;
  searchKey = '';
  levelList: any = {data: [], totalCount: 0};

  constructor(
    private toastr: ToastrService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getLevels();
  }

  async getLevels() {
    try {
      this.isLoading = true;
      this.levelList = await this.alertService.getAlertLevels().toPromise() as any;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCreateLevel(): void {
    this.isAddModal = true;
    this.selectedLevel = null;
    this.showAddModal = true;
  }

  onEditLevel(e): void {
    this.isAddModal = false;
    this.selectedLevel = e;
    this.showAddModal = true;
  }

  async onRemoveLevel(e) {
    try {
      this.isLoading = true;
      await this.alertService.removeAlertLevel(e.id).toPromise();
      await this.getLevels();
      this.toastr.success('Alert level deleted');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      if (action.isNew) {
        this.levelList.totalCount += 1;
        this.levelList.data.push(action.data);
      } else {
        const index = this.levelList.data.findIndex(x => x.id === action.data.id);
        if (index > -1) {
          this.levelList.data[index] = action.data;
        } else {
          this.getLevels();
        }
      }
    }
    this.showAddModal = false;
  }

}
