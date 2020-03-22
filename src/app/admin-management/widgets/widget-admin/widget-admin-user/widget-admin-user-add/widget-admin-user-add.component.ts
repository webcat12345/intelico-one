import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { switchMap } from 'rxjs/operators';

import { OrganisationService } from '@one-core/service/organisation.service';
import { IUser, UserService } from '@one-core/service/user.service';
import { CommonService } from '@one-core/service/common.service';
import { ToastrService } from '../../../../services/toastr.service';
import { AdminManagementService } from '../../../../services/admin-management.service';
import { UserRole, UserRoleLabel } from '../../../../../core/models/authentication';

@Component({
  selector: 'one-admin-widget-admin-user-add',
  templateUrl: './widget-admin-user-add.component.html',
  styleUrls: ['./widget-admin-user-add.component.scss']
})
export class WidgetAdminUserAddComponent implements OnInit {

  @Input() isAddWindow: boolean;
  @Input() noMatch: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() closeAddWindow: EventEmitter<any> = new EventEmitter();

  email = '';
  newUser: IUser = {id: '', firstName: '', lastName: '', email: '', phoneNumber: '', organizationIds: [], role: 'User'};
  roles: Array<any> = [
    {label: UserRoleLabel.Admin, value: UserRole.Admin},
    {label: UserRoleLabel.NormalUser, value: UserRole.User},
  ];

  isLoading = false;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private adminService: AdminManagementService,
    private organisationService: OrganisationService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    if (this.isAddWindow) {
      this.noMatch = true;
      this.newUser.role = UserRole.Admin;
    }
  }

  async onSearch() {
    try {
      this.isLoading = true;
      const res = await this.organisationService.searchOrgUsersByEmail(this.email).toPromise();
      if (res) {
        this.close.emit({isNew: false, res});
      } else {
        this.noMatch = true;
        this.newUser.email = this.email;
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async onCreate() {
    if (this.isAddWindow) {
      this.adminService.setAssocationStore(this.newUser, 'user');
      this.closeAddWindow.emit(true);
      return;
    }
    try {
      this.isLoading = true;
      this.newUser.fullName = this.newUser.firstName + ' ' + this.newUser.lastName;
      this.newUser.tenantKey = this.commonService.tenantKey;
      this.newUser.newRole = this.newUser.role;
      this.newUser.teamId = '0';
      delete this.newUser.id;

      const res: any = await this.createOrgUser(this.newUser).toPromise();
      this.toastr.success('Successfully created a new user.');
      this.close.emit({isNew: true, res: null});
    } catch (e) {
      if (e.error.errorMessage === `User name '${this.newUser.email}' is already taken.`) {
        this.toastr.error(`This email address is already associated with a different user.`, e);
      } else {
        this.toastr.error(null, e);
      }
    } finally {
      this.isLoading = false;
    }
  }

  createOrgUser(user) {
    return this.userService.createUser(user).pipe(
      switchMap((x: any) => this.organisationService.setOrgUser(this.commonService.organisation.id, x.id).pipe(
        switchMap((x2: any) => this.organisationService.assignUserRoleInOrg(this.commonService.organisation.id, x.id, this.newUser.role)))
      )
    );
  }

}
