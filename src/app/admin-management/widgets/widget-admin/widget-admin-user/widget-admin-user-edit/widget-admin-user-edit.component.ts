import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IUser, UserService } from '@one-core/service/user.service';
import { OrganisationService } from '@one-core/service/organisation.service';
import { CommonService } from '@one-core/service/common.service';
import { AdminManagementService } from '../../../../services/admin-management.service';
import { ToastrService } from '../../../../services/toastr.service';
import { UserRoleLabel } from '../../../../../core/models/authentication';

@Component({
  selector: 'one-admin-widget-admin-user-edit',
  templateUrl: './widget-admin-user-edit.component.html',
  styleUrls: ['./widget-admin-user-edit.component.scss']
})
export class WidgetAdminUserEditComponent implements OnInit {

  @Input() selectedUser: IUser;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  isReadonly = false;
  firstName = '';
  lastName = '';
  user: IUser = {id: '', firstName: '', lastName: '', fullName: '', email: '', role: '', teamName: '', siteName: ''};
  roles: Array<any> = [
    {label: UserRoleLabel.Admin, value: '2'},
    {label: UserRoleLabel.NormalUser, value: '4'},
  ];

  constructor(
    private userService: UserService,
    private orgService: OrganisationService,
    private adminService: AdminManagementService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.selectedUser) {
      if (this.selectedUser.id) {
        this.user = JSON.parse(JSON.stringify(this.selectedUser));
        this.checkUser();
      }
    }
  }

  async onEditUser() {
    try {
      this.isLoading = true;
      if (this.user.organizations) { // from user search
        const index = this.user.organizations.findIndex(x => x.organizationId === this.commonService.organisation.id);
        if (index > -1) { // user is in this organization
          await this.orgService.editOrganisationUser(this.commonService.organisation.id, this.user.userId, this.user).toPromise();
        } else {
          await this.orgService.setOrgUser(this.commonService.organisation.id, this.user.id).toPromise();
          await this.orgService.assignUserRoleInOrg(this.commonService.organisation.id, this.user.id, this.user.role).toPromise();
        }
      } else { // just user edit
        await this.orgService.editOrganisationUser(this.commonService.organisation.id, this.user.userId, this.user).toPromise();
      }
      this.close.emit({res: this.user});
    } catch (e) {
      if (e.error.errorMessage === `User name '${this.user.email}' is already taken.`) {
        this.toastr.error(`This email address is already associated with a different user.`, e);
      } else {
        this.toastr.error(null, e);
      }
    } finally {
      this.isLoading = false;
    }
  }

  private async checkUser() {
    try {
      if (this.user.organizations) { // from user search
        this.isReadonly = true;
        this.user.mobile = this.user.phoneNumber;
        this.user.userId = this.user.id;
        const index = this.user.organizations.findIndex(x => x.organizationId === this.commonService.organisation.id);
        if (index > -1) { // user is in this organization
          this.isReadonly = false;
          // TODO: get organization user role
        } else {
          this.toastr.warning('This user belongs to a different organisation. But you can still invite them to your organisation.');
        }
      } else { // just user edit
        this.isReadonly = false;
      }
    } catch (e) {
      console.error(e);
    }
  }

}
