import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IWebhooks } from '@one-core/service/webhooks.service';

@Component({
  selector: 'one-admin-widget-admin-webhooks-preview-super-admin',
  templateUrl: './widget-admin-webhooks-preview-super-admin.component.html',
  styleUrls: ['./widget-admin-webhooks-preview-super-admin.component.scss']
})
export class WidgetAdminWebhooksPreviewSuperAdminComponent implements OnInit {
  @Input() isNew: boolean;
  @Input() selectedWebhooks: IWebhooks;
  @Output() close: EventEmitter<any> = new EventEmitter();
  jsonStr: string;
  jsonObject = {
    type: 'events',
    data: {
      name: 'Enter',
      agentId: 'e35ef601-5e3d-4fcb-b7be-a75bde',
      createdOn: '2019-09-29',
      identifier: 'PLATE123',
      pictureUrl: 'dooropen.jpg',
      metaData: {
        color: 'metallic grey',
        make: 'Honda',
        model: 'City',
        year: '2009'
      }
    }
  };

  constructor() {
  }

  ngOnInit() {
    this.jsonStr = JSON.stringify(this.jsonObject, undefined, 2);
  }

}
