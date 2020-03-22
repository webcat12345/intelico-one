import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IWebhooks } from '@one-core/service/webhooks.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { ISuperAdminOutputs } from '../widget-admin-webhooks-add/widget-admin-webhooks-add.component';

@Component({
  selector: 'one-admin-widget-admin-webhooks-add-super-admin',
  templateUrl: './widget-admin-webhooks-add-super-admin.component.html',
  styleUrls: ['./widget-admin-webhooks-add-super-admin.component.scss']
})
export class WidgetAdminWebhooksAddSuperAdminComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedWebhooks: IWebhooks;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() nextSteps: EventEmitter<any> = new EventEmitter();
  isLoading = false;
  webhooks: IWebhooks = {id: 0, tenantKey: '', url: '', name: '', typeId: 1, fieldFirstName: 'default', fieldMetaDataFirstName: 'default', fieldMetaDataLocation: 'default'};
  info: Array<TableInfo> = [
    {label: '', name: 'identifierType', width: '', isLink: false},
    {label: '', name: 'identifier', width: '', isLink: false},
    {label: '', name: 'action_group', width: '70px', isLink: false},
  ];
  frozenTableData: Array<any> = [];
  fieldFirstName: Array<ISuperAdminOutputs> = [{id: 1, value: 'fieldFirstName_1'}, {id: 2, value: 'fieldFirstName_2'}, {id: 3, value: 'fieldFirstName_3'}];
  fieldMetaDataFirstName: Array<ISuperAdminOutputs> = [{id: 1, value: 'fieldMetaDataFirstName_1'}, {id: 2, value: 'fieldMetaDataFirstName_2'}, {id: 3, value: 'fieldMetaDataFirstName_3'}];
  fieldMetaDataLocation: Array<ISuperAdminOutputs> = [{id: 1, value: 'fieldMetaDataLocation_1'}, {id: 2, value: 'fieldMetaDataLocation_2'}, {id: 3, value: 'fieldMetaDataLocation_3'}];

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.nextSteps.emit(true);
  }

  onRemove(e): void {
    if (this.isNew) {
      const index = this.frozenTableData.findIndex(item => item.identifierType === e.identifierType);
      this.frozenTableData.splice(index, 1);
    }
  }

  addNewIdentifier(identifier, identifierType) {
    this.frozenTableData.push({identifierType: identifier, identifier: identifierType});
  }

}
