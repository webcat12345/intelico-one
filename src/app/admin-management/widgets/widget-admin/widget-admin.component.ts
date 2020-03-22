import { Component, OnInit } from '@angular/core';
import { AdminManagementService } from '../../services/admin-management.service';
import { adminMeta } from '../../meta/admin-meta';

@Component({
  selector: 'one-admin-widget-admin',
  templateUrl: './widget-admin.component.html',
  styleUrls: ['./widget-admin.component.scss']
})
export class WidgetAdminComponent implements OnInit {

  adminMenus = adminMeta.filter(x => x.menuType === 'admin');

  constructor(
    private adminManagementService: AdminManagementService
  ) {
  }

  ngOnInit() {
  }

  openSubWidows(windowType): void {
    this.adminManagementService.openAdminSubWindow(windowType);
  }

}
