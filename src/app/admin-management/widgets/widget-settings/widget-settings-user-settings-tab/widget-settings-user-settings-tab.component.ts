import { Component, OnInit } from '@angular/core';

import { CommonService } from '@one-core/service/common.service';
import { IUser, UserService } from '@one-core/service/user.service';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-settings-user-settings-tab',
  templateUrl: './widget-settings-user-settings-tab.component.html',
  styleUrls: ['./widget-settings-user-settings-tab.component.scss']
})
export class WidgetSettingsUserSettingsTabComponent implements OnInit {

  isLoading = false;
  contact: IUser = {id: '', firstName: '', lastName: '', email: '', role: ''};

  constructor(
    private toastr: ToastrService,
    private commonService: CommonService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getMyContact();
  }

  async getMyContact() {
    try {
      this.isLoading = true;
      const res: any = await this.userService.getAccount().toPromise();
      this.contact = res.item;
      this.contact.role = this.commonService.userRole;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }
}
