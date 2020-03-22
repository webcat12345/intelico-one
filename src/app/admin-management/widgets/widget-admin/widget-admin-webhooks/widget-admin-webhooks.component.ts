import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { flyIn } from '@one-animation/flyIn.animation';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { IWebhooks, IWebhooksList, WebhooksService } from '@one-core/service/webhooks.service';

export enum OutputsSASteps {
  Add,
  Preview
}


@Component({
  selector: 'one-admin-widget-admin-webhooks',
  templateUrl: './widget-admin-webhooks.component.html',
  styleUrls: ['./widget-admin-webhooks.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminWebhooksComponent implements OnInit, OnDestroy {

  data: string;
  showAddModal = false;
  showConfirmModal = false;
  isLoading = false;
  isAddModal = false;
  selectedWebhooks: IWebhooks = null;
  UserRole = UserRole;
  info: Array<TableInfo> = [];
  currentSteps = OutputsSASteps.Add;
  currentStep = OutputsSASteps;

  searchKey = '';
  webhooksList: IWebhooksList = {data: [], totalCount: 0};

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private webhooksService: WebhooksService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.data === 'adminOutputs') {
      this.info = [
        {label: 'Name', name: 'name', width: '20%', isLink: false},
        {label: 'Type', name: 'type', width: '20%', isLink: false},
        {label: 'URL', name: 'url', width: '', isLink: false},
        {label: '', name: 'action_group', width: '115px', isLink: false},
      ];
    } else if (this.data === 'intelicoOutputs') {
      this.info = [
        {label: 'Name', name: 'name', width: '45%', isLink: false},
        {label: 'Outputs', name: 'url', width: '100%', isLink: false},
        {label: '', name: 'action_group', width: '115px', isLink: false},
      ];
    }
    this.getWebhooks();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.isAddModal = true;
    this.selectedWebhooks = null;
  }

  getWebhooks() {
    this.isLoading = true;
    this.webhooksService.getWebhooks().subscribe((res: IWebhooksList) => {
      this.webhooksList = res;
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(null, err);
    });
  }

  onRemoveWebhooks(e) {
    this.showConfirmModal = true;
    this.selectedWebhooks = e;
  }

  onEditWebhooks(e): void {
    this.isAddModal = false;
    this.selectedWebhooks = e;
    this.showAddModal = true;
  }

  onDelete(flag) {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedWebhooks = null;
      return;
    }
    this.isLoading = true;
    this.webhooksService.removeWebhooks(this.selectedWebhooks.id).subscribe(() => {
      this.toastr.success('Output is deleted.');
      this.reset();
      this.getWebhooks();
    }, (err) => {
      this.reset();
      this.toastr.error(null, err);
    });
  }

  reset() {
    this.isLoading = false;
    this.showConfirmModal = false;
    this.selectedWebhooks = null;
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getWebhooks();
    }
    this.showAddModal = false;
  }

}
