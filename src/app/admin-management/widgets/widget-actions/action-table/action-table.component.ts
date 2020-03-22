import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AdminManagementService } from '../../../services/admin-management.service';
import { CellType, ExpansionTableColumnInfo } from '@one-common/ui-kit/expansion-table/expansion-table.component';
import { UserRole } from '../../../../core/models/authentication';

@Component({
  selector: 'one-admin-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss']
})
export class ActionTableComponent implements OnInit {

  @ViewChild('typeImage', {static: true}) typeImage;
  @ViewChild('isOutput', {static: true}) isOutput;
  @Input() actions: any[] = [];
  @Output() addIdentifier: EventEmitter<any> = new EventEmitter<any>();
  @Output() editAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteAction: EventEmitter<any> = new EventEmitter<any>();
  emailOption = true;
  UserRole = UserRole;
  displayColumns: ExpansionTableColumnInfo[] = [];

  constructor(
    private adminService: AdminManagementService
  ) {
  }

  ngOnInit() {
    this.displayColumns = [
      {
        name: 'type', label: '', width: '70px',
        header: {type: CellType.empty},
        content: {type: CellType.template, templateRef: this.typeImage},
      },
      {
        name: 'name', label: 'Action Name', width: '', classes: 'full',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'trigger', label: 'Trigger', width: '20%',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'typeAction', label: 'Action', width: '20%',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'hasOutput', label: 'Output', width: '70px',
        header: {type: CellType.default},
        content: {type: CellType.template, templateRef: this.isOutput},
      },
      {
        name: 'createdAt', label: 'Created', width: '90px',
        header: {type: CellType.default},
        content: {type: CellType.date}
      }
    ];
  }

  onChangeOption(e): void {

  }

  openWindow(window, item: any) {
    this.adminService.openAdminSubWindow(window);
  }

}
