import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IWebhooks, WebhooksService } from '@one-core/service/webhooks.service';
import { ToastrService } from '../../../../services/toastr.service';

export interface ISuperAdminOutputs {
  value: string;
  type?: string;
  id: number;
}

@Component({
  selector: 'one-admin-widget-admin-webhooks-add',
  templateUrl: './widget-admin-webhooks-add.component.html',
  styleUrls: ['./widget-admin-webhooks-add.component.scss']
})
export class WidgetAdminWebhooksAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedWebhooks: IWebhooks;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  webhooks: IWebhooks = {id: 0, tenantKey: '', url: '', name: '', typeId: 1};
  superAdminOutput: Array<ISuperAdminOutputs> = [{id: 1, value: 'SuperAdminOutputs_1'}, {id: 2, value: 'SuperAdminOutputs_2'}, {id: 3, value: 'SuperAdminOutputs_3'}];

  constructor(
    private toastr: ToastrService,
    private webhooksService: WebhooksService
  ) {
  }

  ngOnInit(): void {
    if (this.selectedWebhooks) {
      if (this.selectedWebhooks.id) {
        this.webhooks = JSON.parse(JSON.stringify(this.selectedWebhooks));
        this.webhooks.typeId = 1;
      }
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.isNew) {
      this.webhooksService.createWebhooks(this.webhooks).subscribe((res: IWebhooks) => {
        this.isLoading = false;
        if (res.id > 0) {
          this.toastr.success('Successfully created a output');
          this.close.emit({success: true, isNew: true, data: res});
        } else {
          this.toastr.error(null);
        }
      }, (err) => {
        this.toastr.error(null, err);
        this.isLoading = false;
      });
    } else {
      this.webhooksService.editWebhooks(this.webhooks).subscribe(() => {
        this.isLoading = false;
        this.toastr.success('Successfully updated the output');
        this.close.emit({success: true, isNew: false, data: this.webhooks});
      }, (err) => {
        this.toastr.error(null, err);
        this.isLoading = false;
      });
    }
  }
}
