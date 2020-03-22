import { Component, OnInit } from '@angular/core';
// One - Services
import { IUser, UserService } from '@one-core/service/user.service';
import { ToastrService } from '../../../services/toastr.service';
import { CommonService } from '@one-core/service/common.service';

@Component({
  selector: 'one-admin-widget-settings-profile-tab',
  templateUrl: './widget-settings-profile-tab.component.html',
  styleUrls: ['./widget-settings-profile-tab.component.scss']
})
export class WidgetSettingsProfileTabComponent implements OnInit {

  isLoading = false;
  role: any = '';
  contact: IUser = {id: '', firstName: '', lastName: '', email: '', role: ''};

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.getMyContact();
  }

  async getMyContact(): Promise<void> {
    try {
      this.isLoading = true;
      const res: any = await this.userService.getAccount().toPromise();
      this.contact = res.item;
      this.role = this.commonService.userRole;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(f): Promise<void> {
    try {
      this.isLoading = true;
      //  await this.userService.editUser(this.contact).toPromise();
      this.toastr.success('Your Profile updated successfully.');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
