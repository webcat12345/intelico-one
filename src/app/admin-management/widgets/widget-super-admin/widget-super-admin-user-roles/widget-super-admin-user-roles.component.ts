import { Component, OnInit } from '@angular/core';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';

@Component({
  selector: 'one-admin-widget-super-admin-user-roles',
  templateUrl: './widget-super-admin-user-roles.component.html',
  styleUrls: ['./widget-super-admin-user-roles.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminUserRolesComponent implements OnInit {

  showAddModal = false;

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  data: Array<any> = [
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
    {id: '1', name: 'Organization Admin'},
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
