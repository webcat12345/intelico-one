import { Component, OnInit } from '@angular/core';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';


@Component({
  selector: 'one-admin-widget-super-admin-output-agents',
  templateUrl: './widget-super-admin-output-agents.component.html',
  styleUrls: ['./widget-super-admin-output-agents.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminOutputAgentsComponent implements OnInit {

  showAddModal = false;

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  data: Array<any> = [
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
    {id: '1', name: 'Text'},
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
