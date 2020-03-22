import { Component, OnInit } from '@angular/core';

import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { flyIn } from '@one-animation/flyIn.animation';
import { UserRole } from '../../../../core/models/authentication';

@Component({
  selector: 'one-admin-widget-admin-asset',
  templateUrl: './widget-admin-asset.component.html',
  styleUrls: ['./widget-admin-asset.component.scss'],
  animations: [
    flyIn(300, 330, true)
  ]
})
export class WidgetAdminAssetComponent implements OnInit {

  showAddModal = false;
  UserRole = UserRole;

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '20%', isLink: false},
    {label: 'Type', name: 'type', width: '', isLink: false},
    {label: 'Fixed', name: 'fixed', width: '12%', isLink: false},
    {label: 'Location', name: 'location', width: '14%', isLink: false},
    {label: 'Companies', name: 'company', width: '12%', isLink: true},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  data: Array<any> = [
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
    {id: '1', name: 'Cash box', type: 'Cash Machine', fixed: 'Yes', location: 'Name', company: 5, contact: 6},
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
