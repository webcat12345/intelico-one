import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { flyIn } from '@one-animation/flyIn.animation';
import { IIdentifierType } from '../widget-admin-identifier/widget-admin-identifier.interface';
import { AddStep } from './widget-admin-action.enum';

@Component({
  selector: 'one-admin-widget-admin-action',
  templateUrl: './widget-admin-action.component.html',
  styleUrls: ['./widget-admin-action.component.scss'],
  animations: [flyIn(300, 920, true, 0)]
})
export class WidgetAdminActionComponent implements OnInit {

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  enum_addStep = AddStep;
  selectedType: IIdentifierType = {className: '', name: '', title: ''};
  addStep = AddStep.Default;
  showAddModal = false;

  info: Array<TableInfo> = [
    {label: 'Action', name: 'action', width: '', isLink: false},
    {label: 'Identifier', name: 'identifier', width: '15%', isLink: false},
    {label: 'Type', name: 'type', width: '17%', isLink: false},
    {label: 'Trigger', name: 'trigger', width: '12%', isLink: false},
    {label: 'Site', name: 'site', width: '10%', isLink: false},
    {label: 'Urgency', name: 'urgency', width: '12%', isLink: false},
    {label: 'Notify', name: 'notify', width: '12%', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  data: Array<any> = [
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
    {id: '1', action: 'Alert', identifier: 'ABC1234', type: 'Numberplate', trigger: 'Enter', site: 'All', urgency: 'Critical', notify: 'Security'},
  ];

  constructor() {
  }

  ngOnInit() {
    this.showAddModal = this.isAddWindow;
  }

  closeAddSection(isSuccess: boolean): void {
    this.addStep = this.enum_addStep.Default;
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }

  selectIdentifierType(type: IIdentifierType): void {
    this.selectedType = type;
    this.addStep = this.enum_addStep.ActionSearch;
  }

}
