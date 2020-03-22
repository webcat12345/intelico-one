import { Component, OnInit } from '@angular/core';
import { AdminManagementService } from '../../services/admin-management.service';
import { adminMeta } from '../../meta/admin-meta';

@Component({
  selector: 'one-admin-widget-super-admin',
  templateUrl: './widget-super-admin.component.html',
  styleUrls: ['./widget-super-admin.component.scss']
})
export class WidgetSuperAdminComponent implements OnInit {

  meta = adminMeta.filter(x => x.menuType === 'intelico');

  constructor(
    private adminManagementService: AdminManagementService
  ) {
  }

  ngOnInit() {
  }

  openSubWidows(windowType): void {
    if (windowType) {
      this.adminManagementService.openAdminSubWindow(windowType);
    }
  }

}
