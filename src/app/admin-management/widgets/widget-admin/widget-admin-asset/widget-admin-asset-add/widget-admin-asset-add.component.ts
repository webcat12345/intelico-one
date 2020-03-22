import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AdminManagementService } from '../../../../services/admin-management.service';

@Component({
  selector: 'one-admin-widget-admin-asset-add',
  templateUrl: './widget-admin-asset-add.component.html',
  styleUrls: ['./widget-admin-asset-add.component.scss']
})
export class WidgetAdminAssetAddComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  center = 'London, United Kingdom';

  constructor(
    private adminManagementService: AdminManagementService
  ) {
  }

  ngOnInit() {
  }

  openSubWindow(windowType: string): void {
    this.adminManagementService.openAdminSubWindow(windowType, true);
  }

}
